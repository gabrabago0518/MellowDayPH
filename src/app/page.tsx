import About from "@/components/About";
import CartModal from "@/components/CartModal";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Menu from "@/components/Menu";
import SectionWave from "@/components/SectionWave";
import Testimonials from "@/components/Testimonials";
import VisitUs from "@/components/VisitUs";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-cream text-brown-900">
      <Header />
      <Hero />
      <About />
      <SectionWave background="bg-cream" fill="fill-green" />
      <Menu />
      <SectionWave background="bg-green" fill="fill-cream" />
      <Testimonials />
      <VisitUs />
      <Footer />
      <CartModal />
    </div>
  );
}
