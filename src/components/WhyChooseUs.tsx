import { motion } from "framer-motion";
import { ShieldCheck, Palette, Clock, Gem } from "lucide-react";

const reasons = [
  {
    icon: ShieldCheck,
    title: "ضمان جودة شامل",
    description: "نلتزم بأعلى معايير الجودة مع ضمان على جميع المنتجات لراحة بالك الكاملة.",
  },
  {
    icon: Palette,
    title: "تصاميم عصرية ومبتكرة",
    description: "تصاميم حصرية مستوحاة من أحدث صيحات الديكور العالمية لتناسب ذوقك الرفيع.",
  },
  {
    icon: Clock,
    title: "التزام صارم بالمواعيد",
    description: "جداول توصيل واضحة مع تحديثات مستمرة حتى وصول طلبك بأمان.",
  },
  {
    icon: Gem,
    title: "خامات أوروبية فاخرة",
    description: "نتعامل مع أفضل المصنعين لضمان متانة وجمال كل قطعة أثاث.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-28 bg-background" dir="rtl">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-secondary font-medium text-xs tracking-[0.2em] uppercase mb-4">
            — لماذا نحن
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            لماذا يثق بنا <span className="text-gradient-gold">عملاؤنا؟</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            نحن لا نبيع أثاثاً عادياً — بل نصنع تجربة معيشية تعكس شخصيتك وذوقك الرفيع بأعلى معايير الاحترافية.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 + index * 0.1 }}
              className="group relative bg-card rounded-2xl p-8 border border-border/50 hover:border-secondary/30 transition-all duration-500 hover:shadow-elevated text-center"
            >
              {/* Icon */}
              <div className="w-16 h-16 mx-auto rounded-2xl bg-secondary/10 border border-secondary/15 flex items-center justify-center mb-6 group-hover:bg-secondary/20 group-hover:scale-110 transition-all duration-500">
                <reason.icon className="w-7 h-7 text-secondary" />
              </div>

              <h3 className="font-display text-lg font-bold mb-3 group-hover:text-secondary transition-colors duration-300">
                {reason.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {reason.description}
              </p>

              {/* Hover accent line */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-16 h-0.5 bg-secondary rounded-full transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
