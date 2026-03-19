import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "سارة المطيري",
    role: "مصممة داخلية",
    text: "تجربة تسوق فريدة من نوعها. جودة الأثاث تفوق التوقعات والتوصيل كان في الموعد تماماً.",
    rating: 5,
    avatar: "س",
  },
  {
    id: 2,
    name: "أحمد الشمري",
    role: "مهندس معماري",
    text: "ميزة الواقع الافتراضي ساعدتني أرى القطع في مكانها الفعلي قبل الشراء. خدمة ممتازة!",
    rating: 5,
    avatar: "أ",
  },
  {
    id: 3,
    name: "نورة العتيبي",
    role: "ربة منزل",
    text: "اشتريت كنبة الزاوية الفاخرة وكانت أفضل قرار. جودة عالية وتصميم أنيق يناسب الذوق السعودي.",
    rating: 5,
    avatar: "ن",
  },
];

export function Testimonials() {
  return (
    <section className="py-28 bg-background" dir="rtl">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-secondary font-medium text-xs tracking-[0.2em] uppercase mb-4">
            — آراء العملاء
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold">
            ماذا يقول <span className="text-gradient-gold">عملاؤنا</span>
          </h2>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: index * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
              className="relative bg-card rounded-2xl p-8 border border-border/50 hover:border-secondary/20 transition-all duration-500 group"
            >
              {/* Quote icon */}
              <div className="absolute top-6 left-6">
                <Quote className="w-8 h-8 text-secondary/15 group-hover:text-secondary/25 transition-colors duration-500" />
              </div>

              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-6">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground/80 leading-relaxed mb-8 text-sm">
                "{item.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-6 border-t border-border/50">
                <div className="w-10 h-10 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary font-bold text-sm">
                  {item.avatar}
                </div>
                <div>
                  <div className="font-semibold text-sm">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
