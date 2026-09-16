import CTA from "../components/Layout/CTA";
import Features from "../components/Layout/Features";
import Hero from "../components/Layout/Hero";
import HowItWorks from "../components/Layout/HowItWorks";
import Testimonials from "../components/Layout/Testimonials";
import TrustedCompanies from "../components/Layout/TrustedCompanies";


const Home = () => {
  return (
    <main>
      <Hero />
      <TrustedCompanies />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA />
    </main>
  );
};

export default Home;