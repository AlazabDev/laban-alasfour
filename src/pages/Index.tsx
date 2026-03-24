import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { BrandBanner } from "@/components/BrandBanner";
import { Categories } from "@/components/Categories";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { VRExperience } from "@/components/VRExperience";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <BrandBanner />
        <Categories />
        <FeaturedProducts />
        <VRExperience />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
