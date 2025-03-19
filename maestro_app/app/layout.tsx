import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/lib/auth-provider";
import { ThemeProvider } from "@/lib/theme-provider";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: "Maestro AI",
  description: "统一界面连接多种AI模型，简化日常AI交互",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="zh-CN" suppressHydrationWarning>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#38BDF8" />
        </head>
        <body className={cn(
          inter.variable,
          jetbrainsMono.variable,
          "font-sans antialiased",
          "bg-background text-foreground",
          "transition-colors duration-300"
        )}>
          <ThemeProvider
            defaultTheme="system"
            enableSystem
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
