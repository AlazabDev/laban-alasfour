import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";

export function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, removeItem, updateQuantity, subtotal, itemCount, clearCart } = useCart();

  const shipping = subtotal > 500 ? 0 : 50;
  const tax = Math.round(subtotal * 0.15);
  const total = subtotal + shipping + tax;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-border z-50 flex flex-col shadow-2xl"
            dir="rtl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-secondary" />
                <h2 className="font-display text-lg font-bold">سلة التسوق</h2>
                <span className="bg-secondary text-secondary-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {itemCount}
                </span>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="w-9 h-9 rounded-full hover:bg-muted flex items-center justify-center transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">سلة التسوق فارغة</p>
                  <Button variant="outline" onClick={() => setIsCartOpen(false)}>
                    تصفح المنتجات
                  </Button>
                </div>
              ) : (
                <>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      className="flex gap-4 bg-muted/40 rounded-xl p-3"
                    >
                      <Link to={`/product/${item.slug}`} onClick={() => setIsCartOpen(false)}>
                        <img src={item.image} alt={item.name_ar} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">{item.name_ar}</h3>
                        <p className="text-secondary font-bold mt-1">
                          {(item.sale_price ?? item.price).toLocaleString()} <span className="text-xs font-normal">ر.س</span>
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center border border-border rounded-lg overflow-hidden">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center hover:bg-muted transition-colors">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center hover:bg-muted transition-colors">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button onClick={() => removeItem(item.id)} className="w-7 h-7 flex items-center justify-center text-destructive/60 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors mr-auto">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  <button onClick={clearCart} className="text-xs text-muted-foreground hover:text-destructive transition-colors">
                    إفراغ السلة
                  </button>
                </>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-5 space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">المجموع الفرعي</span>
                    <span>{subtotal.toLocaleString()} ر.س</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الشحن</span>
                    <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                      {shipping === 0 ? "مجاني" : `${shipping} ر.س`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الضريبة (15%)</span>
                    <span>{tax.toLocaleString()} ر.س</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border font-bold text-base">
                    <span>الإجمالي</span>
                    <span className="text-secondary">{total.toLocaleString()} ر.س</span>
                  </div>
                </div>
                <Link to="/checkout" onClick={() => setIsCartOpen(false)}>
                  <Button variant="hero" size="lg" className="w-full">
                    إتمام الطلب
                    <ArrowLeft className="w-4 h-4 mr-1" />
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
