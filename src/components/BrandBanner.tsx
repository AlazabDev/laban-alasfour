import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";

const features = [
  { icon: Truck, title: "توصيل مجاني", description: "لجميع الطلبات فوق 500 ر.س" },
  { icon: ShieldCheck, title: "ضمان الجودة", description: "ضمان حتى 5 سنوات" },
  { icon: RotateCcw, title: "إرجاع سهل", description: "خلال 14 يوم من الاستلام" },
  { icon: Headphones, title: "دعم متواصل", description: "خدمة عملاء على مدار الساعة" },
];

export function BrandBanner() {
  return (
    <section className="py-16 bg-muted/50 border-y border-border/30" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/15 flex items-center justify-center mb-3 group-hover:bg-secondary/20 transition-colors duration-300">
                <feature.icon className="w-5 h-5 text-secondary" />
              </div>
              <h4 className="font-semibold text-sm mb-1">{feature.title}</h4>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
