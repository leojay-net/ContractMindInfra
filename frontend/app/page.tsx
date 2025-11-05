/**
 * Landing Page
 * 
 * Main entry point with wallet connection requirement for dashboard access.
 * 
 * @module app/page
 */

import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import CTA from '@/components/landing/CTA';
import Footer from '@/components/landing/Footer';
import RoboticScene from '@/components/3d/RoboticScene';

export default function Home() {
  return (
    <main className="min-h-screen bg-black relative">
      {/* Fixed 3D Background - visible throughout scroll */}
      <div className="fixed inset-0 z-0">
        <RoboticScene />
      </div>

      {/* Page Content */}
      <div className="relative z-10">
        <Header />
        <Hero />
        <Features />
        <HowItWorks />
        <CTA />
        <Footer />
      </div>
    </main>
  );
}
