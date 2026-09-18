import CartModal from "@/components/CartModal";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Menu from "@/components/Menu";

export default function MenuPage() {
  return (
    <div className="flex min-h-screen flex-col bg-green text-brown-900">
      <Header />
      <div className="flex-1">
        <Menu />
      </div>
      <Footer />
      <CartModal />
    </div>
  );
}
