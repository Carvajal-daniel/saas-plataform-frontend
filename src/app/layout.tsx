import type { Metadata } from 'next'
import './globals.css'
import { Geist, Inter_Tight } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: 'Next.js',
  description: 'App',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="es"
      className={cn(
        geist.variable,
        interTight.variable
      )}
    >
      <body className="font-sans">
        {children}
      </body>
    </html>
  )
}