import { motion } from "framer-motion";
import { ArrowUpLeft } from "lucide-react";
import bedroomImage from "@/assets/category-bedroom.jpg";
import lightingImage from "@/assets/category-lighting.jpg";
import livingImage from "@/assets/category-living.jpg";
import kitchenImage from "@/assets/category-kitchen.jpg";

const categories = [
  {
    id: 1,
    name: "غرف المعيشة",
    nameEn: "Living Room",
    description: "أطقم كنب وطاولات أنيقة",
    image: livingImage,
    count: 124,
  },
  {
    id: 2,
    name: "غرف النوم",
    nameEn: "Bedroom",
    description: "سراير وخزائن فاخرة",
    image: bedroomImage,
    count: 89,
  },
  {
    id: 3,
    name: "الإضاءة",
    nameEn: "Lighting",
    description: "ثريات ومصابيح مميزة",
    image: lightingImage,
    count: 156,
  },
  {
    id: 4,
    name: "المطابخ",
    nameEn: "Kitchen",
    description: "أثاث مطابخ عصري",
    image: kitchenImage,
    count: 67,
  },
];

export function Categories() {
  return (
    <section className="py-24 bg-background" dir="rtl">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-secondary font-medium text-sm tracking-wider">تصفح حسب الفئة</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 mb-4">
            اختر <span className="text-gradient-gold">فئتك</span> المفضلة
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            اكتشف تشكيلتنا الواسعة من الأثاث والإضاءة المصممة بعناية لتناسب كل مساحة في منزلك
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer"
            >
              {/* Background Image */}
              <motion.img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6 }}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent" />
              
              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                  <span className="text-gold-light text-sm font-medium">
                    {category.count} منتج
                  </span>
                  <h3 className="font-display text-2xl font-bold text-background mt-1">
                    {category.name}
                  </h3>
                  <p className="text-background/80 text-sm mt-2">
                    {category.description}
                  </p>
                </div>
                
                {/* Arrow */}
                <motion.div
                  className="absolute top-6 left-6 w-12 h-12 rounded-full bg-secondary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ scale: 1.1 }}
                >
                  <ArrowUpLeft className="w-5 h-5 text-secondary-foreground" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
