import { motion } from "framer-motion";
import { ArrowLeft, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function CTASection() {
  return (
    <section className="relative py-28 overflow-hidden" dir="rtl">
      {/* Background */}
      <div className="absolute inset-0 bg-primary" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary-foreground)) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
            جاهز لتحويل <span className="text-secondary">منزلك؟</span>
          </h2>
          <p className="text-primary-foreground/50 text-base md:text-lg mb-10 leading-relaxed max-w-xl mx-auto">
            تصفح مجموعتنا الحصرية من الأثاث والإضاءة الفاخرة واحصل على استشارة مجانية من خبرائنا.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/living">
              <Button variant="hero" size="lg" className="group text-base">
                تصفح المنتجات
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="tel:+966501234567">
              <Button variant="heroOutline" size="lg" className="group text-base border-primary-foreground/20 text-primary-foreground hover:border-secondary hover:text-secondary">
                <Phone className="w-5 h-5 ml-2" />
                اتصل بنا الآن
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
