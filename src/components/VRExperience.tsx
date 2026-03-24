import { motion } from "framer-motion";
import { Play, Smartphone, Monitor, Headset, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import vrImage from "@/assets/vr-experience.jpg";

const features = [
  {
    icon: Headset,
    title: "تجربة VR كاملة",
    description: "استخدم نظارات VR لتجربة غامرة",
  },
  {
    icon: Smartphone,
    title: "الواقع المعزز AR",
    description: "شاهد المنتج في منزلك بالكاميرا",
  },
  {
    icon: Monitor,
    title: "عرض 360°",
    description: "استكشف المنتجات من كل الزوايا",
  },
];

export function VRExperience() {
  return (
    <section className="relative py-32 overflow-hidden" dir="rtl">
      {/* Background */}
      <div className="absolute inset-0 bg-primary" />
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary-foreground)) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block text-secondary/80 font-medium text-xs tracking-[0.2em] uppercase mb-6"
            >
              — تقنية حصرية
            </motion.span>

            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
              جرّب الأثاث في
              <br />
              منزلك <span className="text-secondary">قبل الشراء</span>
            </h2>

            <p className="text-primary-foreground/60 text-base md:text-lg mb-10 leading-relaxed max-w-lg">
              استخدم تقنية الواقع الافتراضي لمعاينة قطع الأثاث في بيئتك المنزلية.
              غيّر الألوان، جرّب مواقع مختلفة، واتخذ قرار الشراء بثقة.
            </p>

            {/* Features */}
            <div className="space-y-5 mb-10">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20 transition-colors duration-300">
                    <feature.icon className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-foreground text-sm">{feature.title}</h3>
                    <p className="text-primary-foreground/50 text-xs mt-0.5">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/vr">
                <Button variant="secondary" size="lg" className="group">
                  جرّب الآن
                  <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="ghost" size="lg" className="text-primary-foreground/70 hover:text-secondary hover:bg-secondary/10">
                <Play className="w-5 h-5 ml-2" />
                شاهد الفيديو
              </Button>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
            className="relative"
          >
            {/* Main image */}
            <div className="relative rounded-3xl overflow-hidden">
              <div className="aspect-[4/5] lg:aspect-[3/4]">
                <img
                  src={vrImage}
                  alt="تجربة الواقع الافتراضي"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.button
                  className="w-20 h-20 rounded-full bg-secondary/90 backdrop-blur-sm flex items-center justify-center shadow-gold group"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-8 h-8 text-secondary-foreground fill-current mr-[-2px]" />
                </motion.button>
              </div>

              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
            </div>

            {/* Floating Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="absolute -bottom-6 -left-4 lg:-left-8 bg-card p-5 rounded-2xl shadow-elevated border border-border/50"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center">
                  <Headset className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                  <div className="font-display text-xl font-bold text-foreground">+2,000</div>
                  <div className="text-xs text-muted-foreground">تجربة VR ناجحة</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
