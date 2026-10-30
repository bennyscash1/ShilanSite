import type { Metadata } from "next";
import { BusinessFxView } from "@/components/services/service-views";

export const metadata: Metadata = {
  title: "המרת מט״ח ליבואנים וליצואנים",
  description:
    "שירותי המרת מט״ח לעסקים הפועלים מול השוק הבינלאומי, לצד ליווי אישי, שירות מקצועי ומחירים תחרותיים.",
};

export default function BusinessFxPage() {
  return <BusinessFxView />;
}
