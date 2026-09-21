import Link from "next/link";
import CartModal from "@/components/CartModal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-cream text-brown-900">
      <Header />
      <main className="flex flex-1 items-center justify-center px-6 py-32 text-center">
        <div>
          <p className="font-heading text-6xl font-extrabold text-brown-900/20">404</p>
          <h1 className="mt-2 font-heading text-2xl font-bold text-brown-900 sm:text-3xl">
            Page not found
          </h1>
          <p className="mt-2 text-sm text-brown-900/70">
            We couldn&apos;t find what you were looking for.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-full bg-brown-900 px-6 py-3 text-sm font-bold text-cream hover:bg-brown-800"
          >
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
      <CartModal />
    </div>
  );
}
