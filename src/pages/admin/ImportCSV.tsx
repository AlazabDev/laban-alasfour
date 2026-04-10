import { useState, useRef } from "react";
import { Upload, FileText, Download, AlertCircle, CheckCircle, X } from "lucide-react";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { getErrorCode, getErrorMessage } from "@/lib/errors";
import { toast } from "sonner";

interface CSVRow {
  sku?: string;
  name_ar: string;
  name_en: string;
  slug?: string;
  description_ar?: string;
  description_en?: string;
  category_slug?: string;
  price: string;
  sale_price?: string;
  stock_quantity?: string;
  image_url?: string;
  image_urls?: string;
  model_3d_url?: string;
  video_url?: string;
  is_featured?: string;
  is_new?: string;
  has_vr_experience?: string;
  materials?: string;
  colors?: string;
  tags?: string;
}

interface ImportResult {
  row: number;
  name: string;
  status: "success" | "error";
  message: string;
}

const SAMPLE_CSV = `sku,name_ar,name_en,slug,description_ar,price,sale_price,stock_quantity,category_slug,image_url,image_urls,is_featured,is_new,has_vr_experience,materials,colors,tags
SKU001,كرسي كلاسيكي,Classic Chair,classic-chair,كرسي خشبي مريح بتصميم كلاسيكي,1500,1200,25,chairs,https://example.com/chair1.jpg,https://example.com/chair1-2.jpg|https://example.com/chair1-3.jpg,true,true,false,خشب|قماش,بني|أبيض,كلاسيك|غرفة معيشة
SKU002,طاولة طعام,Dining Table,dining-table,طاولة طعام فاخرة,3500,,10,tables,https://example.com/table1.jpg,,false,true,true,خشب زان,بني غامق,غرفة طعام|فاخر`;

