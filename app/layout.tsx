import type { Metadata, Viewport } from "next";
import { Caveat, Fredoka, Luckiest_Guy, Special_Elite } from "next/font/google";
import { MotionProvider } from "@/components/motion-provider";
import "./globals.css";

const luckiest = Luckiest_Guy({ weight: "400", subsets: ["latin"], variable: "--font-luckiest" });
const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka" });
const specialElite = Special_Elite({ weight: "400", subsets: ["latin"], variable: "--font-special-elite", preload: false });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat", preload: false });

export const metadata: Metadata = {
  // Absolute base for the share image. Vercel fills this in automatically; elsewhere set NEXT_PUBLIC_SITE_URL.
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined,
  title: "Kerlos Amir — Flutter & Web Developer",
  description:
    "Portfolio of Kerlos Amir Girgis, a Flutter & web developer from Cairo building polished mobile apps and websites with Clean Architecture and BLoC.",
  authors: [{ name: "Kerlos Amir Girgis" }],
  keywords: ["Kerlos Amir Girgis", "Flutter developer", "Mobile app developer", "Web developer", "Cairo", "Portfolio"],
  openGraph: {
    title: "Kerlos Amir — Flutter & Web Developer",
    description: "Mobile apps and websites, built with a whole summer's worth of imagination.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#36b9f1",
};

// Runs before first paint: show the intro title card once per session,
// and never for people who prefer reduced motion.
const introScript = `(function(){var d=document.documentElement;try{if(sessionStorage.getItem("intro-seen")||matchMedia("(prefers-reduced-motion: reduce)").matches){d.setAttribute("data-intro","off")}else{sessionStorage.setItem("intro-seen","1")}}catch(e){d.setAttribute("data-intro","off")}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${luckiest.variable} ${fredoka.variable} ${specialElite.variable} ${caveat.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="btn-toon btn-toon--sun fixed left-4 top-4 z-[90] -translate-y-24 focus:translate-y-0"
        >
          Skip to content
        </a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
