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
  ArrowUp,
  Send,
  CreditCard,
  Truck,
  Shield,
  RotateCcw,
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

const trustFeatures = [
  { icon: Truck, label: "شحن مجاني", desc: "للطلبات فوق 500 ر.س" },
  { icon: Shield, label: "ضمان سنتين", desc: "ضمان شامل" },
  { icon: RotateCcw, label: "استرجاع سهل", desc: "خلال 14 يوم" },
  { icon: CreditCard, label: "دفع آمن", desc: "طرق دفع متعددة" },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-foreground text-background" dir="rtl">
      {/* Trust Features Bar */}
      <div className="border-b border-background/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x md:rtl:divide-x-reverse divide-background/10">
            {trustFeatures.map((feature) => (
              <div key={feature.label} className="flex items-center gap-3 py-6 px-4 md:justify-center">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-background/90">{feature.label}</p>
                  <p className="text-xs text-background/40">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-b border-background/10">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row items-center justify-between gap-10"
          >
            <div className="text-center lg:text-right max-w-md">
              <h3 className="font-display text-3xl font-bold mb-3">
                ابقَ على <span className="text-gradient-gold">اطلاع</span>
              </h3>
              <p className="text-background/50 text-sm leading-relaxed">
                احصل على آخر العروض والمنتجات الجديدة مباشرة في بريدك الإلكتروني
              </p>
            </div>
            <div className="flex gap-2 w-full lg:w-auto">
              <div className="relative flex-1 lg:min-w-[320px]">
                <Input
                  type="email"
                  placeholder="بريدك الإلكتروني"
                  className="bg-background/5 border-background/15 text-background placeholder:text-background/30 h-12 pr-4 pl-12 rounded-xl focus:border-secondary/50"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute left-1 top-1/2 -translate-y-1/2 h-10 w-10 bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-lg"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
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
              <img src={logo} alt="لبن الأصفور" className="h-14 brightness-0 invert opacity-80" />
            </Link>
            <p className="text-background/40 mb-8 leading-relaxed max-w-sm text-sm">
              لبن الأصفور للحلول المعمارية المتقدمة. نقدم أرقى قطع الأثاث والإضاءة
              مع تجربة تسوق فريدة تدعم تقنية الواقع الافتراضي.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              {[
                { icon: MapPin, text: "الرياض، المملكة العربية السعودية" },
                { icon: Phone, text: "+966 50 123 4567", dir: "ltr" as const },
                { icon: Mail, text: "info@labanalasfour.com" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 text-background/40 text-sm group hover:text-background/60 transition-colors">
                  <item.icon className="w-4 h-4 text-secondary/60 flex-shrink-0 group-hover:text-secondary transition-colors" />
                  <span dir={item.dir}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: "المنتجات", links: footerLinks.products },
            { title: "الشركة", links: footerLinks.company },
            { title: "الدعم", links: footerLinks.support },
          ].map((section) => (
            <div key={section.title}>
              <h4 className="font-display font-semibold text-sm mb-6 text-background/70 relative inline-block">
                {section.title}
                <span className="absolute -bottom-1 right-0 w-8 h-0.5 bg-secondary/40 rounded-full" />
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-background/40 hover:text-secondary transition-colors duration-300 text-sm flex items-center gap-2 group"
                    >
                      <span className="w-0 h-px bg-secondary group-hover:w-3 transition-all duration-300" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-background/30 text-xs">
              © {new Date().getFullYear()} لبن الأصفور. جميع الحقوق محفوظة.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-background/5 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all duration-300 text-background/40 hover:shadow-gold"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            {/* Back to Top */}
            <motion.button
              onClick={scrollToTop}
              className="w-9 h-9 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary hover:bg-secondary hover:text-secondary-foreground transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowUp className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}
