import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Plus, Trash2, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Category {
  id: string;
  name_ar: string;
}

interface ImageItem {
  url: string;
  alt?: string;
  is_primary?: boolean;
}

interface ProductFormData {
  sku: string;
  name_ar: string;
  name_en: string;
  slug: string;
  description_ar: string;
  description_en: string;
  short_description_ar: string;
  short_description_en: string;
  category_id: string;
  price: number;
  sale_price: number | null;
  cost_price: number | null;
  stock_quantity: number;
  images: ImageItem[];
  model_3d_url: string;
  video_url: string;
  has_vr_experience: boolean;
  is_featured: boolean;
  is_new: boolean;
  is_active: boolean;
  materials: string[];
  colors: string[];
  tags: string[];
}

const initialFormData: ProductFormData = {
  sku: "",
  name_ar: "",
  name_en: "",
  slug: "",
  description_ar: "",
  description_en: "",
  short_description_ar: "",
  short_description_en: "",
  category_id: "",
  price: 0,
  sale_price: null,
  cost_price: null,
  stock_quantity: 0,
  images: [],
  model_3d_url: "",
  video_url: "",
  has_vr_experience: false,
  is_featured: false,
  is_new: true,
  is_active: true,
  materials: [],
  colors: [],
  tags: [],
};

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchProduct();
    }
  }, [id]);

  async function fetchCategories() {
    const { data } = await supabase
      .from("categories")
      .select("id, name_ar")
      .eq("is_active", true)
      .order("name_ar");
    setCategories(data || []);
  }

  async function fetchProduct() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (data) {
        setFormData({
          ...initialFormData,
          ...data,
          images: (data.images as unknown as ImageItem[]) || [],
          materials: data.materials || [],
          colors: data.colors || [],
          tags: data.tags || [],
        });
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("حدث خطأ في تحميل المنتج");
    } finally {
      setLoading(false);
    }
  }

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function handleChange(field: keyof ProductFormData, value: any) {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === "name_en" && !isEditing) {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
  }

  function addImage() {
    if (!newImageUrl.trim()) return;
    const newImage: ImageItem = {
      url: newImageUrl.trim(),
      is_primary: formData.images.length === 0,
    };
    handleChange("images", [...formData.images, newImage]);
    setNewImageUrl("");
  }

  function removeImage(index: number) {
    const updated = formData.images.filter((_, i) => i !== index);
    if (updated.length > 0 && !updated.some(img => img.is_primary)) {
      updated[0].is_primary = true;
    }
    handleChange("images", updated);
  }

  function setPrimaryImage(index: number) {
    const updated = formData.images.map((img, i) => ({
      ...img,
      is_primary: i === index,
    }));
    handleChange("images", updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!formData.name_ar || !formData.name_en || !formData.slug) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setSaving(true);
    try {
      const productData = {
        ...formData,
        images: formData.images as any,
        category_id: formData.category_id || null,
        sale_price: formData.sale_price || null,
        cost_price: formData.cost_price || null,
      };

      if (isEditing) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", id);
        if (error) throw error;
        toast.success("تم تحديث المنتج بنجاح");
      } else {
        const { error } = await supabase
          .from("products")
          .insert([productData]);
        if (error) throw error;
        toast.success("تم إضافة المنتج بنجاح");
      }
      
      navigate("/admin/products");
    } catch (error: any) {
      console.error("Error saving product:", error);
      if (error.code === "23505") {
        toast.error("الـ SKU أو Slug موجود مسبقاً");
      } else {
        toast.error("حدث خطأ في حفظ المنتج");
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowRight className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isEditing ? "تعديل المنتج" : "إضافة منتج جديد"}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>المعلومات الأساسية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name_ar">الاسم بالعربية *</Label>
                    <Input
                      id="name_ar"
                      value={formData.name_ar}
                      onChange={(e) => handleChange("name_ar", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name_en">الاسم بالإنجليزية *</Label>
                    <Input
                      id="name_en"
                      value={formData.name_en}
                      onChange={(e) => handleChange("name_en", e.target.value)}
                      dir="ltr"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sku">رمز المنتج (SKU)</Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => handleChange("sku", e.target.value)}
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">الرابط (Slug) *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => handleChange("slug", e.target.value)}
                      dir="ltr"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="short_description_ar">وصف قصير بالعربية</Label>
                  <Textarea
                    id="short_description_ar"
                    value={formData.short_description_ar}
                    onChange={(e) => handleChange("short_description_ar", e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description_ar">الوصف الكامل بالعربية</Label>
                  <Textarea
                    id="description_ar"
                    value={formData.description_ar}
                    onChange={(e) => handleChange("description_ar", e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description_en">الوصف بالإنجليزية</Label>
                  <Textarea
                    id="description_en"
                    value={formData.description_en}
                    onChange={(e) => handleChange("description_en", e.target.value)}
                    rows={4}
                    dir="ltr"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>الصور والوسائط</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="أدخل رابط الصورة"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    dir="ltr"
                  />
                  <Button type="button" onClick={addImage} variant="secondary">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img.url}
                        alt={img.alt || `صورة ${index + 1}`}
                        className={`w-full aspect-square object-cover rounded-lg border-2 ${
                          img.is_primary ? "border-primary" : "border-transparent"
                        }`}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => setPrimaryImage(index)}
                          disabled={img.is_primary}
                        >
                          رئيسية
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          onClick={() => removeImage(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {img.is_primary && (
                        <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                          رئيسية
                        </span>
                      )}
                    </div>
                  ))}
                  {formData.images.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-lg text-muted-foreground">
                      <ImagePlus className="h-8 w-8 mb-2" />
                      <p>لا توجد صور - أضف رابط صورة أعلاه</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="model_3d_url">رابط النموذج ثلاثي الأبعاد</Label>
                    <Input
                      id="model_3d_url"
                      value={formData.model_3d_url}
                      onChange={(e) => handleChange("model_3d_url", e.target.value)}
                      placeholder="رابط ملف .glb أو .obj"
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="video_url">رابط الفيديو</Label>
                    <Input
                      id="video_url"
                      value={formData.video_url}
                      onChange={(e) => handleChange("video_url", e.target.value)}
                      placeholder="رابط YouTube أو Vimeo"
                      dir="ltr"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>التسعير والمخزون</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="price">السعر (ر.س) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleChange("price", parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sale_price">سعر التخفيض</Label>
                  <Input
                    id="sale_price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.sale_price || ""}
                    onChange={(e) => handleChange("sale_price", e.target.value ? parseFloat(e.target.value) : null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost_price">سعر التكلفة</Label>
                  <Input
                    id="cost_price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.cost_price || ""}
                    onChange={(e) => handleChange("cost_price", e.target.value ? parseFloat(e.target.value) : null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock_quantity">الكمية المتوفرة</Label>
                  <Input
                    id="stock_quantity"
                    type="number"
                    min="0"
                    value={formData.stock_quantity}
                    onChange={(e) => handleChange("stock_quantity", parseInt(e.target.value) || 0)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>التصنيف</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => handleChange("category_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name_ar}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>الإعدادات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="is_active">نشط</Label>
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => handleChange("is_active", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="is_featured">مميز</Label>
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => handleChange("is_featured", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="is_new">جديد</Label>
                  <Switch
                    id="is_new"
                    checked={formData.is_new}
                    onCheckedChange={(checked) => handleChange("is_new", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="has_vr_experience">يدعم VR</Label>
                  <Switch
                    id="has_vr_experience"
                    checked={formData.has_vr_experience}
                    onCheckedChange={(checked) => handleChange("has_vr_experience", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            إلغاء
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "جاري الحفظ..." : isEditing ? "تحديث المنتج" : "إضافة المنتج"}
          </Button>
        </div>
      </form>
    </div>
  );
}
