/**
 * Site-wide content: navigation, contact details, branches, footer.
 * All copy is taken verbatim from FigmaPages/FigmaShilan.pdf.
 */

export type NavLink = { label: string; href: string };

// The top bar has a single account link ("כניסת לקוחות" / "האזור האישי"),
// rendered by components/layout/account-link.tsx. Customer onboarding (/signup) is for registered users.

export const mainNav: NavLink[] = [
  { label: "אודותינו", href: "/about" },
  { label: "השירותים שלנו", href: "/#services" },
  { label: "בלוג", href: "/blog" },
  { label: "יצירת קשר", href: "/#contact" },
];

export const headerCta: NavLink = { label: "לקבלת הצעת מחיר", href: "/#contact" };

export const contact = {
  phone: "02-9928881",
  fax: "02-9928883",
  email: "office@shilan.co.il",
  // Click-to-chat button on shilan.co.il (number 972506554660, label "לעוזר הדיגיטלי שלנו").
  whatsapp: {
    label: "לעוזר הדיגיטלי שלנו",
    display: "050-655-4660",
    href: "https://wa.me/972506554660",
  },
} as const;

export type SocialLink = { label: string; href: string };

// Visible on the contact page ("עקבו אחרינו בפייסבוק ובאינסטגרם").
export const socialLinks: SocialLink[] = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/%D7%A9%D7%99%D7%9C%D7%9F-%D7%A9%D7%99%D7%A8%D7%95%D7%AA%D7%99-%D7%94%D7%9E%D7%A8%D7%94-%D7%91%D7%A2%D7%9E-1760350000902018",
  },
  { label: "Instagram", href: "https://www.instagram.com/shilan__100" },
];

export type BranchHours = { label: string; value: string };

export type Branch = {
  name: string;
  lines: string[];
  phone: string;
  extension: string;
  fax: string;
  email: string;
  hours: BranchHours[];
  map: { src: string; title: string };
};

// Addresses stay as in the design. Phones, extensions, fax, email, hours and map
// embeds are copied from https://shilan.co.il/יצירת-קשר/ and the live footer.
export const branches: Branch[] = [
  {
    name: "סניף רמת בית שמש א'",
    lines: ["רחוב נחל ניצנים 16", "מרכז מסחרי רמב\"ש א'"],
    phone: "02-9928881",
    extension: "שלוחה 3",
    fax: "02-9928883",
    email: "office@shilan.co.il",
    hours: [
      { label: "א-ה:", value: "09:00-18:00" },
      { label: "ו' וערבי חג:", value: "09:00-12:00" },
    ],
    map: {
      src: "https://maps.google.com/maps?q=%D7%A0%D7%97%D7%9C%20%D7%A0%D7%99%D7%A6%D7%A0%D7%99%D7%9D%2016%20%D7%91%D7%99%D7%AA%20%D7%A9%D7%9E%D7%A9&t=m&z=16&output=embed&iwloc=near",
      title: "נחל ניצנים 16 בית שמש",
    },
  },
  {
    name: "סניף קניון נעימי בית שמש",
    lines: ["רחוב יצחק רבין 2", "קניון נעימי בית שמש"],
    phone: "02-9928881",
    extension: "שלוחה 4",
    fax: "02-9928883",
    email: "office@shilan.co.il",
    hours: [
      { label: "א-ה:", value: "09:00-18:00" },
      { label: "ו' וערבי חג:", value: "09:00-12:00" },
    ],
    map: {
      src: "https://maps.google.com/maps?q=%D7%9E%D7%95%D7%A8%D7%93%D7%99%20%D7%94%D7%92%D7%98%D7%90%D7%95%D7%AA%202%20%D7%91%D7%99%D7%AA%20%D7%A9%D7%9E%D7%A9&t=m&z=16&output=embed&iwloc=near",
      title: "מורדי הגטאות 2 בית שמש",
    },
  },
  {
    name: "סניף ירושלים",
    lines: ["רחוב מלכי ישראל 32", "מרכז מסחרי הקארדו", "מתחם שנלר"],
    phone: "02-9928881",
    extension: "שלוחה 2",
    fax: "02-9928883",
    email: "office@shilan.co.il",
    hours: [
      { label: "א-ה:", value: "10:00-17:00" },
      { label: "ו' וערבי חג:", value: "09:00-12:00" },
    ],
    map: {
      src: "https://maps.google.com/maps?q=%D7%9E%D7%9C%D7%9B%D7%99%20%D7%99%D7%A9%D7%A8%D7%90%D7%9C%2032%20%D7%99%D7%A8%D7%95%D7%A9%D7%9C%D7%99%D7%9D&t=m&z=16&output=embed&iwloc=near",
      title: "מלכי ישראל 32 ירושלים",
    },
  },
];

export const footer = {
  servicesTitle: "שירותים",
  services: [
    { label: "מט”ח לעסקים", href: "/#business" },
    { label: "המרת מט”ח", href: "/services/fx-exchange" },
    { label: "העברות בינלאומיות", href: "/services/international-transfers" },
    { label: "מט”ח באשראי", href: "/services/fx-credit" },
    // Figma has the typo "כטיס"; corrected here.
    { label: "כרטיס אשראי נטען", href: "/services/prepaid-card" },
    { label: "נכיון שיקים", href: "/services/check-discounting" },
  ] satisfies NavLink[],
  companyTitle: "החברה",
  company: [
    { label: "אודותינו", href: "/about" },
    { label: "בלוג", href: "/blog" },
    { label: "כניסת לקוחות", href: "/login" },
  ] satisfies NavLink[],
  contactTitle: "יצירת קשר",
  phoneLabel: "טל.",
  faxLabel: "פקס.",
  emailLabel: 'דוא"ל.',
  socialTitle: "עקבו אחרינו בפייסבוק ובאינסטגרם",
  branchesTitle: "הסניפים שלנו",
  // Verbatim from the contact page, including the missing space after the comma.
  branchesIntro: 'לקוחות יקרים,מצ"ב פרטי יצירת הקשר ושעות פעילות סניפי שילן:',
  legal: [
    { label: "מדיניות פרטיות", href: "/privacy" },
    { label: "הצהרת נגישות", href: "/accessibility" },
  ] satisfies NavLink[],
};
