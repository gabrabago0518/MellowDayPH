import About from "@/components/About";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Menu from "@/components/Menu";
import Testimonials from "@/components/Testimonials";
import VisitUs from "@/components/VisitUs";
import { CartProvider } from "@/lib/CartContext";

export default function Home() {
  return (
    <CartProvider>
      <div className="flex flex-1 flex-col bg-cream text-brown-900">
        <Header />
        <Hero />
        <About />
        <Menu />
        <Testimonials />
        <VisitUs />
        <Footer />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
