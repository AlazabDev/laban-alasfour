import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  name_en: string;
  slug: string;
  description_ar: string | null;
  image_url: string | null;
  parent_id: string | null;
  is_active: boolean;
  sort_order: number;
  children?: Category[];
}

interface FormData {
  id?: string;
  name_ar: string;
  name_en: string;
  slug: string;
  description_ar: string;
  image_url: string;
  parent_id: string | null;
  is_active: boolean;
  sort_order: number;
}

const initialFormData: FormData = {
  name_ar: "",
  name_en: "",
  slug: "",
  description_ar: "",
  image_url: "",
  parent_id: null,
  is_active: true,
  sort_order: 0,
};

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  async function fetchCategories() {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order")
        .order("name_ar");

      if (error) throw error;
      
      // Build tree structure
      const map = new Map<string, Category>();
      const roots: Category[] = [];
      
      data?.forEach(cat => {
        map.set(cat.id, { ...cat, children: [] });
      });
      
      data?.forEach(cat => {
        const node = map.get(cat.id)!;
        if (cat.parent_id && map.has(cat.parent_id)) {
          map.get(cat.parent_id)!.children!.push(node);
        } else {
          roots.push(node);
        }
      });
      
      setCategories(roots);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("حدث خطأ في تحميل الفئات");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function openEditDialog(category?: Category) {
    if (category) {
      setFormData({
        id: category.id,
        name_ar: category.name_ar,
        name_en: category.name_en,
        slug: category.slug,
        description_ar: category.description_ar || "",
        image_url: category.image_url || "",
        parent_id: category.parent_id,
        is_active: category.is_active,
        sort_order: category.sort_order,
      });
    } else {
      setFormData(initialFormData);
    }
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!formData.name_ar || !formData.name_en || !formData.slug) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setSaving(true);
    try {
      const categoryData = {
        name_ar: formData.name_ar,
        name_en: formData.name_en,
        slug: formData.slug,
        description_ar: formData.description_ar || null,
        image_url: formData.image_url || null,
        parent_id: formData.parent_id,
        is_active: formData.is_active,
        sort_order: formData.sort_order,
      };

      if (formData.id) {
        const { error } = await supabase
          .from("categories")
          .update(categoryData)
          .eq("id", formData.id);
        if (error) throw error;
        toast.success("تم تحديث الفئة بنجاح");
      } else {
        const { error } = await supabase
          .from("categories")
          .insert([categoryData]);
        if (error) throw error;
        toast.success("تم إضافة الفئة بنجاح");
      }
      
      setDialogOpen(false);
      fetchCategories();
    } catch (error: any) {
      console.error("Error saving category:", error);
      if (error.code === "23505") {
        toast.error("الـ Slug موجود مسبقاً");
      } else {
        toast.error("حدث خطأ في حفظ الفئة");
      }
    } finally {
      setSaving(false);
    }
  }

  async function deleteCategory() {
    if (!deleteId) return;
    
    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;
      toast.success("تم حذف الفئة بنجاح");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("حدث خطأ في حذف الفئة");
    } finally {
      setDeleteId(null);
    }
  }

  function toggleExpand(id: string) {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function getAllCategories(cats: Category[] = categories): Category[] {
    return cats.reduce((acc: Category[], cat) => {
      acc.push(cat);
      if (cat.children?.length) {
        acc.push(...getAllCategories(cat.children));
      }
      return acc;
    }, []);
  }

  function renderCategory(category: Category, level = 0) {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedIds.has(category.id);

    return (
      <div key={category.id}>
        <div
          className="flex items-center gap-4 p-4 border-b hover:bg-muted/50 transition-colors"
          style={{ paddingRight: `${level * 24 + 16}px` }}
        >
          <div className="w-6">
            {hasChildren && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => toggleExpand(category.id)}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
          
          {category.image_url ? (
            <img
              src={category.image_url}
              alt={category.name_ar}
              className="w-10 h-10 object-cover rounded"
            />
          ) : (
            <div className="w-10 h-10 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
              لا صورة
            </div>
          )}
          
          <div className="flex-1">
            <p className="font-medium">{category.name_ar}</p>
            <p className="text-sm text-muted-foreground">{category.name_en}</p>
          </div>
          
          <Badge variant={category.is_active ? "default" : "secondary"}>
            {category.is_active ? "نشط" : "مخفي"}
          </Badge>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => openEditDialog(category)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive"
              onClick={() => setDeleteId(category.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div>
            {category.children!.map(child => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">الفئات</h1>
          <p className="text-muted-foreground mt-1">إدارة فئات المنتجات</p>
        </div>
        <Button onClick={() => openEditDialog()} className="gap-2">
          <Plus className="h-4 w-4" />
          إضافة فئة
        </Button>
      </div>

      <div className="border rounded-lg bg-card">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">
            جاري التحميل...
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            لا توجد فئات
          </div>
        ) : (
          categories.map(cat => renderCategory(cat))
        )}
      </div>

      {/* Category Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {formData.id ? "تعديل الفئة" : "إضافة فئة جديدة"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name_ar">الاسم بالعربية *</Label>
                <Input
                  id="name_ar"
                  value={formData.name_ar}
                  onChange={(e) => setFormData(prev => ({ ...prev, name_ar: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name_en">الاسم بالإنجليزية *</Label>
                <Input
                  id="name_en"
                  value={formData.name_en}
                  onChange={(e) => {
                    const name_en = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      name_en,
                      slug: prev.id ? prev.slug : generateSlug(name_en),
                    }));
                  }}
                  dir="ltr"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">الرابط (Slug) *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                dir="ltr"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description_ar">الوصف</Label>
              <Input
                id="description_ar"
                value={formData.description_ar}
                onChange={(e) => setFormData(prev => ({ ...prev, description_ar: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">رابط الصورة</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                placeholder="https://..."
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <Label>الفئة الرئيسية</Label>
              <Select
                value={formData.parent_id || "none"}
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  parent_id: value === "none" ? null : value,
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="بدون فئة رئيسية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">بدون فئة رئيسية</SelectItem>
                  {getAllCategories()
                    .filter(cat => cat.id !== formData.id)
                    .map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name_ar}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="is_active">الفئة نشطة</Label>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                إلغاء
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "جاري الحفظ..." : formData.id ? "تحديث" : "إضافة"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذه الفئة؟</AlertDialogTitle>
            <AlertDialogDescription>
              هذا الإجراء لا يمكن التراجع عنه. سيتم حذف الفئة نهائياً.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={deleteCategory} className="bg-destructive text-destructive-foreground">
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
