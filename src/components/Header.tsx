import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, ShoppingBag, User, Globe, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import logo from "@/assets/logo.png";

const navLinks = [
  { name: "الرئيسية", nameEn: "Home", href: "/" },
  { name: "غرف المعيشة", nameEn: "Living Room", href: "/living" },
  { name: "غرف النوم", nameEn: "Bedroom", href: "/bedroom" },
  { name: "الإضاءة", nameEn: "Lighting", href: "/lighting" },
  { name: "المطابخ", nameEn: "Kitchen", href: "/kitchen" },
  { name: "تجربة VR", nameEn: "VR Experience", href: "/vr" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isArabic, setIsArabic] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { itemCount, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <>
      {/* Top Bar */}
      <div className="hidden lg:block bg-primary text-primary-foreground/80 text-xs">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-9" dir="rtl">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-secondary" />
                <span dir="ltr">+966 50 123 4567</span>
              </span>
              <span className="text-primary-foreground/40">|</span>
              <span>شحن مجاني للطلبات فوق 500 ر.س</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsArabic(!isArabic)}
                className="flex items-center gap-1.5 hover:text-secondary transition-colors"
              >
                <Globe className="w-3 h-3" />
                {isArabic ? "English" : "العربية"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-soft"
            : "bg-background border-b border-border/30"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 relative z-10">
              <motion.img
                src={logo}
                alt="Laban Alasfour"
                className="h-11 w-auto"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-0.5" dir={isArabic ? "rtl" : "ltr"}>
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg group ${
                      isActive
                        ? "text-secondary"
                        : "text-foreground/70 hover:text-foreground"
                    }`}
                  >
                    {isArabic ? link.name : link.nameEn}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-gradient-gold rounded-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    {!isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-secondary/30 rounded-full group-hover:w-5 transition-all duration-300" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="hidden md:flex h-10 w-10 text-foreground/60 hover:text-foreground hover:bg-muted/80 rounded-xl">
                <Search className="h-[18px] w-[18px]" />
              </Button>
              <Button variant="ghost" size="icon" className="hidden md:flex h-10 w-10 text-foreground/60 hover:text-foreground hover:bg-muted/80 rounded-xl">
                <User className="h-[18px] w-[18px]" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 text-foreground/60 hover:text-foreground hover:bg-muted/80 rounded-xl"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingBag className="h-[18px] w-[18px]" />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-secondary text-secondary-foreground text-[10px] rounded-full flex items-center justify-center font-bold shadow-gold"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </Button>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-10 w-10 rounded-xl"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
              className="lg:hidden bg-background/98 backdrop-blur-xl border-t border-border/50 overflow-hidden"
            >
              <nav className="container mx-auto px-4 py-6 flex flex-col gap-1" dir={isArabic ? "rtl" : "ltr"}>
                {navLinks.map((link, index) => {
                  const isActive = location.pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={link.href}
                        className={`block text-base font-medium py-3 px-4 rounded-xl transition-all ${
                          isActive
                            ? "text-secondary bg-secondary/10 border-r-2 border-secondary"
                            : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                        }`}
                      >
                        {isArabic ? link.name : link.nameEn}
                      </Link>
                    </motion.div>
                  );
                })}
                {/* Mobile extras */}
                <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-between">
                  <button
                    onClick={() => setIsArabic(!isArabic)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    {isArabic ? "English" : "العربية"}
                  </button>
                  <span className="text-xs text-muted-foreground" dir="ltr">+966 50 123 4567</span>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
