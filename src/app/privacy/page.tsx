import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartModal from "@/components/CartModal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Mellow Day PH collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-cream text-brown-900">
      <Header />
      <main className="flex-1 px-6 py-28 md:py-32">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white/70 p-8 shadow-sm sm:p-10">
          <h1 className="font-heading text-3xl font-bold text-brown-900">Privacy Policy</h1>
          <p className="mt-2 text-sm text-brown-900/60">Last updated: {new Date().getFullYear()}</p>

          <div className="mt-8 flex flex-col gap-6 text-sm leading-relaxed text-brown-900/85">
            <p>
              Mellow Day PH (&quot;we,&quot; &quot;us&quot;) respects your privacy. This page
              explains what information we collect when you use this site, why we collect it,
              and who we share it with, in line with the Philippines&apos; Data Privacy Act of
              2012.
            </p>

            <section>
              <h2 className="font-heading text-lg font-bold text-brown-900">
                Information we collect
              </h2>
              <ul className="mt-2 list-disc space-y-1.5 pl-5">
                <li>
                  <strong>Account details:</strong> your name, email address, mobile number, and
                  a default delivery address, when you sign up or update your profile.
                </li>
                <li>
                  <strong>Order details:</strong> what you ordered, your delivery address (for
                  delivery orders), and any special instructions you leave, each time you check
                  out.
                </li>
                <li>
                  <strong>Payment information:</strong> if you pay with GCash, your payment is
                  processed directly by PayMongo — we never see or store your GCash credentials
                  or card details ourselves.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-lg font-bold text-brown-900">
                Why we collect it
              </h2>
              <p className="mt-2">
                To create and fulfill your orders, contact you about them (e.g. for delivery),
                keep your order history available across devices, and pre-fill your details at
                checkout so you don&apos;t have to retype them every time.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-lg font-bold text-brown-900">
                Who we share it with
              </h2>
              <p className="mt-2">We use a small number of service providers to run this site:</p>
              <ul className="mt-2 list-disc space-y-1.5 pl-5">
                <li>
                  <strong>Supabase</strong> — hosts our database and handles account sign-in.
                </li>
                <li>
                  <strong>PayMongo</strong> — processes GCash payments.
                </li>
              </ul>
              <p className="mt-2">
                We don&apos;t sell your personal information to anyone, and we don&apos;t share
                it with third parties for their own marketing.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-lg font-bold text-brown-900">
                How long we keep it
              </h2>
              <p className="mt-2">
                We keep your account and order history for as long as your account exists, so
                you can look back at past orders. You can ask us to delete your account and
                associated data at any time (see contact details below).
              </p>
            </section>

            <section>
              <h2 className="font-heading text-lg font-bold text-brown-900">Your rights</h2>
              <p className="mt-2">
                Under the Data Privacy Act, you can ask to access, correct, or delete your
                personal information, or ask us questions about how it&apos;s used. Reach out to
                us using the contact details in the footer of this site and we&apos;ll get back
                to you.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-lg font-bold text-brown-900">Cookies</h2>
              <p className="mt-2">
                We use your browser&apos;s local storage to remember your shopping bag and, if
                you&apos;re signed in, a session so you don&apos;t have to log in again on every
                visit. We don&apos;t use tracking or advertising cookies.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-lg font-bold text-brown-900">Changes</h2>
              <p className="mt-2">
                If this policy changes in a meaningful way, we&apos;ll update this page and
                change the date at the top.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
      <CartModal />
    </div>
  );
}
