import type { Metadata } from "next";
import { Nunito, Paytone_One, Radio_Canada_Big } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Mellow Day PH",
  description:
    "Handcrafted milk tea, coffee, and specialty drinks made slow, made fresh — a mellow day, every day.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
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
        {children}
      </body>
    </html>
  );
}
