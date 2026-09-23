import type { Metadata } from "next";
import { Nunito, Paytone_One, Radio_Canada_Big } from "next/font/google";
import CartToast from "@/components/CartToast";
import { AuthProvider } from "@/lib/AuthContext";
import { CartProvider } from "@/lib/CartContext";
import { MenuDataProvider } from "@/lib/MenuDataContext";
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
// Optimized for the two target keywords: the brand name itself, and
// "milk tea delivery Taguig" — both worked in naturally (title, meta
// description, OG/Twitter tags, and the LocalBusiness structured data
// below), never stuffed.
const TITLE = "Mellow Day PH – Milk Tea Delivery in Taguig City";
const DESCRIPTION =
  "Order milk tea, coffee, and specialty drinks for delivery or pickup in Taguig City. Mellow Day PH — handcrafted, made fresh, made to order.";

// LocalBusiness structured data — how Google actually understands what
// this business is, where it is, and that it delivers, independent of the
// page's visible copy. This is the single highest-leverage on-page change
// for local + delivery search intent; nothing else here moves the needle
// as much without also setting up a Google Business Profile (a separate,
// account-based step outside what code alone can do).
const LOCAL_BUSINESS_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "CafeOrCoffeeShop",
  name: "Mellow Day PH",
  image: `${SITE_URL}/hero-bg.jpg`,
  url: SITE_URL,
  telephone: "+639763933039",
  priceRange: "₱₱",
  servesCuisine: ["Milk Tea", "Coffee", "Specialty Drinks"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Corner Saint Mary, Central Signal Village",
    addressLocality: "Taguig City",
    addressRegion: "Metro Manila",
    addressCountry: "PH",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "08:00",
    closes: "00:00",
  },
  areaServed: {
    "@type": "City",
    name: "Taguig City",
  },
  hasDeliveryMethod: "https://schema.org/DeliveryModeMixed",
  sameAs: [
    "https://www.facebook.com/profile.php?id=61587137513893",
    "https://www.instagram.com/mellowday.ph/",
  ],
};

export const metadata: Metadata = {
  // Resolves relative URLs below (and any page's own metadata) to absolute
  // ones — required for Open Graph/Twitter tags to work correctly, and
  // generally good practice for how the site gets represented in search
  // results and link previews.
  metadataBase: new URL(SITE_URL),
  // Individual pages can set just their own short `title` and get
  // " | Mellow Day PH" appended automatically, so each page can show a
  // distinct, descriptive title in search results instead of every page
  // showing the same generic one.
  title: {
    default: TITLE,
    template: "%s | Mellow Day PH",
  },
  description: DESCRIPTION,
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Mellow Day PH",
    images: ["/hero-bg.jpg"],
    locale: "en_PH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/hero-bg.jpg"],
  },
  verification: {
    google: "vLfK2_wL-Rj3HLyKjSmEkkE8oNsfGFONwHePjwD4Hx4",
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
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_JSON_LD) }}
        />
        <script
          // Flips on scroll-reveal animations only once JS has actually run,
          // so content never depends on the observer firing to be visible.
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        <AuthProvider>
          <MenuDataProvider>
            <CartProvider>
              {children}
              <CartToast />
            </CartProvider>
          </MenuDataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
