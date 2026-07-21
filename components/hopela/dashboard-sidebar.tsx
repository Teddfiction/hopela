"use client";

import { useTransition } from "react";
import {
  LanguageSquareIcon,
  LeftToRightListBulletIcon,
  Logout01Icon,
  PlusSignIcon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useLocale, useTranslations } from "next-intl";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
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
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { signOut } from "@/lib/core/auth/actions";
import { Link, usePathname, useRouter } from "@/lib/i18n/navigation";
import { routing, type Locale } from "@/lib/i18n/routing";

interface DashboardSidebarProps {
  email: string;
}

export function DashboardSidebar({ email }: DashboardSidebarProps) {
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
              render={<Link href="/dashboard" />}
              tooltip={tNav("brand")}
              onClick={closeMobile}
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
                <span aria-hidden>🎁</span>
              </div>
              <span className="cn-font-heading text-base font-semibold tracking-tight">
                {tNav("brand")}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href="/dashboard/new" />}
                  tooltip={t("newList")}
                  onClick={closeMobile}
                >
                  <HugeiconsIcon icon={PlusSignIcon} />
                  <span>{t("newList")}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href="/dashboard" />}
                  isActive={pathname === "/dashboard"}
                  tooltip={t("title")}
                  onClick={closeMobile}
                >
                  <HugeiconsIcon icon={LeftToRightListBulletIcon} />
                  <span>{t("title")}</span>
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
          <DropdownMenuTrigger
            render={<SidebarMenuButton size="lg" aria-label={t("account")} />}
          >
            <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-xl bg-sidebar-accent text-sidebar-accent-foreground">
              <HugeiconsIcon icon={UserCircleIcon} className="size-5" />
            </div>
            <span className="truncate text-xs text-sidebar-foreground/70">
              {email}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side={isMobile ? "top" : "right"}
            align="end"
            className="w-(--anchor-width) min-w-56"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="truncate">{email}</DropdownMenuLabel>
            </DropdownMenuGroup>
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
              onClick={() => startTransition(() => signOut())}
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
