import About from "@/components/About";
import CartModal from "@/components/CartModal";
import FeaturedMenu from "@/components/FeaturedMenu";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SectionWave from "@/components/SectionWave";
import Testimonials from "@/components/Testimonials";
import VisitUs from "@/components/VisitUs";
import { getMenuItems } from "@/lib/menu-items";

// Same on-demand-revalidation pattern as /menu — see that page for why.
export const revalidate = 3600;

export default async function Home() {
  const items = await getMenuItems();
  return (
    <div className="flex flex-1 flex-col bg-cream text-brown-900">
      <Header />
      <Hero />
      <About />
      {items.length > 0 && (
        <>
          <SectionWave background="bg-cream" fill="fill-green" />
          <FeaturedMenu items={items} />
          <SectionWave background="bg-green" fill="fill-cream" />
        </>
      )}
      <Testimonials />
      <VisitUs />
      <SectionWave background="bg-cream" fill="fill-green" />
      <Footer />
      <CartModal />
    </div>
  );
}
