import { motion } from "framer-motion";

const services = [
  {
    num: "01",
    title: "تصميم داخلي",
    description: "نقدم استشارات تصميم داخلي مجانية لمساعدتك في اختيار القطع المناسبة لكل مساحة.",
  },
  {
    num: "02",
    title: "تجربة واقع افتراضي",
    description: "جرّب الأثاث في منزلك افتراضياً قبل الشراء باستخدام أحدث تقنيات VR و AR.",
  },
  {
    num: "03",
    title: "توصيل وتركيب",
    description: "توصيل مجاني لجميع المنتجات مع خدمة تركيب احترافية من فنيين متخصصين.",
  },
  {
    num: "04",
    title: "خدمة ما بعد البيع",
    description: "ضمان شامل وصيانة دورية مع فريق دعم متاح على مدار الساعة لراحتك.",
  },
  {
    num: "05",
    title: "تصنيع حسب الطلب",
    description: "إمكانية تصنيع قطع أثاث فريدة حسب مقاساتك وذوقك الخاص بخامات أوروبية.",
  },
];

export function ServicesOverview() {
  return (
    <section className="py-28 bg-muted/30" dir="rtl">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-secondary font-medium text-xs tracking-[0.2em] uppercase mb-4">
            — خدماتنا
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            خدمات <span className="text-gradient-gold">متكاملة</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            من التصميم إلى التركيب، نقدم لك تجربة تسوق متكاملة لا مثيل لها
          </p>
        </motion.div>

        {/* Services List */}
        <div className="max-w-4xl mx-auto space-y-4">
          {services.map((service, index) => (
            <motion.div
              key={service.num}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 * index }}
              className="group flex items-start gap-6 md:gap-8 p-6 md:p-8 bg-card rounded-2xl border border-border/50 hover:border-secondary/30 hover:shadow-elevated transition-all duration-500 cursor-default"
            >
              {/* Number */}
              <span className="font-display text-4xl md:text-5xl font-bold text-secondary/20 group-hover:text-secondary/50 transition-colors duration-500 select-none leading-none pt-1">
                {service.num}
              </span>

              <div className="flex-1">
                <h3 className="font-display text-xl md:text-2xl font-bold mb-2 group-hover:text-secondary transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Arrow indicator */}
              <div className="hidden md:flex w-10 h-10 rounded-full border border-border/50 items-center justify-center flex-shrink-0 group-hover:border-secondary/30 group-hover:bg-secondary/10 transition-all duration-500 mt-1">
                <svg className="w-4 h-4 text-muted-foreground group-hover:text-secondary transition-colors duration-300 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
