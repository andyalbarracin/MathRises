import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/nav/app-shell";
import { SWRegister } from "@/components/pwa/sw-register";

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "RiseMath — Entrenamiento para el ingreso a Ingeniería UNLaM",
  description:
    "Sistema de entrenamiento matemático gamificado para el ingreso a Ingeniería de la UNLaM.",
  manifest: "/manifest.webmanifest",
  applicationName: "RiseMath",
  appleWebApp: { capable: true, title: "RiseMath", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#0b1017",
  width: "device-width",
  initialScale: 1,
};

// Evita FOUC de tema: aplica el tema guardado (o dark por defecto) antes de pintar.
const themeInit = `
(function(){try{
  var t = localStorage.getItem('rm-theme') || 'dark';
  document.documentElement.classList.toggle('dark', t === 'dark');
}catch(e){document.documentElement.classList.add('dark');}})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-AR"
      suppressHydrationWarning
      className={`${instrument.variable} ${fraunces.variable} h-full`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="min-h-full">
        <AppShell>{children}</AppShell>
        <SWRegister />
      </body>
    </html>
  );
}
