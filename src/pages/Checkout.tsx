import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CreditCard, Truck, MapPin, ShoppingBag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<"info" | "confirm">("info");
  const [form, setForm] = useState({ name: "", phone: "", email: "", city: "", address: "", notes: "" });

  const shipping = subtotal > 500 ? 0 : 50;
  const tax = Math.round(subtotal * 0.15);
  const total = subtotal + shipping + tax;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.city || !form.address) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    setStep("confirm");
  };

  const handlePlaceOrder = () => {
    toast.success("تم تأكيد طلبك بنجاح! سنتواصل معك قريباً");
    clearCart();
    navigate("/");
  };

  if (items.length === 0 && step !== "confirm") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-20 container mx-auto px-4 text-center" dir="rtl">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold mb-4">السلة فارغة</h1>
          <p className="text-muted-foreground mb-6">لا توجد منتجات في سلة التسوق</p>
          <Link to="/">
            <Button variant="hero" size="lg">العودة للمتجر</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-28 pb-20 container mx-auto px-4" dir="rtl">
        {/* Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[
            { key: "info", label: "بيانات الشحن", icon: MapPin },
            { key: "confirm", label: "تأكيد الطلب", icon: Check },
          ].map((s, i) => (
            <div key={s.key} className="flex items-center gap-3">
              {i > 0 && <div className={`w-12 h-px ${step === "confirm" ? "bg-secondary" : "bg-border"}`} />}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${step === s.key ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"}`}>
                <s.icon className="w-4 h-4" />
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form / Confirmation */}
          <div className="lg:col-span-2">
            {step === "info" ? (
              <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-6 space-y-5">
                <h2 className="font-display text-xl font-bold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-secondary" /> بيانات الشحن
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>الاسم الكامل *</Label>
                    <Input name="name" value={form.name} onChange={handleChange} placeholder="محمد أحمد" required />
                  </div>
                  <div className="space-y-2">
                    <Label>رقم الهاتف *</Label>
                    <Input name="phone" value={form.phone} onChange={handleChange} placeholder="05xxxxxxxx" required dir="ltr" />
                  </div>
                  <div className="space-y-2">
                    <Label>البريد الإلكتروني</Label>
                    <Input name="email" value={form.email} onChange={handleChange} placeholder="email@example.com" type="email" dir="ltr" />
                  </div>
                  <div className="space-y-2">
                    <Label>المدينة *</Label>
                    <Input name="city" value={form.city} onChange={handleChange} placeholder="الرياض" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>العنوان التفصيلي *</Label>
                  <Input name="address" value={form.address} onChange={handleChange} placeholder="الحي، الشارع، رقم المبنى" required />
                </div>
                <div className="space-y-2">
                  <Label>ملاحظات إضافية</Label>
                  <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="أي تعليمات خاصة بالتوصيل..." className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <Button type="submit" variant="hero" size="lg" className="w-full sm:w-auto">
                  متابعة
                  <ArrowRight className="w-4 h-4 mr-1 rotate-180" />
                </Button>
              </motion.form>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border p-6 space-y-5">
                <h2 className="font-display text-xl font-bold flex items-center gap-2">
                  <Check className="w-5 h-5 text-secondary" /> تأكيد الطلب
                </h2>
                <div className="bg-muted/50 rounded-xl p-4 space-y-2 text-sm">
                  <p><strong>الاسم:</strong> {form.name}</p>
                  <p><strong>الهاتف:</strong> {form.phone}</p>
                  {form.email && <p><strong>البريد:</strong> {form.email}</p>}
                  <p><strong>المدينة:</strong> {form.city}</p>
                  <p><strong>العنوان:</strong> {form.address}</p>
                  {form.notes && <p><strong>ملاحظات:</strong> {form.notes}</p>}
                </div>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 bg-muted/30 rounded-xl p-3">
                      <img src={item.image} alt={item.name_ar} className="w-14 h-14 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.name_ar}</p>
                        <p className="text-xs text-muted-foreground">الكمية: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-sm text-secondary">
                        {((item.sale_price ?? item.price) * item.quantity).toLocaleString()} ر.س
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep("info")}>تعديل البيانات</Button>
                  <Button variant="hero" size="lg" onClick={handlePlaceOrder} className="flex-1">
                    <CreditCard className="w-4 h-4 ml-2" />
                    تأكيد وإتمام الطلب
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-card rounded-2xl border border-border p-6 sticky top-28 space-y-4">
              <h3 className="font-display text-lg font-bold flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-secondary" /> ملخص الطلب
              </h3>
              <div className="space-y-3 text-sm">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-muted-foreground">{item.name_ar} × {item.quantity}</span>
                    <span>{((item.sale_price ?? item.price) * item.quantity).toLocaleString()} ر.س</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">المجموع الفرعي</span><span>{subtotal.toLocaleString()} ر.س</span></div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> الشحن</span>
                  <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>{shipping === 0 ? "مجاني" : `${shipping} ر.س`}</span>
                </div>
                <div className="flex justify-between"><span className="text-muted-foreground">ضريبة القيمة المضافة (15%)</span><span>{tax.toLocaleString()} ر.س</span></div>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                <span>الإجمالي</span>
                <span className="text-secondary">{total.toLocaleString()} ر.س</span>
              </div>
              {shipping === 0 && (
                <p className="text-xs text-green-600 bg-green-50 rounded-lg p-2 text-center">🎉 شحن مجاني للطلبات فوق 500 ر.س</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
