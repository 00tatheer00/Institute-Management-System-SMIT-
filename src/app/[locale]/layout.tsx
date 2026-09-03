import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Inter } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth/context";
import { CustomCursor } from "@/components/shared/custom-cursor";
import { ScrollProgress } from "@/components/shared/scroll-progress";
import { BackToTop } from "@/components/shared/back-to-top";
import { SmoothScrollProvider } from "@/components/shared/smooth-scroll-provider";
import { getDirection } from "@/lib/config/site";
import { routing } from "@/i18n/routing";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: {
    default: "Mohsin and Huma IT Center × SMIT",
    template: "%s | MHIT × SMIT",
  },
  description:
    "Free technology education and training institute offering courses in Web Development, App Development, AI, Digital Marketing, Graphic Design, and more.",
  metadataBase: new URL("https://mhit.edu.pk"),
  openGraph: {
    title: "Mohsin and Huma IT Center × SMIT",
    description:
      "Free technology education and training — Web Development, App Development, AI, and more.",
    siteName: "Mohsin and Huma IT Center × SMIT",
    type: "website",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = getDirection(locale);

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <TooltipProvider>
              <SmoothScrollProvider>
                <ScrollProgress />
                <CustomCursor />
                {children}
                <BackToTop />
              </SmoothScrollProvider>
            </TooltipProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
