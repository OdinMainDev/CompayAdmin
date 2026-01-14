import 'bootstrap/dist/css/bootstrap.min.css';
import '@/assets/scss/landing/main.scss';
import Header from '@/components/landing/Header';
import Banner from '@/components/landing/Banner';
import Features from '@/components/landing/Features';
import Marquee from '@/components/landing/Marquee';
import TokenSale from '@/components/landing/TokenSale';
import SectionDivider from '@/components/landing/SectionDivider';
import HowItWorks from '@/components/landing/HowItWorks';
import Exchange from '@/components/landing/Exchange';
import CryptoDirection from '@/components/landing/CryptoDirection';
import FAQ from '@/components/landing/FAQ';
import Roadmap from '@/components/landing/Roadmap';
import Footer from '@/components/landing/Footer';

export default function Landing() {
  return (
    <>
      <Header />
      <main className="main-area fix">
        <Banner />
        <Features />
        <Marquee />
        <TokenSale />
        <SectionDivider />
        <HowItWorks />
        <Exchange />
        <CryptoDirection />
        <FAQ />
        <SectionDivider />
        <Roadmap />
      </main>
      <Footer />
    </>
  );
}






