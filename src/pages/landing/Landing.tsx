import '@/assets/scss/landing/main.scss';
import { Banner } from '@/components/landing/Banner';
import { Crypto } from '@/components/landing/Crypto';
import { Exchange } from '@/components/landing/Exchange';
import { Faq } from '@/components/landing/Faq';
import { Features } from '@/components/landing/Features';
import { Footer } from '@/components/landing/Footer';
import { Header } from '@/components/landing/Header';
import { Marquee } from '@/components/landing/Marquee';
import { Roadmap } from '@/components/landing/Roadmap';
import { ScrollTopButton } from '@/components/landing/ScrollTopButton';
import { SectionDivider } from '@/components/landing/SectionDivider';
import { Token } from '@/components/landing/Token';
import { Work } from '@/components/landing/Work';

export default function Landing() {
  return (
    <>
      <Header />
      <main className="main-area fix">
        <Banner />
        <Features />
        <Marquee />
        <Token />
        <SectionDivider />
        <Work />
        <Exchange />
        <Crypto />
        <Faq />
        <SectionDivider />
        <Roadmap />
      </main>
      <Footer />
      <ScrollTopButton />
    </>
  );
}






