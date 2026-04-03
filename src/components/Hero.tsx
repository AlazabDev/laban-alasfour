import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Play, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-living-room.jpg";
import { useRef, useEffect, useState } from "react";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);

  return <>{count}{suffix}</>;
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);

  return (
    <section ref={ref} className="relative min-h-[100svh] flex flex-col overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div className="absolute inset-0 z-0" style={{ y: imageY }}>
        <motion.img
          src={heroImage}
          alt="تصميم داخلي فاخر لغرفة معيشة عصرية"
          className="w-full h-[120%] object-cover"
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
        />
        {/* Dark overlay like luxury-finishing */}
        <div className="absolute inset-0 bg-primary/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-primary/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-transparent to-transparent" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="container mx-auto px-4 relative z-10 flex-1 flex items-center pt-24 pb-32"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <div className="max-w-3xl" dir="rtl">
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary/15 backdrop-blur-sm border border-secondary/25 rounded-full text-sm font-medium text-secondary">
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.span>
              متخصصون في الأثاث والإضاءة الفاخرة
            </span>
          </motion.div>

          {/* Main heading */}
          <div className="overflow-hidden mb-2">
            <motion.h1
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
              className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1] text-primary-foreground"
            >
              صمّم مساحتك
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-4">
            <motion.h1
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
              className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1]"
            >
              <span className="text-secondary">المثالية</span>
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-secondary text-lg md:text-xl font-medium mb-4"
          >
            منزل أحلامك يبدأ من هنا
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-base md:text-lg text-primary-foreground/60 mb-10 leading-relaxed max-w-xl"
          >
            نصمم ونوفر لك أرقى قطع الأثاث والإضاءة بتصاميم عصرية وجودة أوروبية — 
            مع تجربة واقع افتراضي حصرية لمعاينة المنتجات في منزلك.
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
              <Button variant="heroOutline" size="lg" className="group text-base border-primary-foreground/20 text-primary-foreground hover:border-secondary hover:text-secondary">
                <Play className="w-5 h-5 ml-2" />
                شاهد تجربة VR
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Bar - Bottom overlay like luxury-finishing */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        className="relative z-10"
      >
        <div className="container mx-auto px-4">
          <div className="bg-card/95 backdrop-blur-xl rounded-t-2xl border border-border/30 shadow-elevated">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border/30 rtl:divide-x-reverse" dir="rtl">
              {[
                { value: 15, suffix: "+", label: "سنة خبرة" },
                { value: 500, suffix: "+", label: "منتج فريد" },
                { value: 1000, suffix: "+", label: "عميل سعيد" },
                { value: 98, suffix: "%", label: "رضا العملاء" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.6 + i * 0.1 }}
                  className="py-6 md:py-8 px-4 text-center"
                >
                  <div className="font-display text-3xl md:text-4xl font-bold text-secondary">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-28 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-primary-foreground/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
