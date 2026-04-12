import { motion } from "framer-motion";
import { Eye, Heart, ShoppingBag, Star, View, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import lampImage from "@/assets/product-lamp1.jpg";
import chairImage from "@/assets/product-chair1.jpg";
import tableImage from "@/assets/product-table1.jpg";
import sofaImage from "@/assets/product-sofa1.jpg";

const products = [
  {
    id: 1,
    name: "وحدة تلفاز جوز بإضاءة خطية",
    nameEn: "Walnut TV Unit with Linear Lighting",
    summary: "خطوط أفقية نظيفة وتخزين مخفي مع ضوء يبرز عروق الخشب.",
    price: 5400,
    originalPrice: 6200,
    image: sofaImage,
    rating: 4.9,
    reviews: 48,
    category: "وحدات المعيشة",
    hasVR: true,
    isNew: true,
    discount: 13,
  },
  {
    id: 2,
    name: "كرسي قراءة بإطار خشبي",
    nameEn: "Wood Frame Reading Chair",
    summary: "قطعة مريحة بجلسة هادئة تناسب أركان القراءة والإضاءة الجانبية.",
    price: 1850,
    originalPrice: null,
    image: chairImage,
    rating: 4.8,
    reviews: 32,
    category: "جلسات خشبية",
    hasVR: true,
    isNew: false,
    discount: 0,
  },
  {
    id: 3,
    name: "كونسول شرائح خشبية مضاء",
    nameEn: "Wood Slat Console with Integrated Light",
    summary: "حضور معماري خفيف للمداخل والممرات مع وهج دافئ غير مباشر.",
    price: 3200,
    originalPrice: 3950,
    image: tableImage,
    rating: 4.7,
    reviews: 56,
    category: "وحدات مداخل",
    hasVR: true,
    isNew: false,
    discount: 19,
  },
  {
    id: 4,
    name: "تعليق إضاءة فوق الجزيرة",
    nameEn: "Kitchen Island Pendant",
    summary: "وحدة إضاءة طويلة توازن بين الضوء الوظيفي والحضور البصري الراقي.",
    price: 2600,
    originalPrice: null,
    image: lampImage,
    rating: 5,
    reviews: 41,
    category: "وحدات الإضاءة",
    hasVR: true,
    isNew: true,
    discount: 0,
  },
];

export function FeaturedProducts() {
  const { addItem } = useCart();

  const handleAddToCart = (product: (typeof products)[0]) => {
    addItem({
      id: String(product.id),
      name_ar: product.name,
      name_en: product.nameEn,
      price: product.originalPrice ?? product.price,
      sale_price: product.originalPrice ? product.price : null,
      image: product.image,
      slug: product.nameEn.toLowerCase().replace(/\s+/g, "-"),
    });
  };

  return (
    <section className="bg-muted/20 py-28" dir="rtl">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <span className="inline-block text-xs font-medium uppercase tracking-[0.22em] text-secondary">
              — اختيارات البداية
            </span>
            <h2 className="mt-4 font-display text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              وحدات مختارة
              <span className="block text-gradient-gold">تعكس هوية المتجر من أول نظرة</span>
            </h2>
          </div>
          <div className="max-w-xl">
            <p className="text-sm leading-8 text-muted-foreground md:text-base">
              اخترنا منتجات تجمع بين الخشب والإضاءة والحضور المعماري الواضح. هذه ليست قطعاً معزولة،
              بل أمثلة على نوع التكوين الذي يمكنك معاينته وتعديله قبل الشراء.
            </p>
            <Link to="/living" className="mt-5 inline-block">
              <Button variant="outline" className="group border-border/60 hover:border-secondary">
                عرض جميع المنتجات
                <ArrowLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.16 + index * 0.08, ease: [0.25, 0.4, 0.25, 1] }}
              className="group overflow-hidden rounded-[1.8rem] border border-border/50 bg-card transition-all duration-500 hover:-translate-y-1 hover:border-secondary/30 hover:shadow-elevated"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0)_40%,rgba(10,10,10,0.78)_100%)]" />

                <div className="absolute right-4 top-4 flex flex-col gap-2">
                  {product.isNew && (
                    <Badge variant="secondary" className="px-3 py-1 text-[10px] text-secondary-foreground">
                      إصدار جديد
                    </Badge>
                  )}
                  {product.discount > 0 && (
                    <Badge className="bg-destructive px-3 py-1 text-[10px] text-destructive-foreground">
                      -{product.discount}%
                    </Badge>
                  )}
                  {product.hasVR && (
                    <Badge variant="vr" className="gap-1 px-3 py-1 text-[10px]">
                      <View className="h-3 w-3" />
                      جرّبه عبر VR
                    </Badge>
                  )}
                </div>

                <div className="absolute left-4 top-4 flex flex-col gap-2">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="flex h-9 w-9 translate-x-4 items-center justify-center rounded-full bg-card/80 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 hover:bg-secondary hover:text-secondary-foreground"
                    style={{ transitionDelay: "0ms" }}
                  >
                    <Heart className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="flex h-9 w-9 translate-x-4 items-center justify-center rounded-full bg-card/80 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 hover:bg-secondary hover:text-secondary-foreground"
                    style={{ transitionDelay: "75ms" }}
                  >
                    <Eye className="h-4 w-4" />
                  </motion.button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 translate-y-4 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary/94 py-3 text-sm font-medium text-primary-foreground backdrop-blur-sm transition-colors hover:bg-primary"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    أضف إلى السلة
                  </button>
                </div>
              </div>

              <div className="p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{product.category}</span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${i < Math.floor(product.rating) ? "fill-secondary text-secondary" : "fill-muted text-muted"}`}
                      />
                    ))}
                    <span className="mr-1 text-xs text-muted-foreground">({product.reviews})</span>
                  </div>
                </div>

                <h3 className="font-display text-xl font-semibold leading-relaxed text-foreground transition-colors duration-300 group-hover:text-secondary">
                  {product.name}
                </h3>
                <p className="mt-3 min-h-[56px] text-sm leading-7 text-muted-foreground">{product.summary}</p>

                <div className="mt-4 flex items-center gap-3 border-t border-border/50 pt-4">
                  <span className="font-display text-2xl font-bold text-secondary">
                    {product.price.toLocaleString()} <span className="text-xs font-normal">ر.س</span>
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">{product.originalPrice.toLocaleString()}</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
