import type { Metadata } from "next";
import CartModal from "@/components/CartModal";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Menu from "@/components/Menu";
import SectionWave from "@/components/SectionWave";
import { getMenuItems } from "@/lib/menu-items";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Browse Mellow Day PH's full menu — milk tea, coffee, and specialty drinks, handcrafted fresh and available for delivery or pickup in Taguig City.",
};

// Cached and served statically most of the time — an admin edit in the
// Menu dashboard tab calls revalidatePath("/menu") for an immediate
// refresh (see /api/admin/menu), so this interval is just a safety net,
// not how changes normally reach this page.
export const revalidate = 3600;

export default async function MenuPage() {
  const items = await getMenuItems();
  return (
    <div className="flex min-h-screen flex-col bg-green text-brown-900">
      <Header />
      <div className="flex-1">
        <Menu items={items} />
      </div>
      <SectionWave background="bg-green" fill="fill-[#F9F6EF]" />
      <Footer className="bg-[#F9F6EF]" />
      <CartModal />
    </div>
  );
}
