import { getTranslations } from "next-intl/server";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  DashboardSidebar,
  type SidebarListItem,
} from "@/components/hopela/dashboard-sidebar";
import { getMyLists } from "@/lib/core/lists/queries";
import { Link, redirect } from "@/lib/i18n/navigation";
import { createClient } from "@/lib/db/server";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("nav");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect({ href: "/login", locale });
  }

  const lists = await getMyLists();
  const sidebarLists: SidebarListItem[] = lists.map((list) => ({
    id: list.id,
    title: list.title,
    emoji: list.emoji,
    giftCount: list.gift[0]?.count ?? 0,
  }));

  return (
    <TooltipProvider>
      <SidebarProvider>
        <DashboardSidebar email={user!.email ?? ""} lists={sidebarLists} />
        <SidebarInset>
          <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-sm md:hidden">
            <SidebarTrigger />
            <Link
              href="/dashboard"
              className="cn-font-heading text-lg font-semibold tracking-tight"
            >
              {t("brand")}
            </Link>
          </header>
          <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
