import LandingCommunity from "@/components/landing-community";
import LandingFeatures from "@/components/landing-features";
import LandingFooter from "@/components/landing-footer";
import LandingHeader from "@/components/landing-header";
import LandingHero from "@/components/landing-hero";

export default function LandingPage() {
  return (
    <>
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingCommunity />
      </main>
      <LandingFooter />
    </>
  );
}
