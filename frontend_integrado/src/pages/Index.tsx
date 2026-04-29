import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import DemoSection from "@/components/DemoSection";
import ImpactSection from "@/components/ImpactSection";
import MetricsSection from "@/components/MetricsSection";
import ComparisonSection from "@/components/ComparisonSection";
//import PipelineSection from "@/components/PipelineSection";
import TeamProductivitySection from "@/components/Teamproductivitysection";
import RoiSection from "@/components/Roisection";
import TechStackSection from "@/components/Techstacksection";

const Index = () => {
  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory bg-background scrollbar-hide">
      <Navbar />
      <section className="snap-start h-screen">
        <HeroSection />
      </section>
      <section className="snap-start h-screen">
        <TeamProductivitySection />
      </section>
      <section className="snap-start h-screen">
        <TechStackSection />
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
        <RoiSection />
      </section>
      <section className="snap-start h-screen">
        <ImpactSection />
      </section>
    </div>
  );
};

export default Index;