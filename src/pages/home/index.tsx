import { Scenery } from "@/components/pixel/scenery";

import { FeaturesSection } from "./components/features-section";
import { HeroSection } from "./components/hero-section";
import { LandingNav } from "./components/landing-nav";
import { PageFooter } from "./components/page-footer";
import { PricingSection } from "./components/pricing-section";

export function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Scenery>
        <LandingNav />
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <PageFooter />
      </Scenery>
    </div>
  );
}
