import { setRequestLocale } from "next-intl/server";
import { TrainerSidebar } from "@/components/trainer/trainer-sidebar";
import { TrainerTopbar } from "@/components/trainer/trainer-topbar";

export default async function TrainerLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex min-h-screen bg-muted/30">
      <TrainerSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <TrainerTopbar />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