export default function ImportCSV() {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<CSVRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ImportResult[]>([]);
  const [categories, setCategories] = useState<Map<string, string>>(new Map());
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadCategories() {
    const { data } = await supabase.from("categories").select("id, slug");
    const map = new Map<string, string>();
    data?.forEach(cat => map.set(cat.slug, cat.id));
    setCategories(map);
    return map;
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".csv")) {
      toast.error("يرجى اختيار ملف CSV");
      return;
    }

    setFile(selectedFile);
    setResults([]);

    Papa.parse<CSVRow>(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setParsedData(result.data);
        toast.success(`تم تحميل ${result.data.length} صف`);
      },
      error: (error) => {
        toast.error("خطأ في قراءة الملف: " + error.message);
      },
    });
  }

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  async function importProducts() {
    if (parsedData.length === 0) return;

    setImporting(true);
    setProgress(0);
    setResults([]);

    const catMap = await loadCategories();
    const importResults: ImportResult[] = [];
    const total = parsedData.length;

    for (let i = 0; i < parsedData.length; i++) {
      const row = parsedData[i];
      
      try {
        // Parse images
        const images: { url: string; is_primary?: boolean }[] = [];
        if (row.image_url) {
          images.push({ url: row.image_url.trim(), is_primary: true });
        }
        if (row.image_urls) {
          row.image_urls.split("|").forEach(url => {
            if (url.trim()) {
              images.push({ url: url.trim(), is_primary: false });
            }
          });
        }

        // Parse arrays
        const materials = row.materials?.split("|").map(m => m.trim()).filter(Boolean) || [];
        const colors = row.colors?.split("|").map(c => c.trim()).filter(Boolean) || [];
        const tags = row.tags?.split("|").map(t => t.trim()).filter(Boolean) || [];

        const productData = {
          sku: row.sku?.trim() || null,
          name_ar: row.name_ar.trim(),
          name_en: row.name_en.trim(),
          slug: row.slug?.trim() || generateSlug(row.name_en),
          description_ar: row.description_ar?.trim() || null,
          description_en: row.description_en?.trim() || null,
          category_id: row.category_slug ? (catMap.get(row.category_slug.trim()) || null) : null,
          price: parseFloat(row.price) || 0,
          sale_price: row.sale_price ? parseFloat(row.sale_price) : null,
          stock_quantity: parseInt(row.stock_quantity || "0") || 0,
          images,
          model_3d_url: row.model_3d_url?.trim() || null,
          video_url: row.video_url?.trim() || null,
          is_featured: row.is_featured?.toLowerCase() === "true",
          is_new: row.is_new?.toLowerCase() !== "false",
          has_vr_experience: row.has_vr_experience?.toLowerCase() === "true",
          materials,
          colors,
          tags,
          is_active: true,
        };

        const { error } = await supabase.from("products").insert([productData]);

        if (error) {
          if (getErrorCode(error) === "23505") {
            importResults.push({
              row: i + 1,
              name: row.name_ar,
              status: "error",
              message: "SKU أو Slug موجود مسبقاً",
            });
          } else {
            throw error;
          }
        } else {
          importResults.push({
            row: i + 1,
            name: row.name_ar,
            status: "success",
            message: "تم الاستيراد بنجاح",
          });
        }
      } catch (error: unknown) {
        importResults.push({
          row: i + 1,
          name: row.name_ar || `صف ${i + 1}`,
          status: "error",
          message: getErrorMessage(error),
        });
      }

      setProgress(Math.round(((i + 1) / total) * 100));
    }

    setResults(importResults);
    setImporting(false);

    const successCount = importResults.filter(r => r.status === "success").length;
    const errorCount = importResults.filter(r => r.status === "error").length;

    if (errorCount === 0) {
      toast.success(`تم استيراد ${successCount} منتج بنجاح`);
    } else if (successCount === 0) {
      toast.error(`فشل استيراد جميع المنتجات (${errorCount})`);
    } else {
      toast.warning(`تم استيراد ${successCount} منتج، فشل ${errorCount}`);
    }
  }

  function downloadSample() {
    const blob = new Blob([SAMPLE_CSV], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "products_sample.csv";
    link.click();
  }

  function resetImport() {
    setFile(null);
    setParsedData([]);
    setResults([]);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">استيراد المنتجات</h1>
        <p className="text-muted-foreground mt-1">استيراد المنتجات دفعة واحدة من ملف CSV</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              رفع ملف CSV
            </CardTitle>
            <CardDescription>
              اختر ملف CSV يحتوي على بيانات المنتجات
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              {file ? (
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {parsedData.length} منتج جاهز للاستيراد
                  </p>
                </div>
              ) : (
                <div>
                  <p className="font-medium">اسحب الملف هنا أو اضغط للاختيار</p>
                  <p className="text-sm text-muted-foreground">
                    يدعم ملفات CSV فقط
                  </p>
                </div>
              )}
            </div>

            {file && (
              <div className="flex gap-2">
                <Button
                  onClick={importProducts}
                  disabled={importing || parsedData.length === 0}
                  className="flex-1"
                >
                  {importing ? "جاري الاستيراد..." : "بدء الاستيراد"}
                </Button>
                <Button variant="outline" onClick={resetImport}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {importing && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-center text-muted-foreground">
                  {progress}% مكتمل
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>تعليمات الاستيراد</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>هيكل الملف</AlertTitle>
              <AlertDescription>
                يجب أن يحتوي ملف CSV على الأعمدة المطلوبة. قم بتحميل النموذج للمراجعة.
              </AlertDescription>
            </Alert>

            <div className="space-y-2 text-sm">
              <p className="font-medium">الأعمدة المطلوبة:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><code>name_ar</code> - الاسم بالعربية</li>
                <li><code>name_en</code> - الاسم بالإنجليزية</li>
                <li><code>price</code> - السعر</li>
              </ul>
              
              <p className="font-medium mt-4">الأعمدة الاختيارية:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><code>sku</code> - رمز المنتج</li>
                <li><code>slug</code> - الرابط (يُنشأ تلقائياً)</li>
                <li><code>category_slug</code> - رابط الفئة</li>
                <li><code>image_url</code> - رابط الصورة الرئيسية</li>
                <li><code>image_urls</code> - روابط صور إضافية (مفصولة بـ |)</li>
                <li><code>model_3d_url</code> - رابط النموذج ثلاثي الأبعاد</li>
                <li><code>materials</code> - المواد (مفصولة بـ |)</li>
                <li><code>colors</code> - الألوان (مفصولة بـ |)</li>
              </ul>
            </div>

            <Button variant="outline" onClick={downloadSample} className="w-full gap-2">
              <Download className="h-4 w-4" />
              تحميل ملف نموذج
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Preview Data */}
      {parsedData.length > 0 && results.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>معاينة البيانات</CardTitle>
            <CardDescription>
              أول 5 منتجات من الملف
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>الاسم</TableHead>
                    <TableHead>السعر</TableHead>
                    <TableHead>المخزون</TableHead>
                    <TableHead>الصورة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedData.slice(0, 5).map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono">{row.sku || "-"}</TableCell>
                      <TableCell>
                        <div>
                          <p>{row.name_ar}</p>
                          <p className="text-sm text-muted-foreground">{row.name_en}</p>
                        </div>
                      </TableCell>
                      <TableCell>{row.price} ر.س</TableCell>
                      <TableCell>{row.stock_quantity || 0}</TableCell>
                      <TableCell>
                        {row.image_url ? (
                          <img
                            src={row.image_url}
                            alt=""
                            className="w-10 h-10 object-cover rounded"
                          />
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {parsedData.length > 5 && (
              <p className="text-sm text-muted-foreground mt-4 text-center">
                و {parsedData.length - 5} منتج آخر...
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              نتائج الاستيراد
              <Badge variant="default" className="mr-2">
                {results.filter(r => r.status === "success").length} ناجح
              </Badge>
              {results.filter(r => r.status === "error").length > 0 && (
                <Badge variant="destructive">
                  {results.filter(r => r.status === "error").length} فاشل
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">الصف</TableHead>
                    <TableHead>المنتج</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الرسالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result, i) => (
                    <TableRow key={i}>
                      <TableCell>{result.row}</TableCell>
                      <TableCell>{result.name}</TableCell>
                      <TableCell>
                        {result.status === "success" ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-destructive" />
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{result.message}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
