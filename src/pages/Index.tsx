import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { BrandBanner } from "@/components/BrandBanner";
import { Categories } from "@/components/Categories";
import { ServicesOverview } from "@/components/ServicesOverview";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { VRExperience } from "@/components/VRExperience";
import { Testimonials } from "@/components/Testimonials";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <BrandBanner />
        <FeaturedProducts />
        <Categories />
        <VRExperience />
        <ServicesOverview />
        <WhyChooseUs />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
