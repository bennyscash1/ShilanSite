"use client";

import { ChevronDownIcon, LogOutIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@shilan/ui/components/dropdown-menu";
import { useEffect, useState, useSyncExternalStore, useTransition, type ComponentProps } from "react";
import { logoutAction } from "@/app/(site)/(auth)/actions";
import { authConfig } from "@/config/auth";
import { authStrings as t } from "@/content/auth";

type Me = { displayName: string; email: string; username: string | null };

const noopSubscribe = () => () => {};
const COOKIE_RE = new RegExp(`(?:^|; )${authConfig.displayCookie}=([^;]*)`);

/** The display-name hint cookie. UI only: access control always verifies the httpOnly session. */
function readSignedInHint(): boolean {
  return COOKIE_RE.test(document.cookie);
}

function clearHint() {
  document.cookie = `${authConfig.displayCookie}=; Max-Age=0; path=/`;
}

/** Signed-in state, re-checked after every navigation (login/logout change the cookie). */
function useSignedIn(): boolean {
  // Server render (and first paint) is signed-out; the client corrects it after hydration.
  return useSyncExternalStore(noopSubscribe, readSignedInHint, () => false);
}

/** Name/email from the server, loaded when the menu opens. */
function useMe() {
  const [me, setMe] = useState<Me | null>(null);
  const [failed, setFailed] = useState(false);
  const load = async () => {
    if (me) return;
    const res = await fetch("/api/auth/me", { cache: "no-store" }).catch(() => null);
    if (res?.ok) setMe((await res.json()) as Me);
    else {
      // Session expired but the hint cookie remained: fall back to the login link.
      if (res?.status === 401) clearHint();
      setFailed(true);
    }
  };
  return { me, failed, load };
}

/** Forwards all props (role, ref, key handlers) so it can be a Radix menu item via `asChild`. */
function LogoutButton({ onDone, onClick, ...props }: ComponentProps<"button"> & { onDone?: () => void }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      {...props}
      onClick={(e) => {
        onClick?.(e);
        start(async () => {
          clearHint();
          onDone?.();
          await logoutAction();
        });
      }}
    >
      <LogOutIcon className="size-4" aria-hidden />
      {t.logout}
    </button>
  );
}

function DesktopMenu() {
  const { me, failed, load } = useMe();
  if (failed) {
    return (
      <Link href="/login" className="hover:underline">
        {t.loginTitle}
      </Link>
    );
  }
  return (
    <DropdownMenu onOpenChange={(open: boolean) => open && void load()}>
      <DropdownMenuTrigger className="flex cursor-pointer items-center gap-1.5 rounded-control px-2 py-1 hover:bg-white/10 data-[state=open]:bg-white/10">
        <UserIcon className="size-5" aria-hidden />
        {t.myArea}
        <ChevronDownIcon className="size-4" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-64">
        <div className="px-3 pt-2 pb-3">
          {me ? (
            <>
              <p className="text-body font-bold">{me.displayName || me.username}</p>
              <p className="mt-0.5 text-end text-caption opacity-75" dir="ltr">
                {me.email}
              </p>
            </>
          ) : (
            <p className="text-caption opacity-60">…</p>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account">
            <UserIcon className="size-4" aria-hidden />
            {t.myArea}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          className="text-red-700 data-highlighted:bg-red-50"
          // Keep the menu's default close from cancelling the logout transition.
          onSelect={(e: Event) => e.preventDefault()}
        >
          <LogoutButton className="disabled:opacity-60" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Top bar (desktop): "כניסת לקוחות", or the account menu when signed in. */
export function AccountMenu() {
  const pathname = usePathname();
  return <AccountMenuInner key={pathname} />;
}

function AccountMenuInner() {
  const signedIn = useSignedIn();
  return signedIn ? (
    <DesktopMenu />
  ) : (
    <Link href="/login" className="hover:underline">
      {t.loginTitle}
    </Link>
  );
}

/** Mobile menu section: login link, or name/email + personal area + logout. */
export function MobileAccount({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return <MobileAccountInner key={pathname} onNavigate={onNavigate} />;
}

function MobileAccountInner({ onNavigate }: { onNavigate?: () => void }) {
  const signedIn = useSignedIn();
  const { me, failed, load } = useMe();
  useEffect(() => {
    if (signedIn) void load();
    // Load once per mount (the parent remounts on navigation).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signedIn]);

  if (!signedIn || failed) {
    return (
      <Link href="/login" onClick={onNavigate} className="flex min-h-11 items-center px-2 text-body">
        {t.loginTitle}
      </Link>
    );
  }
  return (
    <div className="flex flex-col">
      <div className="px-2 pt-1 pb-2">
        <p className="text-body font-bold">{me?.displayName || me?.username || t.myArea}</p>
        {me?.email && (
          <p className="text-end text-caption opacity-80" dir="ltr">
            {me.email}
          </p>
        )}
      </div>
      <Link href="/account" onClick={onNavigate} className="flex min-h-11 items-center gap-2 border-t border-white/20 px-2 text-body">
        <UserIcon className="size-4" aria-hidden />
        {t.myArea}
      </Link>
      <LogoutButton
        onDone={onNavigate}
        className="flex min-h-11 w-full cursor-pointer items-center gap-2 border-t border-white/20 px-2 text-body disabled:opacity-60"
      />
    </div>
  );
}
