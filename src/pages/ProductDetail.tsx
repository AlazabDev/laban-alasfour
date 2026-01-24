import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star,
  Heart,
  ShoppingCart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Play,
  Loader2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Json } from "@/integrations/supabase/types";

interface ProductImage {
  url: string;
  is_primary: boolean;
}

interface Product {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar: string | null;
  description_en: string | null;
  short_description_ar: string | null;
  price: number;
  sale_price: number | null;
  images: Json;
  rating_average: number | null;
  rating_count: number | null;
  is_new: boolean | null;
  has_vr_experience: boolean | null;
  model_3d_url: string | null;
  video_url: string | null;
  colors: string[] | null;
  materials: string[] | null;
  dimensions: Json;
  specifications: Json;
  stock_quantity: number;
  category_id: string | null;
}

interface Category {
  name_ar: string;
  slug: string;
}

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;

      setProduct(data);

      if (data.category_id) {
        const { data: catData } = await supabase
          .from("categories")
          .select("name_ar, slug")
          .eq("id", data.category_id)
          .single();
        setCategory(catData);
      }

      if (data.colors && data.colors.length > 0) {
        setSelectedColor(data.colors[0]);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const getImages = () => {
    if (!product?.images || !Array.isArray(product.images)) return ["/placeholder.svg"];
    const imgs = product.images as unknown as ProductImage[];
    return imgs.map((img) => img.url);
  };

  const images = getImages();

  const getDimensions = (): { width?: number; height?: number; depth?: number } | null => {
    if (!product?.dimensions || typeof product.dimensions !== 'object' || Array.isArray(product.dimensions)) return null;
    const dims = product.dimensions as Record<string, unknown>;
    return {
      width: typeof dims.width === 'number' ? dims.width : undefined,
      height: typeof dims.height === 'number' ? dims.height : undefined,
      depth: typeof dims.depth === 'number' ? dims.depth : undefined,
    };
  };

  const getSpecifications = (): Record<string, string> | null => {
    if (!product?.specifications || typeof product.specifications !== 'object' || Array.isArray(product.specifications)) return null;
    return product.specifications as Record<string, string>;
  };

  const dimensions = getDimensions();
  const specifications = getSpecifications();

  const handleAddToCart = () => {
    toast.success("تمت إضافة المنتج إلى السلة", {
      description: `${product?.name_ar} × ${quantity}`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center py-40">
          <h1 className="text-2xl font-bold mb-4">المنتج غير موجود</h1>
          <Link to="/">
            <Button>العودة للرئيسية</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground">الرئيسية</Link>
            <ChevronLeft className="h-4 w-4" />
            {category && (
              <>
                <Link to={`/${category.slug}`} className="hover:text-foreground">{category.name_ar}</Link>
                <ChevronLeft className="h-4 w-4" />
              </>
            )}
            <span className="text-foreground">{product.name_ar}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {/* Main Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
                <img
                  src={images[selectedImage]}
                  alt={product.name_ar}
                  className="w-full h-full object-cover"
                />

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full"
                      onClick={() => setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full"
                      onClick={() => setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </>
                )}

                {/* VR/Video Badge */}
                {(product.has_vr_experience || product.video_url) && (
                  <div className="absolute top-4 right-4 flex gap-2">
                    {product.has_vr_experience && (
                      <Badge className="bg-primary text-primary-foreground gap-1">
                        <Play className="h-3 w-3" /> تجربة VR
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {product.is_new && (
                  <Badge className="bg-secondary text-secondary-foreground">جديد</Badge>
                )}
                {product.has_vr_experience && (
                  <Badge variant="outline">تجربة VR متاحة</Badge>
                )}
                {product.stock_quantity < 10 && product.stock_quantity > 0 && (
                  <Badge variant="destructive">الكمية محدودة</Badge>
                )}
              </div>

              {/* Title */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {product.name_ar}
                </h1>
                <p className="text-muted-foreground">{product.name_en}</p>
              </div>

              {/* Rating */}
              {product.rating_average && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.round(product.rating_average!)
                            ? "fill-secondary text-secondary"
                            : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-muted-foreground">
                    ({product.rating_count} تقييم)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-4">
                {product.sale_price ? (
                  <>
                    <span className="text-3xl font-bold text-primary">
                      {product.sale_price} ر.س
                    </span>
                    <span className="text-xl text-muted-foreground line-through">
                      {product.price} ر.س
                    </span>
                    <Badge className="bg-destructive text-destructive-foreground">
                      خصم {Math.round(((product.price - product.sale_price) / product.price) * 100)}%
                    </Badge>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-primary">
                    {product.price} ر.س
                  </span>
                )}
              </div>

              {/* Short Description */}
              {product.short_description_ar && (
                <p className="text-muted-foreground leading-relaxed">
                  {product.short_description_ar}
                </p>
              )}

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <label className="text-sm font-medium mb-3 block">اللون</label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                          selectedColor === color
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="text-sm font-medium mb-3 block">الكمية</label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity((q) => Math.min(product.stock_quantity, q + 1))}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.stock_quantity} متوفر في المخزون
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1 gap-2"
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                >
                  <ShoppingCart className="h-5 w-5" />
                  أضف للسلة
                </Button>
                <Button size="lg" variant="outline">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm font-medium">توصيل مجاني</p>
                  <p className="text-xs text-muted-foreground">للطلبات فوق 500 ر.س</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm font-medium">ضمان سنتين</p>
                  <p className="text-xs text-muted-foreground">ضمان شامل</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center">
                    <RotateCcw className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm font-medium">استرجاع سهل</p>
                  <p className="text-xs text-muted-foreground">خلال 14 يوم</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="description" dir="rtl">
              <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
                <TabsTrigger
                  value="description"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  الوصف
                </TabsTrigger>
                <TabsTrigger
                  value="specifications"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  المواصفات
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  التقييمات
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6">
                <div className="prose prose-lg max-w-none text-muted-foreground">
                  {product.description_ar || "لا يوجد وصف متاح لهذا المنتج."}
                </div>
              </TabsContent>

              <TabsContent value="specifications" className="mt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {dimensions && (
                    <div className="bg-card rounded-xl p-6 border border-border">
                      <h3 className="font-semibold mb-4">الأبعاد</h3>
                      <div className="space-y-2 text-sm">
                        {dimensions.width && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">العرض</span>
                            <span>{dimensions.width} سم</span>
                          </div>
                        )}
                        {dimensions.height && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">الارتفاع</span>
                            <span>{dimensions.height} سم</span>
                          </div>
                        )}
                        {dimensions.depth && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">العمق</span>
                            <span>{dimensions.depth} سم</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {product.materials && product.materials.length > 0 && (
                    <div className="bg-card rounded-xl p-6 border border-border">
                      <h3 className="font-semibold mb-4">المواد</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.materials.map((material) => (
                          <Badge key={material} variant="secondary">
                            {material}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {specifications && Object.keys(specifications).length > 0 && (
                    <div className="bg-card rounded-xl p-6 border border-border md:col-span-2">
                      <h3 className="font-semibold mb-4">مواصفات إضافية</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {Object.entries(specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between py-2 border-b border-border">
                            <span className="text-muted-foreground">{key}</span>
                            <span>{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="text-center py-12 text-muted-foreground">
                  لا توجد تقييمات بعد. كن أول من يقيم هذا المنتج!
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
