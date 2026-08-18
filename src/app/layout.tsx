import type { Metadata, Viewport } from "next";
import { Roboto_Flex, Fredoka } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/nav/app-shell";
import { SWRegister } from "@/components/pwa/sw-register";

const roboto = Roboto_Flex({
  variable: "--font-roboto",
  subsets: ["latin"],
  display: "swap",
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
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
  themeColor: "#6c5ce7",
  width: "device-width",
  initialScale: 1,
};

// Evita FOUC de tema: aplica el tema guardado (light por defecto) antes de pintar.
const themeInit = `
(function(){try{
  var t = localStorage.getItem('rm-theme') || 'light';
  document.documentElement.classList.toggle('dark', t === 'dark');
}catch(e){}})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-AR"
      suppressHydrationWarning
      className={`${roboto.variable} ${fredoka.variable} h-full`}
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
