import { AccountMenu } from "./account-link";

/** Dark-green strip above the header (desktop only; on mobile the account section lives in the menu). */
export function TopBar() {
  return (
    <div className="hidden h-[50px] bg-green-900 text-white lg:block">
      <nav className="flex h-full items-center justify-end gap-4 pe-[82px] text-body">
        <AccountMenu />
      </nav>
    </div>
  );
}
