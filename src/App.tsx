import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import { RequireAdmin } from "@/components/RequireAdmin";
import { CustomerAssistant } from "@/components/CustomerAssistant";
import { env } from "@/lib/env";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const VRExperiencePage = lazy(() => import("./pages/VRExperiencePage"));
const Checkout = lazy(() => import("./pages/Checkout"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Products = lazy(() => import("./pages/admin/Products"));
const ProductForm = lazy(() => import("./pages/admin/ProductForm"));
const Categories = lazy(() => import("./pages/admin/Categories"));
const ImportCSV = lazy(() => import("./pages/admin/ImportCSV"));
const FileManager = lazy(() => import("./pages/admin/FileManager"));
const Settings = lazy(() => import("./pages/admin/Settings"));

function PageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
      جاري تحميل الصفحة...
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <CartDrawer />
          <CustomerAssistant />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />

              <Route path="/living" element={<CategoryPage />} />
              <Route path="/bedroom" element={<CategoryPage />} />
              <Route path="/lighting" element={<CategoryPage />} />
              <Route path="/kitchen" element={<CategoryPage />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/vr" element={<VRExperiencePage />} />
              <Route path="/checkout" element={<Checkout />} />

              {env.enableAdmin && (
                <Route
                  path="/admin"
                  element={
                    <RequireAdmin>
                      <AdminLayout />
                    </RequireAdmin>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="products" element={<Products />} />
                  <Route path="products/new" element={<ProductForm />} />
                  <Route path="products/:id" element={<ProductForm />} />
                  <Route path="categories" element={<Categories />} />
                  <Route path="files" element={<FileManager />} />
                  <Route path="import" element={<ImportCSV />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              )}

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
