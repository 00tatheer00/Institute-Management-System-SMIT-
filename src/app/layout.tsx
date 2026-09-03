import "./globals.css";

// Root layout — minimal wrapper for the [locale] segment
// The actual layout logic (fonts, direction, providers) is in [locale]/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
