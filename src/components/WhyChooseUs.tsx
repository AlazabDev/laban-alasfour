import { motion } from "framer-motion";
import { Boxes, LampFloor, Ruler, ScanSearch } from "lucide-react";

const reasons = [
  {
    icon: Boxes,
    title: "لغة خشب واضحة",
    description: "نركز على الوحدات التي تحمل شخصية الخامة نفسها، من الشرائح إلى الجوز والبلوط والتشطيبات الدافئة.",
  },
  {
    icon: LampFloor,
    title: "إضاءة تبني الجو لا تشتته",
    description: "كل وحدة إضاءة هنا مختارة لتخدم المشهد المعماري وتبرز الأبعاد والخطوط بدقة.",
  },
  {
    icon: ScanSearch,
    title: "تجربة قبل الدفع",
    description: "ميزة VR تمنحك معاينة أقرب للواقع فتختبر الحجم والمظهر قبل أي التزام شرائي.",
  },
  {
    icon: Ruler,
    title: "قرارات مبنية على المقاس",
    description: "نطابق المنتج مع المساحة لا مع صورة مثالية فقط، لذلك يبدو الاختيار منطقياً بعد وصوله فعلاً.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-background py-28" dir="rtl">
      <div className="absolute left-0 top-20 h-[360px] w-[360px] rounded-full bg-secondary/5 blur-[110px]" />
      <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-primary/5 blur-[100px]" />

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="inline-block text-xs font-medium uppercase tracking-[0.22em] text-secondary">
            — لماذا هذا المتجر
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold md:text-5xl lg:text-6xl">
            لأننا نبيع
            <span className="block text-gradient-gold">نتيجة بصرية يمكن الوثوق بها</span>
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-sm leading-8 text-muted-foreground md:text-base">
            المتجر مبني لمن يبحث عن وضوح في الخامة والضوء، لا عن صور تسويقية جميلة فقط. لذلك
            نربط بين الوحدات الخشبية، حلول الإضاءة، وتجربة المعاينة قبل الشراء.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.16 + index * 0.08 }}
              className="group relative rounded-[1.8rem] border border-border/50 bg-card p-8 text-right transition-all duration-500 hover:-translate-y-1 hover:border-secondary/25 hover:shadow-elevated"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-secondary/15 bg-secondary/10 transition-all duration-500 group-hover:bg-secondary/15">
                <reason.icon className="h-7 w-7 text-secondary" />
              </div>

              <h3 className="font-display text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-secondary">
                {reason.title}
              </h3>
              <p className="mt-4 text-sm leading-8 text-muted-foreground">{reason.description}</p>

              <div className="absolute bottom-0 right-8 h-0.5 w-0 rounded-full bg-secondary transition-all duration-500 group-hover:w-16" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
