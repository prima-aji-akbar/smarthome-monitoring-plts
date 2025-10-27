import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/styles/globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/custom/app-sidebar/app-sidebar"
import { ThemeProvider } from "@/components/themes/theme-provider"
import DynamicNavbar from "@/components/custom/navbar/dynamic-navbar"
import { Separator } from "@/components/ui/separator";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ATS Monitoring System",
  description: "Smart Home",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <AppSidebar />
            <main className="w-full min-h-screen flex flex-col">
              <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
                <div className="flex items-center gap-2 px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                  <SidebarTrigger className="shrink-0" />
                  <Separator orientation="vertical" className="h-6 mx-2 hidden sm:block" />
                  <DynamicNavbar />
                </div>
              </div>
              <div className="flex-1 w-full overflow-x-hidden">
                {children}
              </div>
            </main>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}