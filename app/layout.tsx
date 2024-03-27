import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { AppStateProvider } from '@/app/utils/AppStateProvider';
import NavBar from "./components/NavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

type Props = {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: Readonly<Props>) {
  return (
    <html lang="en">
      <AppStateProvider>
        <body className={`
          ${inter.className}
          relative w-screen h-screen
        `}>
          <main className="h-[calc(100vh-3.5rem)] px-4 pt-4 pb-6">
            { children }
          </main>

          <NavBar />
        </body>
      </AppStateProvider>
    </html>
  );
}
