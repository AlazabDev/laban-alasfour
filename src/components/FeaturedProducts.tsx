import { motion } from "framer-motion";
import { Heart, Eye, ShoppingBag, Star, View, ArrowLeft } from "lucide-react";
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
    name: "ثريا ذهبية معدنية",
    nameEn: "Golden Metal Chandelier",
    price: 2500,
    originalPrice: 3200,
    image: lampImage,
    rating: 4.9,
    reviews: 48,
    category: "إضاءة",
    hasVR: true,
    isNew: true,
    discount: 22,
  },
  {
    id: 2,
    name: "كرسي أكسنت كريمي",
    nameEn: "Cream Accent Chair",
    price: 1850,
    originalPrice: null,
    image: chairImage,
    rating: 4.8,
    reviews: 32,
    category: "غرف المعيشة",
    hasVR: true,
    isNew: false,
    discount: 0,
  },
  {
    id: 3,
    name: "طاولة رخام ذهبية",
    nameEn: "Marble Gold Table",
    price: 3200,
    originalPrice: 4000,
    image: tableImage,
    rating: 4.7,
    reviews: 56,
    category: "غرف المعيشة",
    hasVR: true,
    isNew: false,
    discount: 20,
  },
  {
    id: 4,
    name: "كنبة زاوية فاخرة",
    nameEn: "Luxury Corner Sofa",
    price: 8500,
    originalPrice: null,
    image: sofaImage,
    rating: 5.0,
    reviews: 89,
    category: "غرف المعيشة",
    hasVR: true,
    isNew: true,
    discount: 0,
  },
];

export function FeaturedProducts() {
  const { addItem } = useCart();

  const handleAddToCart = (product: typeof products[0]) => {
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
    <section className="py-28 bg-muted/30" dir="rtl">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
        >
          <div>
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block text-secondary font-medium text-xs tracking-[0.2em] uppercase mb-4"
            >
              — الأكثر مبيعاً
            </motion.span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              منتجات <span className="text-gradient-gold">مميزة</span>
            </h2>
          </div>
          <Link to="/living">
            <Button variant="outline" className="group border-border/60 hover:border-secondary">
              عرض جميع المنتجات
              <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: index * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
              className="group bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-secondary/30 hover:shadow-elevated transition-all duration-500"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Top Badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {product.isNew && (
                    <Badge variant="secondary" className="bg-secondary text-secondary-foreground text-[10px] px-3 py-1">
                      جديد
                    </Badge>
                  )}
                  {product.discount > 0 && (
                    <Badge className="bg-destructive text-destructive-foreground text-[10px] px-3 py-1">
                      -{product.discount}%
                    </Badge>
                  )}
                  {product.hasVR && (
                    <Badge variant="vr" className="flex items-center gap-1 text-[10px] px-3 py-1">
                      <View className="w-3 h-3" />
                      VR
                    </Badge>
                  )}
                </div>

                {/* Quick Actions - Side */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="w-9 h-9 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 hover:bg-secondary hover:text-secondary-foreground"
                    style={{ transitionDelay: "0ms" }}
                  >
                    <Heart className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="w-9 h-9 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 hover:bg-secondary hover:text-secondary-foreground"
                    style={{ transitionDelay: "75ms" }}
                  >
                    <Eye className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Add to Cart - Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full py-3 bg-primary/95 backdrop-blur-sm text-primary-foreground rounded-xl flex items-center justify-center gap-2 font-medium text-sm hover:bg-primary transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    أضف للسلة
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5">
                <span className="text-[11px] text-muted-foreground tracking-wider uppercase">{product.category}</span>
                <h3 className="font-display text-lg font-semibold mt-1.5 group-hover:text-secondary transition-colors duration-300">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mt-2.5">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? "fill-secondary text-secondary" : "fill-muted text-muted"}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/50">
                  <span className="font-display text-xl font-bold text-secondary">
                    {product.price.toLocaleString()} <span className="text-xs font-normal">ر.س</span>
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {product.originalPrice.toLocaleString()}
                    </span>
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
