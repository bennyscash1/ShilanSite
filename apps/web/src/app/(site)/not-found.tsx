import { NotFoundView, notFoundMetadata } from "@/components/not-found-view";

export const metadata = notFoundMetadata;

export default function SiteNotFound() {
  return <NotFoundView />;
}
