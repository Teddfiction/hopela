"use client";

import { useTransition } from "react";
import {
  LanguageSquareIcon,
  Logout01Icon,
  PlusSignIcon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useLocale, useTranslations } from "next-intl";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { signOut } from "@/lib/core/auth/actions";
import { Link, usePathname, useRouter } from "@/lib/i18n/navigation";
import { routing, type Locale } from "@/lib/i18n/routing";

export interface SidebarListItem {
  id: string;
  title: string;
  emoji: string | null;
  giftCount: number;
}

interface DashboardSidebarProps {
  email: string;
  lists: SidebarListItem[];
}

export function DashboardSidebar({ email, lists }: DashboardSidebarProps) {
  const t = useTranslations("dashboard");
  const tNav = useTranslations("nav");
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const closeMobile = () => setOpenMobile(false);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              tooltip={tNav("brand")}
              onClick={closeMobile}
            >
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
                  <span aria-hidden>🎁</span>
                </div>
                <span className="cn-font-heading text-base font-semibold tracking-tight">
                  {tNav("brand")}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("title")}</SidebarGroupLabel>
          <SidebarGroupAction asChild title={t("newList")}>
            <Link href="/dashboard/new" onClick={closeMobile}>
              <HugeiconsIcon icon={PlusSignIcon} />
              <span className="sr-only">{t("newList")}</span>
            </Link>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {lists.map((list) => {
                const href = `/dashboard/lists/${list.id}`;

                return (
                  <SidebarMenuItem key={list.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === href}
                      tooltip={list.title}
                      onClick={closeMobile}
                    >
                      <Link href={href}>
                        <span aria-hidden>{list.emoji ?? "🎁"}</span>
                        <span className="truncate">{list.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    <SidebarMenuBadge>{list.giftCount}</SidebarMenuBadge>
                  </SidebarMenuItem>
                );
              })}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={t("newList")}
                  onClick={closeMobile}
                  className="text-sidebar-foreground/70"
                >
                  <Link href="/dashboard/new">
                    <HugeiconsIcon icon={PlusSignIcon} />
                    <span>{t("newList")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <UserDropdown email={email} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function UserDropdown({ email }: { email: string }) {
  const t = useTranslations("dashboard");
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { isMobile } = useSidebar();
  const [, startTransition] = useTransition();

  function onLocaleChange(next: string) {
    startTransition(() => {
      router.replace(pathname, { locale: next as Locale });
    });
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" aria-label={t("account")}>
              <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-xl bg-sidebar-accent text-sidebar-accent-foreground">
                <HugeiconsIcon icon={UserCircleIcon} className="size-5" />
              </div>
              <span className="truncate text-xs text-sidebar-foreground/70">
                {email}
              </span>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side={isMobile ? "top" : "right"}
            align="end"
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
          >
            <DropdownMenuLabel className="truncate">{email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <HugeiconsIcon icon={LanguageSquareIcon} />
                {locale.toUpperCase()}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={locale}
                  onValueChange={onLocaleChange}
                >
                  {routing.locales.map((l) => (
                    <DropdownMenuRadioItem key={l} value={l}>
                      {l.toUpperCase()}
                      <span className="sr-only">{tNav(`locales.${l}`)}</span>
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => startTransition(() => signOut())}
            >
              <HugeiconsIcon icon={Logout01Icon} />
              {t("signOut")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
