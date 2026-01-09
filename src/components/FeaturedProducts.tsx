import { motion } from "framer-motion";
import { Heart, Eye, ShoppingBag, Star, View } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  },
];

export function FeaturedProducts() {
  return (
    <section className="py-24 bg-muted/30" dir="rtl">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <span className="text-secondary font-medium text-sm tracking-wider">الأكثر مبيعاً</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-3">
              منتجات <span className="text-gradient-gold">مميزة</span>
            </h2>
          </div>
          <Button variant="outline" className="self-start md:self-auto">
            عرض جميع المنتجات
          </Button>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-shadow duration-300"
            >
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden bg-muted">
                <motion.img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                />
                
                {/* Badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {product.isNew && (
                    <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                      جديد
                    </Badge>
                  )}
                  {product.hasVR && (
                    <Badge variant="vr" className="flex items-center gap-1">
                      <View className="w-3 h-3" />
                      VR
                    </Badge>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 bg-card rounded-full flex items-center justify-center shadow-md hover:bg-secondary hover:text-secondary-foreground transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 bg-card rounded-full flex items-center justify-center shadow-md hover:bg-secondary hover:text-secondary-foreground transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Add to Cart */}
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="absolute bottom-4 left-4 right-4 py-3 bg-primary text-primary-foreground rounded-xl flex items-center justify-center gap-2 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0"
                >
                  <ShoppingBag className="w-4 h-4" />
                  أضف للسلة
                </motion.button>
              </div>

              {/* Product Info */}
              <div className="p-5">
                <span className="text-xs text-muted-foreground">{product.category}</span>
                <h3 className="font-display text-lg font-semibold mt-1 group-hover:text-secondary transition-colors">
                  {product.name}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center gap-1 mt-2">
                  <Star className="w-4 h-4 fill-secondary text-secondary" />
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-xs text-muted-foreground">({product.reviews} تقييم)</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3 mt-3">
                  <span className="font-display text-xl font-bold text-secondary">
                    {product.price.toLocaleString()} ر.س
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {product.originalPrice.toLocaleString()} ر.س
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
