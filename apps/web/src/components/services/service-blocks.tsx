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
        </div>
        <ul className="mx-auto mt-12 grid max-w-5xl gap-10 text-center text-green-900 sm:grid-cols-3">
          {vipMarks.map((mark) => (
            <li key={mark.label}>
              <VipMark pieces={mark.pieces} />
              <p className="mt-4 text-title font-bold">{mark.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

type MarkPiece = { src: string; t: number; r: number; b: number; l: number };

const vipMarks: { label: string; pieces: MarkPiece[] }[] = [
  {
    label: "מחירים תחרותיים",
    pieces: [
      { src: "/services/business/icons/price-a.svg", t: 75.41, r: 22.9, b: 23.98, l: 72.72 },
      { src: "/services/business/icons/price-b.svg", t: 75.04, r: 22.97, b: 24.65, l: 73.07 },
      { src: "/services/business/icons/price-c.svg", t: 74.66, r: 23.3, b: 24.64, l: 72.29 },
    ],
  },
  {
    label: "ליווי אישי",
    pieces: [
      { src: "/services/business/icons/care-a.svg", t: 75, r: 49.91, b: 24.31, l: 48.19 },
      { src: "/services/business/icons/care-b.svg", t: 74.99, r: 45.91, b: 24.32, l: 52.19 },
      { src: "/services/business/icons/care-c.svg", t: 75.18, r: 47.09, b: 23.9, l: 49.44 },
    ],
  },
  {
    label: "שירות מקצועי",
    pieces: [
      { src: "/services/business/icons/pro-4.svg", t: 74.81, r: 67.79, b: 24.37, l: 29.63 },
      { src: "/services/business/icons/pro-5.svg", t: 74.95, r: 69.26, b: 24.14, l: 26.53 },
      { src: "/services/business/icons/pro-6.svg", t: 75.44, r: 71.32, b: 24.25, l: 27.67 },
      { src: "/services/business/icons/pro-7.svg", t: 75.67, r: 71.26, b: 24.3, l: 28.7 },
      { src: "/services/business/icons/pro-8.svg", t: 75.53, r: 70.34, b: 24.29, l: 28.87 },
      { src: "/services/business/icons/pro-9.svg", t: 75.07, r: 70.01, b: 24.83, l: 27.91 },
      { src: "/services/business/icons/pro-10.svg", t: 75.23, r: 70.55, b: 24.72, l: 27.91 },
    ],
  },
];

function VipMark({ pieces }: { pieces: MarkPiece[] }) {
  const left = Math.min(...pieces.map((piece) => piece.l));
  const right = Math.max(...pieces.map((piece) => 100 - piece.r));
  const top = Math.min(...pieces.map((piece) => piece.t));
  const bottom = Math.max(...pieces.map((piece) => 100 - piece.b));
  const width = right - left;
  const height = bottom - top;
  return (
    <div className="relative mx-auto h-16 w-16" aria-hidden>
      {pieces.map((piece) => (
        <Image
          key={piece.src}
          src={piece.src}
          alt=""
          width={64}
          height={64}
          unoptimized
          className="absolute max-w-none"
          style={{
            left: `${((piece.l - left) / width) * 100}%`,
            top: `${((piece.t - top) / height) * 100}%`,
            width: `${((100 - piece.r - piece.l) / width) * 100}%`,
            height: `${((100 - piece.b - piece.t) / height) * 100}%`,
          }}
        />
      ))}
    </div>
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
