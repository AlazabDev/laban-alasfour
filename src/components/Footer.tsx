import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  MapPin, 
  Phone, 
  Mail,
  ArrowUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logo.png";

const footerLinks = {
  products: [
    { name: "غرف المعيشة", href: "/living" },
    { name: "غرف النوم", href: "/bedroom" },
    { name: "الإضاءة", href: "/lighting" },
    { name: "المطابخ", href: "/kitchen" },
    { name: "تجربة VR", href: "/vr" },
  ],
  company: [
    { name: "من نحن", href: "/about" },
    { name: "المدونة", href: "/blog" },
    { name: "وظائف", href: "/careers" },
    { name: "اتصل بنا", href: "/contact" },
  ],
  support: [
    { name: "مركز المساعدة", href: "/help" },
    { name: "الشحن والتوصيل", href: "/shipping" },
    { name: "سياسة الإرجاع", href: "/returns" },
    { name: "الأسئلة الشائعة", href: "/faq" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "Youtube" },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-charcoal text-background" dir="rtl">
      {/* Newsletter Section */}
      <div className="border-b border-background/10">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row items-center justify-between gap-8"
          >
            <div className="text-center lg:text-right">
              <h3 className="font-display text-2xl font-bold mb-2">
                اشترك في نشرتنا البريدية
              </h3>
              <p className="text-background/70">
                احصل على آخر العروض والمنتجات الجديدة مباشرة في بريدك
              </p>
            </div>
            <div className="flex gap-3 w-full lg:w-auto">
              <Input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="bg-background/10 border-background/20 text-background placeholder:text-background/50 min-w-[280px]"
              />
              <Button variant="secondary">اشترك</Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <img src={logo} alt="Laban Alasfour" className="h-16 brightness-0 invert" />
            </Link>
            <p className="text-background/70 mb-6 leading-relaxed max-w-md">
              لبن الأصفور للحلول المعمارية المتقدمة. نقدم أرقى قطع الأثاث والإضاءة 
              مع تجربة تسوق فريدة تدعم تقنية الواقع الافتراضي.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-background/70">
                <MapPin className="w-5 h-5 text-secondary" />
                <span>الرياض، المملكة العربية السعودية</span>
              </div>
              <div className="flex items-center gap-3 text-background/70">
                <Phone className="w-5 h-5 text-secondary" />
                <span dir="ltr">+966 50 123 4567</span>
              </div>
              <div className="flex items-center gap-3 text-background/70">
                <Mail className="w-5 h-5 text-secondary" />
                <span>info@labanalasfour.com</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-6">المنتجات</h4>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-background/70 hover:text-secondary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-lg mb-6">الشركة</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-background/70 hover:text-secondary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-lg mb-6">الدعم</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-background/70 hover:text-secondary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-background/50 text-sm">
              © 2025 لبن الأصفور. جميع الحقوق محفوظة.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>

            {/* Back to Top */}
            <motion.button
              onClick={scrollToTop}
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}
