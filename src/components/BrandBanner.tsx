import { motion } from "framer-motion";
import { Boxes, LampFloor, ScanSearch, Wrench } from "lucide-react";

const features = [
  {
    icon: Boxes,
    title: "خامات خشبية مخصصة للمساحة",
    description: "اختيارات عملية وجمالية تناسب الاستخدام اليومي وطابع المكان.",
  },
  {
    icon: LampFloor,
    title: "إضاءة مدمجة ضمن التكوين",
    description: "وحدات إضاءة تبرز الخشب ولا تنافسه بصرياً.",
  },
  {
    icon: ScanSearch,
    title: "معاينة قبل اعتماد الطلب",
    description: "VR لقراءة الحجم، التشطيب، ودرجة الإضاءة قبل الشراء.",
  },
  {
    icon: Wrench,
    title: "تصميم ثم تنفيذ وتركيب",
    description: "مسار واضح من الفكرة حتى التسليم دون ارتباك في التفاصيل.",
  },
];

export function BrandBanner() {
  return (
    <section className="border-y border-border/40 bg-[linear-gradient(180deg,rgba(250,248,243,1)_0%,rgba(245,241,234,1)_100%)] py-16" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-block text-xs font-medium uppercase tracking-[0.22em] text-secondary">
              — لماذا هذه التجربة مختلفة
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-foreground md:text-4xl">
              المتجر لا يعرض منتجاً فقط،
              <span className="block text-secondary">بل يكوّن مشهداً كاملاً من الخشب والضوء.</span>
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
            كل قسم في المتجر مبني ليقربك من القرار الصحيح: خامة مدروسة، توزيع ضوء واضح، ومعاينة
            رقمية تمنع التردد قبل اعتماد الشراء.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group rounded-[1.75rem] border border-border/40 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-secondary/30 hover:shadow-elevated"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-secondary/20 bg-secondary/10 transition-all duration-300 group-hover:bg-secondary/15">
                <feature.icon className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="mb-2 font-display text-xl font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm leading-7 text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
