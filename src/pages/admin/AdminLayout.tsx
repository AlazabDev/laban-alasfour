import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, 
  FolderTree, 
  LayoutDashboard, 
  Menu, 
  X, 
  Upload,
  Settings,
  ChevronLeft,
  FolderOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { icon: LayoutDashboard, label: "لوحة التحكم", href: "/admin" },
  { icon: Package, label: "المنتجات", href: "/admin/products" },
  { icon: FolderTree, label: "الفئات", href: "/admin/categories" },
  { icon: FolderOpen, label: "إدارة الملفات", href: "/admin/files" },
  { icon: Upload, label: "استيراد CSV", href: "/admin/import" },
  { icon: Settings, label: "الإعدادات", href: "/admin/settings" },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-muted/30" dir="rtl">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        <motion.aside
          initial={{ width: sidebarOpen ? 280 : 80 }}
          animate={{ width: sidebarOpen ? 280 : 80 }}
          transition={{ duration: 0.3 }}
          className="fixed right-0 top-0 h-screen bg-card border-l border-border z-40 overflow-hidden"
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              {sidebarOpen && (
                <motion.h1 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xl font-bold text-foreground"
                >
                  لوحة التحكم
                </motion.h1>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="shrink-0"
              >
                {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {sidebarLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <link.icon className="h-5 w-5 shrink-0" />
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="font-medium"
                      >
                        {link.label}
                      </motion.span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Back to Store */}
            <div className="p-4 border-t border-border">
              <Link
                to="/"
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                  "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <ChevronLeft className="h-5 w-5 shrink-0" />
                {sidebarOpen && <span className="font-medium">العودة للمتجر</span>}
              </Link>
            </div>
          </div>
        </motion.aside>
      </AnimatePresence>

      {/* Main Content */}
      <main
        className="transition-all duration-300"
        style={{ marginRight: sidebarOpen ? 280 : 80 }}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
