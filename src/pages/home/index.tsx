import { Scenery } from "@/components/pixel/scenery";

import { FeaturesSection } from "./components/features-section";
import { HeroSection } from "./components/hero-section";
import { LandingNav } from "./components/landing-nav";
import { PricingSection } from "./components/pricing-section";

export function HomePage() {
  return (
    <>
      <title>Cosy Domain Provider — Free subdomains</title>
      <meta
        name="description"
        content="Get a free subdomain on play.cosy-hosting.net. Claim your address, point it at your server's IP, and you're online in minutes. Upgrade to Cosy+ for a custom name and up to 5 subdomains."
      />
      <link rel="canonical" href="https://cosy-hosting.net/" />
      <div className="min-h-screen flex flex-col">
        <Scenery>
          <LandingNav />
          <HeroSection />
          <FeaturesSection />
          <PricingSection />
        </Scenery>
      </div>
    </>
  );
}
