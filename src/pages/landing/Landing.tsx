import { lazy, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/assets/scss/landing/main.scss';
import ScrollToTop from '@/components/base/ScrollToTop';

const Header = lazy(() => import('@/components/landing/Header'));
const Banner = lazy(() => import('@/components/landing/Banner'));
const Features = lazy(() => import('@/components/landing/Features'));
const Marquee = lazy(() => import('@/components/landing/Marquee'));
const TokenSale = lazy(() => import('@/components/landing/TokenSale'));
const SectionDivider = lazy(() => import('@/components/landing/SectionDivider'));
const HowItWorks = lazy(() => import('@/components/landing/HowItWorks'));
const Exchange = lazy(() => import('@/components/landing/Exchange'));
const FAQ = lazy(() => import('@/components/landing/Faq'));
const Roadmap = lazy(() => import('@/components/landing/Roadmap'));
const Footer = lazy(() => import('@/components/landing/Footer'));
const PlatformCapabilities = lazy(() => import('@/components/landing/PlatformCapabilities'));
const ContactModal = lazy(() => import('@/components/landing/ContactModal'));

export default function Landing() {
  const [contactOpen, setContactOpen] = useState(false);

  const handleOpenContact = () => {
    setContactOpen(true);
  };

  const handleCloseContact = () => {
    setContactOpen(false);
  };

  return (
    <>
      <ScrollToTop />
      <Header onOpenContact={handleOpenContact} />
      <main className="main-area fix">
        <Banner onOpenContact={handleOpenContact} />
        <Features />
        <Marquee />
        <TokenSale onOpenContact={handleOpenContact} />
        <SectionDivider />
        <HowItWorks />
        <Exchange />
        <PlatformCapabilities onOpenContact={handleOpenContact} />
        <FAQ />
        <SectionDivider />
        <Roadmap />
      </main>
      <Footer />
      <ContactModal open={contactOpen} onClose={handleCloseContact} />
    </>
  );
}


