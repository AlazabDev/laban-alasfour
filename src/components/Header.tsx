import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, ShoppingBag, User, Globe } from "lucide-react";
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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border/50 shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 relative z-10">
            <motion.img
              src={logo}
              alt="Laban Alasfour"
              className="h-12 w-auto"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" dir={isArabic ? "rtl" : "ltr"}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-lg ${
                    isActive
                      ? "text-secondary"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {isArabic ? link.name : link.nameEn}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-secondary rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="hidden md:flex h-9 w-9 text-foreground/60 hover:text-foreground">
              <Search className="h-[18px] w-[18px]" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex h-9 w-9 text-foreground/60 hover:text-foreground">
              <User className="h-[18px] w-[18px]" />
            </Button>
            <Button variant="ghost" size="icon" className="relative h-9 w-9 text-foreground/60 hover:text-foreground">
              <ShoppingBag className="h-[18px] w-[18px]" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-secondary text-secondary-foreground text-[10px] rounded-full flex items-center justify-center font-bold">
                0
              </span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsArabic(!isArabic)}
              className="hidden md:flex h-9 w-9 text-foreground/60 hover:text-foreground"
            >
              <Globe className="h-[18px] w-[18px]" />
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9"
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
            className="lg:hidden bg-background/95 backdrop-blur-xl border-t border-border/50 overflow-hidden"
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
                      className={`block text-base font-medium py-3 px-4 rounded-xl transition-colors ${
                        isActive
                          ? "text-secondary bg-secondary/10"
                          : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      {isArabic ? link.name : link.nameEn}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
