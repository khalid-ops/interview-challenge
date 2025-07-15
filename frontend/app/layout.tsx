import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Toaster } from "@/components/ui/sonner"


const pages: { title: string; href: string; }[] = [
  {
    title: "Patients",
    href: "/",
  },
  {
    title: "Medications",
    href: "/medications",
  },
  {
    title: "Assignments",
    href: "/assignments",
  },

]

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}
      >
      <header className="p-4 bg-primary">
        <div className="container flex items-center justify-between">
          <span className="text-xl font-bold text-white">Digital Health Tracker</span>
          <NavigationMenu viewport={false}>
          <NavigationMenuList>
            {pages.map((page) => (
                  <NavigationMenuItem key={page.title}>
                    <NavigationMenuLink asChild>
                        <Link href={page.href} className="text-white font-bold">{page.title}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        </div>
        </header>
          <main>{children}</main>
          <Toaster />
        <footer></footer>
      </body>
    </html>
  );
}
