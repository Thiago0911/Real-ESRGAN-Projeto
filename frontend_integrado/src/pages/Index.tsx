import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import DemoSection from "@/components/DemoSection";
import ImpactSection from "@/components/ImpactSection";
import Footer from "@/components/Footer";
import MetricsSection from "@/components/MetricsSection";
import ComparisonSection from "@/components/ComparisonSection";

const Index = () => {
  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory bg-background">
      <Navbar />
      <section className="snap-start h-screen">
        <HeroSection />
      </section>
      <section className="snap-start h-screen">
        <FeaturesSection />
      </section>
      <section className="snap-start h-screen">
        <MetricsSection />
      </section>
      <section className="snap-start h-screen">
        <DemoSection />
      </section>
      <section className="snap-start h-screen">
        <ComparisonSection />
      </section>
      <section className="snap-start h-screen">
        <ImpactSection />
      </section>
      <section className="snap-start">
        <Footer />
      </section>
    </div>
  );
};

export default Index;