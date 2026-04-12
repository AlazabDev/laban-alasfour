import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "ريم الحربي",
    role: "مالكة فيلا خاصة",
    text: "الميزة الفعلية هنا كانت المعاينة قبل الشراء. رأيت وحدة التلفاز والإضاءة المخفية داخل الجدار نفسه، وعدلت المقاس قبل التنفيذ، فكانت النتيجة مطابقة تقريباً لما رأيته.",
    rating: 5,
    avatar: "ر",
  },
  {
    id: 2,
    name: "خالد السبيعي",
    role: "مصمم داخلي",
    text: "أعجبني أن المتجر يفكر في الخشب والإضاءة كمشهد واحد. هذا يختصر كثيراً من التخمين عند اختيار القطع للعملاء، خاصة مع وجود VR للمراجعة النهائية.",
    rating: 5,
    avatar: "خ",
  },
  {
    id: 3,
    name: "جود العتيبي",
    role: "مشروع شقة نموذجية",
    text: "اخترنا حلول النوم والإضاءة الجانبية من خلال تجربة واضحة جداً. المحتوى والشرح داخل الموقع ساعدنا على فهم الفروق بين التشطيبات قبل أي دفعة.",
    rating: 5,
    avatar: "ج",
  },
];

export function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-background py-28" dir="rtl">
      <div className="absolute top-0 left-0 h-[380px] w-[380px] rounded-full bg-secondary/4 blur-[100px]" />

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="inline-block text-xs font-medium uppercase tracking-[0.22em] text-secondary">
            — انطباعات حقيقية
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold md:text-5xl lg:text-6xl">
            كيف ساعدت التجربة
            <span className="block text-gradient-gold">العملاء على الشراء بثقة</span>
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.18 + index * 0.08, ease: [0.25, 0.4, 0.25, 1] }}
              className="group relative rounded-[1.8rem] border border-border/50 bg-card p-8 transition-all duration-500 hover:-translate-y-1 hover:border-secondary/20 hover:shadow-elevated"
            >
              <div className="absolute left-6 top-6">
                <Quote className="h-10 w-10 text-secondary/12 transition-colors duration-500 group-hover:text-secondary/20" />
              </div>

              <div className="mb-6 flex items-center gap-0.5">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                ))}
              </div>

              <p className="min-h-[130px] text-sm leading-8 text-foreground/82">"{item.text}"</p>

              <div className="mt-8 flex items-center gap-3 border-t border-border/50 pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-secondary/20 bg-secondary/10 font-bold text-secondary">
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
