import { Button } from "@shilan/ui/components/button";
import { GlassCard } from "@shilan/ui/components/card";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { contact } from "@/content/site";

export function PhotoHero({
  image,
  imageAlt,
  children,
}: {
  image: string;
  imageAlt: string;
  children: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-green-950 text-white">
      <Image src={image} alt={imageAlt} fill priority className="object-cover" sizes="100vw" />
      <div aria-hidden className="absolute inset-0 bg-green-950/60" />
      <div className="section-screen relative container-content">{children}</div>
    </section>
  );
}

export function FeatureRow({
  items,
}: {
  items: { icon: string; title: string; text: string }[];
}) {
  return (
    <ul className="mt-10 grid gap-8 sm:grid-cols-3 md:mt-14">
      {items.map((item) => (
        <li key={item.title} className="flex flex-col items-center text-center">
          <Image src={item.icon} alt="" width={48} height={48} unoptimized className="size-12" />
          <p className="mt-4 text-title font-bold">{item.title}</p>
          <p className="text-body">{item.text}</p>
        </li>
      ))}
    </ul>
  );
}

export function CallVip() {
  return (
    <section className="section-screen bg-white">
      <div className="container-content">
        <div className="mx-auto max-w-3xl rounded-card border border-gold-500 bg-green-900 px-6 py-10 text-center text-white md:px-12 md:py-14">
          <Image src="/services/business/vip.svg" alt="" width={88} height={104} unoptimized className="mx-auto mb-6 h-auto w-20" />
          <h2 className="text-h3 font-bold">חדר עסקאות ליבואנים וליצואנים</h2>
          <p className="mt-2 text-title text-gold-300">שירות עסקי עם יחס אישי</p>
          <p className="mt-4 text-body leading-relaxed">
            ליבואנים וליצואנים הזקוקים לשירותי המרת מט״ח עומד לרשותכם חדר עסקאות VIP של שילן. כאן
            תוכלו לקבל מענה אישי לצורכי ההמרה של העסק ולברר את תנאי העסקה, לצד מחירים תחרותיים
            ושירות מקצועי.
          </p>
          <p className="mt-3 text-body leading-relaxed">
            צרו קשר עם חדר עסקאות VIP לבירור אפשרויות ההמרה המתאימות לפעילות העסקית שלכם.
          </p>
          <Button asChild className="mt-8">
            <a href={`tel:${contact.phone}`}>חייגו עכשיו</a>
          </Button>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-2 text-body text-gold-300">
            <li>מחירים תחרותיים</li>
            <li>ליווי אישי</li>
            <li>שירות מקצועי</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export function AudienceCards({
  title,
  cards,
}: {
  title: string;
  cards: { title: string; text: string }[];
}) {
  return (
    <div>
      <h2 className="text-center text-h2 font-bold text-white">{title}</h2>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <li key={card.title}>
            <GlassCard className="h-full px-5 py-6 text-center">
              <h3 className="text-title font-bold text-gold-300">{card.title}</h3>
              <p className="mt-2 text-body leading-relaxed">{card.text}</p>
            </GlassCard>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TextLink({ href, children }: { href: string; children: string }) {
  return (
    <Link href={href} className="text-gold-300 underline underline-offset-4">
      {children}
    </Link>
  );
}
