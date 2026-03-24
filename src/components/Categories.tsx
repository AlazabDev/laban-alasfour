import { motion } from "framer-motion";
import { ArrowUpLeft } from "lucide-react";
import { Link } from "react-router-dom";
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
    href: "/living",
    span: "lg:col-span-2 lg:row-span-2",
    height: "h-[420px] lg:h-full",
  },
  {
    id: 2,
    name: "غرف النوم",
    nameEn: "Bedroom",
    description: "سراير وخزائن فاخرة",
    image: bedroomImage,
    count: 89,
    href: "/bedroom",
    span: "",
    height: "h-[280px]",
  },
  {
    id: 3,
    name: "الإضاءة",
    nameEn: "Lighting",
    description: "ثريات ومصابيح مميزة",
    image: lightingImage,
    count: 156,
    href: "/lighting",
    span: "",
    height: "h-[280px]",
  },
  {
    id: 4,
    name: "المطابخ",
    nameEn: "Kitchen",
    description: "أثاث مطابخ عصري",
    image: kitchenImage,
    count: 67,
    href: "/kitchen",
    span: "lg:col-span-2",
    height: "h-[280px]",
  },
];

export function Categories() {
  return (
    <section className="py-28 bg-background" dir="rtl">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
              — تصفح حسب الفئة
            </motion.span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              اختر <span className="text-gradient-gold">فئتك</span> المفضلة
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
            اكتشف تشكيلتنا الواسعة من الأثاث والإضاءة المصممة بعناية لتناسب كل مساحة في منزلك
          </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-5 auto-rows-[280px]">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: index * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer ${category.span} ${category.height}`}
            >
              <Link to={category.href} className="absolute inset-0 z-10" />

              {/* Background Image */}
              <div className="absolute inset-0 overflow-hidden">
                <motion.img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent transition-opacity duration-500" />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-500" />

              {/* Content */}
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                <div className="transform transition-all duration-500 group-hover:-translate-y-2">
                  <span className="inline-block px-3 py-1 bg-secondary/20 backdrop-blur-sm rounded-full text-secondary text-xs font-medium mb-3">
                    {category.count} منتج
                  </span>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-card mb-1.5">
                    {category.name}
                  </h3>
                  <p className="text-card/70 text-sm">
                    {category.description}
                  </p>
                </div>

                {/* Arrow */}
                <div className="absolute top-6 left-6 w-12 h-12 rounded-full bg-card/10 backdrop-blur-sm border border-card/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:rotate-0 -rotate-45">
                  <ArrowUpLeft className="w-5 h-5 text-card" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
