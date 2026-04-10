import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Search, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { getErrorMessage } from "@/lib/errors";
import type { Json } from "@/integrations/supabase/types";
import { toast } from "sonner";

interface ProductImage {
  url: string;
  is_primary?: boolean;
}

interface Product {
  id: string;
  sku: string | null;
  name_ar: string;
  name_en: string;
  price: number;
  stock_quantity: number;
  images: Json;
  is_active: boolean;
  is_featured: boolean;
  category: { name_ar: string } | null;
}

function getProductImages(images: Json): ProductImage[] {
  if (!Array.isArray(images)) {
    return [];
  }

  return images.reduce<ProductImage[]>((result, image) => {
    if (typeof image !== "object" || image === null || !("url" in image)) {
      return result;
    }

    const url = image.url;
    const isPrimary = "is_primary" in image ? image.is_primary : undefined;

    if (typeof url !== "string") {
      return result;
    }

    result.push({
      url,
      is_primary: typeof isPrimary === "boolean" ? isPrimary : undefined,
    });

    return result;
  }, []);
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function fetchProducts() {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          sku,
          name_ar,
          name_en,
          price,
          stock_quantity,
          is_active,
          is_featured,
          images,
          category:categories(name_ar)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("حدث خطأ في تحميل المنتجات");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function toggleActive(id: string, currentStatus: boolean) {
    try {
      const { error } = await supabase
        .from("products")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      setProducts(products.map(p => 
        p.id === id ? { ...p, is_active: !currentStatus } : p
      ));
      toast.success(currentStatus ? "تم إخفاء المنتج" : "تم تفعيل المنتج");
    } catch (error) {
      console.error("Error toggling product:", error);
      toast.error(getErrorMessage(error, "حدث خطأ"));
    }
  }

  async function deleteProduct() {
    if (!deleteId) return;
    
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;
      setProducts(products.filter(p => p.id !== deleteId));
      toast.success("تم حذف المنتج بنجاح");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("حدث خطأ في حذف المنتج");
    } finally {
      setDeleteId(null);
    }
  }

  const filteredProducts = products.filter(p =>
    p.name_ar.includes(search) || 
    p.name_en.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">المنتجات</h1>
          <p className="text-muted-foreground mt-1">إدارة جميع المنتجات</p>
        </div>
        <Link to="/admin/products/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            إضافة منتج
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث بالاسم أو SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-10"
          />
        </div>
      </div>

      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">الصورة</TableHead>
              <TableHead>المنتج</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>الفئة</TableHead>
              <TableHead>السعر</TableHead>
              <TableHead>المخزون</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead className="w-[150px]">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  جاري التحميل...
                </TableCell>
              </TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  لا توجد منتجات
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => {
                const productImages = getProductImages(product.images);
                const primaryImage =
                  productImages.find((img) => img.is_primary)?.url || productImages[0]?.url;
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      {primaryImage ? (
                        <img 
                          src={primaryImage} 
                          alt={product.name_ar}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">لا صورة</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.name_ar}</p>
                        <p className="text-sm text-muted-foreground">{product.name_en}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {product.sku || "-"}
                    </TableCell>
                    <TableCell>{product.category?.name_ar || "-"}</TableCell>
                    <TableCell className="font-medium">
                      {product.price.toLocaleString()} ر.س
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.stock_quantity > 10 ? "default" : product.stock_quantity > 0 ? "secondary" : "destructive"}>
                        {product.stock_quantity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.is_active ? "default" : "secondary"}>
                        {product.is_active ? "نشط" : "مخفي"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleActive(product.id, product.is_active)}
                          title={product.is_active ? "إخفاء" : "تفعيل"}
                        >
                          {product.is_active ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Link to={`/admin/products/${product.id}`}>
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذا المنتج؟</AlertDialogTitle>
            <AlertDialogDescription>
              هذا الإجراء لا يمكن التراجع عنه. سيتم حذف المنتج نهائياً.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={deleteProduct} className="bg-destructive text-destructive-foreground">
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
