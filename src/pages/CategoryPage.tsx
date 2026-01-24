import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Filter, Grid3X3, LayoutList, SlidersHorizontal, Star, Eye, Heart, ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

interface ProductImage {
  url: string;
  is_primary: boolean;
}

interface Product {
  id: string;
  name_ar: string;
  name_en: string;
  price: number;
  sale_price: number | null;
  images: Json;
  rating_average: number | null;
  is_new: boolean | null;
  has_vr_experience: boolean | null;
  slug: string;
}

interface Category {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  description_ar: string | null;
  image_url: string | null;
}

const categorySlugMap: Record<string, string> = {
  living: "غرف-المعيشة",
  bedroom: "غرف-النوم",
  lighting: "الإضاءة",
  kitchen: "المطابخ",
};

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryInfo, setCategoryInfo] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, [category]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Find category by slug
      const arabicSlug = category ? categorySlugMap[category] || category : "";
      
      const { data: catData } = await supabase
        .from("categories")
        .select("*")
        .or(`slug.eq.${category},slug.eq.${arabicSlug}`)
        .single();

      if (catData) {
        setCategoryInfo(catData);

        // Fetch products for this category
        const { data: productsData } = await supabase
          .from("products")
          .select("id, name_ar, name_en, price, sale_price, images, rating_average, is_new, has_vr_experience, slug")
          .eq("category_id", catData.id)
          .eq("is_active", true);

        setProducts(productsData || []);
      } else {
        // Fetch all products if no category
        const { data: productsData } = await supabase
          .from("products")
          .select("id, name_ar, name_en, price, sale_price, images, rating_average, is_new, has_vr_experience, slug")
          .eq("is_active", true);

        setProducts(productsData || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProductImage = (product: Product) => {
    if (!product.images || !Array.isArray(product.images)) return "/placeholder.svg";
    const images = product.images as unknown as ProductImage[];
    const primaryImage = images.find((img) => img.is_primary);
    return primaryImage?.url || images[0]?.url || "/placeholder.svg";
  };

  const filteredProducts = products
    .filter((p) => {
      const matchesSearch = p.name_ar.includes(searchQuery) || p.name_en.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return (b.rating_average || 0) - (a.rating_average || 0);
        default:
          return 0;
      }
    });

  const categoryTitle = categoryInfo?.name_ar || getCategoryTitle(category || "");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {categoryTitle}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {categoryInfo?.description_ar || "اكتشف مجموعتنا المميزة من الأثاث الفاخر"}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters & Products */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-4 bg-card rounded-xl border border-border">
            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    <span className="hidden sm:inline">الفلاتر</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle>تصفية المنتجات</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    <div>
                      <label className="text-sm font-medium mb-3 block">نطاق السعر</label>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={50000}
                        step={500}
                        className="mt-2"
                      />
                      <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                        <span>{priceRange[0]} ر.س</span>
                        <span>{priceRange[1]} ر.س</span>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <Input
                placeholder="ابحث عن منتج..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 md:w-64"
              />
            </div>

            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="ترتيب حسب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">الأحدث</SelectItem>
                  <SelectItem value="price-asc">السعر: الأقل</SelectItem>
                  <SelectItem value="price-desc">السعر: الأعلى</SelectItem>
                  <SelectItem value="rating">التقييم</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border border-border rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <LayoutList className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">لا توجد منتجات متاحة حالياً</p>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={`/product/${product.slug}`}>
                    <div
                      className={`group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl ${
                        viewMode === "list" ? "flex" : ""
                      }`}
                    >
                      {/* Image */}
                      <div className={`relative overflow-hidden ${viewMode === "list" ? "w-48 h-48" : "aspect-square"}`}>
                        <img
                          src={getProductImage(product)}
                          alt={product.name_ar}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />

                        {/* Badges */}
                        <div className="absolute top-3 right-3 flex flex-col gap-2">
                          {product.is_new && (
                            <Badge className="bg-secondary text-secondary-foreground">جديد</Badge>
                          )}
                          {product.has_vr_experience && (
                            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                              VR
                            </Badge>
                          )}
                          {product.sale_price && (
                            <Badge className="bg-destructive text-destructive-foreground">
                              خصم {Math.round(((product.price - product.sale_price) / product.price) * 100)}%
                            </Badge>
                          )}
                        </div>

                        {/* Quick Actions */}
                        <div className="absolute bottom-3 left-3 right-3 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="icon" variant="secondary" className="h-10 w-10 rounded-full">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="secondary" className="h-10 w-10 rounded-full">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="icon" className="h-10 w-10 rounded-full">
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className={`p-4 ${viewMode === "list" ? "flex-1 flex flex-col justify-center" : ""}`}>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {product.name_ar}
                        </h3>

                        {product.rating_average && (
                          <div className="flex items-center gap-1 mt-2">
                            <Star className="h-4 w-4 fill-secondary text-secondary" />
                            <span className="text-sm text-muted-foreground">{product.rating_average.toFixed(1)}</span>
                          </div>
                        )}

                        <div className="mt-3 flex items-center gap-2">
                          {product.sale_price ? (
                            <>
                              <span className="text-lg font-bold text-primary">{product.sale_price} ر.س</span>
                              <span className="text-sm text-muted-foreground line-through">{product.price} ر.س</span>
                            </>
                          ) : (
                            <span className="text-lg font-bold text-primary">{product.price} ر.س</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function getCategoryTitle(slug: string): string {
  const titles: Record<string, string> = {
    living: "غرف المعيشة",
    bedroom: "غرف النوم",
    lighting: "الإضاءة",
    kitchen: "المطابخ",
  };
  return titles[slug] || "جميع المنتجات";
}
