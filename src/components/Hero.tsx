import { motion } from "framer-motion";
import { ArrowLeft, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-living-room.jpg";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <motion.img
          src={heroImage}
          alt="Modern luxury living room"
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl" dir="rtl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-secondary/30 rounded-full text-sm font-medium text-secondary">
              <Sparkles className="w-4 h-4" />
              تجربة الواقع الافتراضي متاحة الآن
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            صمّم مساحتك{" "}
            <span className="text-gradient-gold">المثالية</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed"
          >
            اكتشف مجموعتنا الحصرية من الأثاث والإضاءة الفاخرة. 
            جرّب منتجاتنا في منزلك افتراضياً قبل الشراء مع تقنية VR المتقدمة.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            <Button variant="hero" size="lg" className="group">
              تصفح المنتجات
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            </Button>
            <Button variant="heroOutline" size="lg" className="group">
              <Play className="w-5 h-5 ml-2" />
              شاهد تجربة VR
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-border/50"
          >
            <div>
              <div className="font-display text-3xl font-bold text-secondary">+500</div>
              <div className="text-sm text-muted-foreground mt-1">منتج فريد</div>
            </div>
            <div>
              <div className="font-display text-3xl font-bold text-secondary">+1000</div>
              <div className="text-sm text-muted-foreground mt-1">عميل سعيد</div>
            </div>
            <div>
              <div className="font-display text-3xl font-bold text-secondary">VR</div>
              <div className="text-sm text-muted-foreground mt-1">تجربة افتراضية</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-xs">اسحب للأسفل</span>
        <motion.div
          className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full p-1"
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div className="w-1.5 h-2.5 bg-secondary rounded-full mx-auto" />
        </motion.div>
      </motion.div>
    </section>
  );
}
