import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Ko‘zNuri AI — Ko‘rish yordamchisi",
  description: "O‘zbek tilidagi sun’iy intellekt yordamida ko‘rish assistenti."
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="uz"><body>{children}</body></html>;
}
