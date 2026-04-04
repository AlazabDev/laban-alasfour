import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center py-20" dir="rtl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center px-4 max-w-lg"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-display text-[120px] md:text-[160px] font-bold leading-none text-gradient-gold mb-4"
          >
            404
          </motion.div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
            الصفحة غير موجودة
          </h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها. يمكنك العودة للصفحة الرئيسية لتصفح منتجاتنا.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/">
              <Button variant="hero" size="lg" className="gap-2">
                <Home className="w-4 h-4" />
                العودة للرئيسية
              </Button>
            </Link>
            <Link to="/living">
              <Button variant="outline" size="lg" className="gap-2">
                تصفح المنتجات
                <ArrowRight className="w-4 h-4 rotate-180" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
