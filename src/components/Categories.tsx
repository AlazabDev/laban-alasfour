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
    name: "وحدات المعيشة الخشبية",
    subtitle: "Living Wood Systems",
    description: "وحدات تلفاز، مكتبات، كونسول وطاولات بلمسات ضوء تبرز الخشب.",
    image: livingImage,
    count: 124,
    href: "/living",
    tag: "الأكثر طلباً",
    span: "lg:col-span-2 lg:row-span-2",
    height: "h-[420px] lg:h-full",
  },
  {
    id: 2,
    name: "غرف النوم",
    subtitle: "Bedroom Units",
    description: "خزائن، كومدينات، ووحدات رأس سرير بإضاءة دافئة مدمجة.",
    image: bedroomImage,
    count: 89,
    href: "/bedroom",
    tag: "تنظيم + دفء",
    span: "",
    height: "h-[280px]",
  },
  {
    id: 3,
    name: "وحدات الإضاءة",
    subtitle: "Lighting Compositions",
    description: "تعليقات، جدرانيات، وإضاءة خطية تعيد تعريف المشهد بالكامل.",
    image: lightingImage,
    count: 156,
    href: "/lighting",
    tag: "مشاهد ضوئية",
    span: "",
    height: "h-[280px]",
  },
  {
    id: 4,
    name: "حلول المطابخ",
    subtitle: "Kitchen Solutions",
    description: "خزائن خشبية نظيفة التفاصيل مع توزيع ضوء عملي فوق أسطح العمل.",
    image: kitchenImage,
    count: 67,
    href: "/kitchen",
    tag: "تنفيذ عملي",
    span: "lg:col-span-2",
    height: "h-[280px]",
  },
];

export function Categories() {
  return (
    <section className="bg-background py-28" dir="rtl">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-14 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]"
        >
          <div>
            <span className="inline-block text-xs font-medium uppercase tracking-[0.22em] text-secondary">
              — مسارات الشراء
            </span>
            <h2 className="mt-4 font-display text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              اختر الفئة التي
              <span className="block text-gradient-gold">تبدأ منها حكاية المساحة</span>
            </h2>
          </div>
          <div className="rounded-[1.75rem] border border-border/50 bg-muted/30 p-6 md:p-8">
            <p className="text-sm leading-8 text-muted-foreground md:text-base">
              لم نرتب الأقسام بوصفها غرفاً فقط، بل كمشاهد معيشية تعتمد على حضور الخشب وتوزيع
              الإضاءة. كل فئة تساعدك على مقارنة الشكل، الوظيفة، وإمكانية التجربة عبر VR قبل اتخاذ
              القرار النهائي.
            </p>
          </div>
        </motion.div>

        <div className="grid auto-rows-[280px] grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-5">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18 + index * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
              className={`group relative cursor-pointer overflow-hidden rounded-[2rem] ${category.span} ${category.height}`}
            >
              <Link to={category.href} className="absolute inset-0 z-10" />

              <div className="absolute inset-0 overflow-hidden">
                <motion.img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              </div>

              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,28,40,0.08)_0%,rgba(18,28,40,0.28)_38%,rgba(18,28,40,0.82)_100%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,162,66,0.18),transparent_30%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
                <div className="flex items-start justify-between">
                  <span className="rounded-full border border-card/20 bg-card/12 px-3 py-1 text-[11px] text-card backdrop-blur-sm">
                    {category.tag}
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-card/25 bg-card/10 opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
                    <ArrowUpLeft className="h-5 w-5 text-card" />
                  </div>
                </div>

                <div className="max-w-md">
                  <span className="text-[11px] uppercase tracking-[0.24em] text-card/70">{category.subtitle}</span>
                  <h3 className="mt-3 font-display text-2xl font-bold leading-tight text-card md:text-3xl">
                    {category.name}
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-7 text-card/78">{category.description}</p>
                  <div className="mt-5 inline-flex rounded-full bg-secondary/18 px-3 py-1 text-xs font-medium text-secondary backdrop-blur-sm">
                    {category.count} منتج قابل للتخصيص والمعاينة
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
