import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Play, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-living-room.jpg";
import { useRef } from "react";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);

  return (
    <section ref={ref} className="relative min-h-[100svh] flex items-center pt-20 overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div className="absolute inset-0 z-0" style={{ y: imageY }}>
        <motion.img
          src={heroImage}
          alt="تصميم داخلي فاخر لغرفة معيشة عصرية"
          className="w-full h-[120%] object-cover"
          initial={{ scale: 1.2, filter: "brightness(0.8)" }}
          animate={{ scale: 1, filter: "brightness(1)" }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        {/* Multi-layer gradients for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/60" />
      </motion.div>

      {/* Decorative geometric elements */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-32 left-[15%] w-px h-32 bg-gradient-to-b from-transparent via-secondary/30 to-transparent"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.5, delay: 1.2 }}
        />
        <motion.div
          className="absolute top-48 left-[15%] w-16 h-px bg-gradient-to-r from-secondary/30 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        />
        <motion.div
          className="absolute bottom-40 right-[10%] w-24 h-24 border border-secondary/10 rounded-full"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.8 }}
        />
        <motion.div
          className="absolute bottom-48 right-[12%] w-12 h-12 border border-secondary/20 rounded-full"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="container mx-auto px-4 relative z-10"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <div className="max-w-2xl" dir="rtl">
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary/10 backdrop-blur-sm border border-secondary/20 rounded-full text-sm font-medium text-secondary">
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.span>
              تجربة الواقع الافتراضي متاحة الآن
            </span>
          </motion.div>

          {/* Main heading with staggered word animation */}
          <div className="overflow-hidden mb-2">
            <motion.h1
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
              className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1]"
            >
              صمّم مساحتك
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
              className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1]"
            >
              <span className="text-gradient-gold">المثالية</span>
            </motion.h1>
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-base md:text-lg text-muted-foreground mb-10 leading-relaxed max-w-lg"
          >
            اكتشف مجموعتنا الحصرية من الأثاث والإضاءة الفاخرة.
            جرّب منتجاتنا في منزلك افتراضياً قبل الشراء.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/living">
              <Button variant="hero" size="lg" className="group text-base">
                تصفح المنتجات
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/vr">
              <Button variant="heroOutline" size="lg" className="group text-base">
                <Play className="w-5 h-5 ml-2" />
                شاهد تجربة VR
              </Button>
            </Link>
          </motion.div>

          {/* Stats with divider lines */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="flex items-center gap-0 mt-20"
          >
            {[
              { value: "+500", label: "منتج فريد" },
              { value: "+1000", label: "عميل سعيد" },
              { value: "VR", label: "تجربة افتراضية" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.5 + i * 0.15 }}
                className={`flex-1 text-center ${i < 2 ? "border-l border-border/40" : ""}`}
              >
                <div className="font-display text-2xl md:text-3xl font-bold text-secondary">{stat.value}</div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
