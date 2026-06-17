import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import DemoSection from "@/components/DemoSection";
import ImpactSection from "@/components/ImpactSection";
import MetricsSection from "@/components/MetricsSection";
import ComparisonSection from "@/components/ComparisonSection";
import VideoShowcaseSection from "@/components/VideoShowcaseSection ";
import TeamProductivitySection from "@/components/Teamproductivitysection";
import RoiSection from "@/components/Roisection";
import TechStackSection from "@/components/Techstacksection";
import FlowSection from "@/components/FlowSection";
import PixelForgeProductivitySection from "@/components/PixelForgeProductivitySection";

const Index = () => {
  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory bg-background scrollbar-hide">
      <Navbar />
      <section className="snap-start min-h-screen">
        <HeroSection />
      </section>
      <section className="snap-start min-h-screen">
        <TeamProductivitySection />
      </section>
      <section className="snap-start min-h-screen">
        <FlowSection />
      </section>
      <section className="snap-start min-h-screen">
        <TechStackSection />
      </section>
      <section className="snap-start min-h-screen">
        <MetricsSection />
      </section>
      <section className="snap-start min-h-screen">
        <DemoSection />
      </section>
      <section className="snap-start min-h-screen">
        <VideoShowcaseSection />
      </section>
      <section className="snap-start min-h-screen">
        <PixelForgeProductivitySection />
      </section>
      <section className="snap-start min-h-screen">
        <ComparisonSection />
      </section>
      <section className="snap-start min-h-screen">
        <RoiSection />
      </section>
      <section className="snap-start min-h-screen">
        <ImpactSection />
      </section>
    </div>
  );
};

export default Index;