import type { Metadata } from "next";
import { Nunito, Paytone_One, Radio_Canada_Big } from "next/font/google";
import CartToast from "@/components/CartToast";
import { AuthProvider } from "@/lib/AuthContext";
import { CartProvider } from "@/lib/CartContext";
import "./globals.css";

const paytoneOne = Paytone_One({
  variable: "--font-heading",
  weight: "400",
  subsets: ["latin"],
});

const radioCanadaBig = Radio_Canada_Big({
  variable: "--font-subheading",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
});

const SITE_URL = "https://mellowdayph.vercel.app";
const DESCRIPTION =
  "Handcrafted milk tea, coffee, and specialty drinks made slow, made fresh — a mellow day, every day.";

export const metadata: Metadata = {
  // Resolves relative URLs below (and any page's own metadata) to absolute
  // ones — required for Open Graph/Twitter tags to work correctly, and
  // generally good practice for how the site gets represented in search
  // results and link previews.
  metadataBase: new URL(SITE_URL),
  title: "Mellow Day PH",
  description: DESCRIPTION,
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Mellow Day PH",
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Mellow Day PH",
    images: ["/hero-bg.jpg"],
    locale: "en_PH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mellow Day PH",
    description: DESCRIPTION,
    images: ["/hero-bg.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${paytoneOne.variable} ${radioCanadaBig.variable} ${nunito.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-body">
        <script
          // Flips on scroll-reveal animations only once JS has actually run,
          // so content never depends on the observer firing to be visible.
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        <AuthProvider>
          <CartProvider>
            {children}
            <CartToast />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
