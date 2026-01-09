import { useEffect, useState } from "react";
import { Package, FolderTree, TrendingUp, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface Stats {
  totalProducts: number;
  totalCategories: number;
  activeProducts: number;
  featuredProducts: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalCategories: 0,
    activeProducts: 0,
    featuredProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [productsRes, categoriesRes, activeRes, featuredRes] = await Promise.all([
          supabase.from("products").select("id", { count: "exact", head: true }),
          supabase.from("categories").select("id", { count: "exact", head: true }),
          supabase.from("products").select("id", { count: "exact", head: true }).eq("is_active", true),
          supabase.from("products").select("id", { count: "exact", head: true }).eq("is_featured", true),
        ]);

        setStats({
          totalProducts: productsRes.count || 0,
          totalCategories: categoriesRes.count || 0,
          activeProducts: activeRes.count || 0,
          featuredProducts: featuredRes.count || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    { title: "إجمالي المنتجات", value: stats.totalProducts, icon: Package, color: "text-primary" },
    { title: "الفئات", value: stats.totalCategories, icon: FolderTree, color: "text-gold" },
    { title: "المنتجات النشطة", value: stats.activeProducts, icon: TrendingUp, color: "text-green-500" },
    { title: "المنتجات المميزة", value: stats.featuredProducts, icon: Eye, color: "text-purple-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">لوحة التحكم</h1>
        <p className="text-muted-foreground mt-2">مرحباً بك في لوحة إدارة المتجر</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {loading ? "..." : stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>آخر المنتجات المضافة</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">لا توجد منتجات حتى الآن</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الفئات الأكثر نشاطاً</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">لا توجد بيانات كافية</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
