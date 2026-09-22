import type { Metadata } from "next";
import CartModal from "@/components/CartModal";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Menu from "@/components/Menu";
import SectionWave from "@/components/SectionWave";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Browse Mellow Day PH's full menu — milk tea, coffee, and specialty drinks, handcrafted fresh and made to order in Taguig City.",
};

export default function MenuPage() {
  return (
    <div className="flex min-h-screen flex-col bg-green text-brown-900">
      <Header />
      <div className="flex-1">
        <Menu />
      </div>
      <SectionWave background="bg-green" fill="fill-[#F9F6EF]" />
      <Footer className="bg-[#F9F6EF]" />
      <CartModal />
    </div>
  );
}
