import Header from "@/components/landing-header";
import Hero from "@/components/landing-hero";
import Features from "@/components/landing-features";
import Community from "@/components/landing-community";
import Footer from "@/components/landing-footer";

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div
        className="fixed inset-0 bg-[url('https://sjc.microlink.io/ZtwmdFiEUf0_DO7Y4PqPMHLsfJehzZnKChWZXFdvLVTUOIhG0mFCbd6vijSBq24DAYHXIQfgb8N5c8V2kSN2bQ.jpeg')] opacity-10"
        aria-hidden="true"
      />
      <div className="relative">
        <Header />
        <main>
          <Hero />
          <Features />
          <Community />
        </main>
        <Footer />
      </div>
    </div>
  );
}
