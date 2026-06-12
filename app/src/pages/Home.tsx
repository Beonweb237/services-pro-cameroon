import { useReveal } from '@/hooks/useReveal';
import Navigation from '@/sections/Navigation';
import Hero from '@/sections/Hero';
import TrustBanner from '@/sections/TrustBanner';
import Stats from '@/sections/Stats';
import ProScore from '@/sections/ProScore';
import ProsMoment from '@/sections/ProsMoment';
import Leaderboard from '@/sections/Leaderboard';
import Families from '@/sections/Families';
import Categories from '@/sections/Categories';
import HowItWorks from '@/sections/HowItWorks';
import Cities from '@/sections/Cities';
import ProfileShowcase from '@/sections/ProfileShowcase';
import Pricing from '@/sections/Pricing';
import Testimonials from '@/sections/Testimonials';
import FAQ from '@/sections/FAQ';
import Roadmap from '@/sections/Roadmap';
import CTA from '@/sections/CTA';
import Footer from '@/sections/Footer';

export default function Home() {
  useReveal();

  return (
    <div className="min-h-screen page-bg">
      <Navigation />
      <main>
        <Hero />
        <TrustBanner />
        <Stats />
        <ProScore />
        <ProsMoment />
        <Leaderboard />
        <Families />
        <Categories />
        <HowItWorks />
        <Cities />
        <ProfileShowcase />
        <Pricing />
        <Testimonials />
        <FAQ />
        <Roadmap />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
