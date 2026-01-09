import { motion } from "framer-motion";
import { Play, Smartphone, Monitor, Headset, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import vrImage from "@/assets/vr-experience.jpg";

const features = [
  {
    icon: Headset,
    title: "تجربة VR كاملة",
    description: "استخدم نظارات VR لتجربة غامرة تماماً",
  },
  {
    icon: Smartphone,
    title: "الواقع المعزز AR",
    description: "شاهد المنتج في منزلك باستخدام كاميرا الهاتف",
  },
  {
    icon: Monitor,
    title: "عرض 360°",
    description: "استكشف المنتجات من كل الزوايا عبر المتصفح",
  },
];

export function VRExperience() {
  return (
    <section className="py-24 bg-primary overflow-hidden" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 bg-secondary/20 rounded-full text-secondary text-sm font-medium mb-6">
              تقنية حصرية
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              جرّب الأثاث في منزلك{" "}
              <span className="text-secondary">قبل الشراء</span>
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 leading-relaxed">
              استخدم تقنية الواقع الافتراضي والمعزز لمعاينة قطع الأثاث والإضاءة في بيئتك المنزلية. 
              غيّر الألوان، جرّب مواقع مختلفة، واتخذ قرار الشراء بثقة تامة.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-foreground">{feature.title}</h3>
                    <p className="text-primary-foreground/70 text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Button variant="secondary" size="lg" className="group">
                جرّب الآن
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              </Button>
              <Button variant="ghost" size="lg" className="text-primary-foreground hover:text-secondary hover:bg-secondary/10">
                <Play className="w-5 h-5 ml-2" />
                شاهد الفيديو
              </Button>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-elevated">
              <motion.img
                src={vrImage}
                alt="VR Experience"
                className="w-full h-auto"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
              />
              
              {/* Play Button Overlay */}
              <motion.button
                className="absolute inset-0 flex items-center justify-center bg-charcoal/30 group"
                whileHover={{ backgroundColor: "rgba(23, 30, 42, 0.5)" }}
              >
                <motion.div
                  className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center shadow-gold"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-8 h-8 text-secondary-foreground fill-current mr-[-3px]" />
                </motion.div>
              </motion.button>
            </div>

            {/* Floating Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-card p-6 rounded-2xl shadow-elevated"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-gold flex items-center justify-center">
                  <Headset className="w-7 h-7 text-secondary-foreground" />
                </div>
                <div>
                  <div className="font-display text-2xl font-bold text-foreground">+2000</div>
                  <div className="text-sm text-muted-foreground">تجربة VR ناجحة</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
