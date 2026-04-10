import { motion } from "framer-motion";

const services = [
  {
    num: "01",
    title: "قراءة المساحة",
    description:
      "نبدأ بفهم الجدار، الحركة، نقاط الكهرباء، ومناطق الظل حتى لا تبدو الوحدة جميلة فقط بل منطقية داخل الاستخدام اليومي.",
  },
  {
    num: "02",
    title: "تكوين الوحدة الخشبية",
    description:
      "نحدد التوزيع، التشطيب، سُمك الخامة، والوظائف التخزينية بحيث تكون القطعة جزءاً من العمارة الداخلية لا جسماً منفصلاً عنها.",
  },
  {
    num: "03",
    title: "بناء مشهد الإضاءة",
    description:
      "نختار نوع الإضاءة وحرارتها وموقعها بالنسبة للخشب حتى تبرز الخطوط، العمق، والملمس دون وهج بصري زائد.",
  },
  {
    num: "04",
    title: "معاينة VR قبل الاعتماد",
    description:
      "نختبر النتيجة داخل مشهد قريب من الواقع، فنقارن الأحجام والخامات ودرجة الإضاءة قبل تثبيت الطلب النهائي.",
  },
  {
    num: "05",
    title: "تصنيع وتركيب منضبط",
    description:
      "بعد اعتماد المشهد ننتقل إلى التنفيذ والتركيب مع متابعة التفاصيل النهائية حتى تصل القطعة بالصورة التي رأيتها مسبقاً.",
  },
];

export function ServicesOverview() {
  return (
    <section className="bg-muted/25 py-28" dir="rtl">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="inline-block text-xs font-medium uppercase tracking-[0.22em] text-secondary">
            — كيف نعمل
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold md:text-5xl lg:text-6xl">
            من الفكرة الأولى إلى
            <span className="block text-gradient-gold">قرار شراء محسوم وواضح</span>
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-sm leading-8 text-muted-foreground md:text-base">
            الخدمة هنا ليست “بيع منتج” فحسب. نحن نبني قرارك على فهم الخامة، توزيع الضوء، ثم
            التحقق البصري عبر VR قبل أن تبدأ مرحلة التنفيذ أو الشحن.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-2">
          {services.map((service, index) => (
            <motion.div
              key={service.num}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 * index }}
              className={`group rounded-[1.9rem] border border-border/50 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-secondary/25 hover:shadow-elevated md:p-8 ${
                index === 0 ? "lg:col-span-2 bg-card" : "bg-card/90"
              }`}
            >
              <div className="flex items-start gap-5 md:gap-7">
                <span className="font-display text-5xl font-bold leading-none text-secondary/26 transition-colors duration-500 group-hover:text-secondary/55 md:text-6xl">
                  {service.num}
                </span>

                <div className="flex-1">
                  <div className="mb-3 h-px w-16 bg-secondary/30" />
                  <h3 className="font-display text-2xl font-bold text-foreground transition-colors duration-300 group-hover:text-secondary">
                    {service.title}
                  </h3>
                  <p className="mt-4 text-sm leading-8 text-muted-foreground md:text-base">
                    {service.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
