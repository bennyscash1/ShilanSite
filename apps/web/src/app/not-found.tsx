import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { NotFoundView, notFoundMetadata } from "@/components/not-found-view";

export const metadata = notFoundMetadata;

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <NotFoundView />
      <SiteFooter />
      <WhatsAppButton />
    </>
  );
}
