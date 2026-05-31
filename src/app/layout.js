import { Cormorant_Garamond, Questrial, Urbanist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ShopProvider } from "@/context/ShopContext";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const questrial = Questrial({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400"],
});

const urbanist = Urbanist({
  variable: "--font-product",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Tiny Crystals | Luxury Handmade Beaded Jewelry",
  description: "Exquisite hand-beaded necklaces, bracelets, earrings, rings, and custom monogram pieces crafted by Ganga. Experience the premium touch of slow fashion beadwork.",
  keywords: "beaded jewelry, hand-beaded necklaces, custom beaded rings, handmade bracelets, luxury pearls, Tiny Crystals, artisan beaded work",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${questrial.variable} ${urbanist.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <ShopProvider>
            {children}
          </ShopProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
