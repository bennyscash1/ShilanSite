/**
 * Site-wide content: navigation, contact details, branches, footer.
 * All copy is taken verbatim from FigmaPages/FigmaShilan.pdf.
 */

export type NavLink = { label: string; href: string };

// RTL order as in the design: "הקמת לקוח | כניסת לקוחות".
export const topBarLinks: NavLink[] = [
  { label: "הקמת לקוח", href: "/signup" },
  { label: "כניסת לקוחות", href: "/login" },
];

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
} as const;

export type Branch = { name: string; lines: string[] };

export const branches: Branch[] = [
  { name: "סניף רמת בית שמש א'", lines: ["רחוב נחל ניצנים 16", 'מרכז מסחרי רמב"ש א\''] },
  { name: "סניף קניון נעימי בית שמש", lines: ["רחוב יצחק רבין 2", "קניון נעימי בית שמש"] },
  { name: "סניף ירושלים", lines: ["רחוב מלכי ישראל 32", "מרכז מסחרי הקארדו", "מתחם שנלר"] },
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
    { label: "הקמת לקוח", href: "/signup" },
    { label: "כניסת לקוחות", href: "/login" },
  ] satisfies NavLink[],
  contactTitle: "יצירת קשר",
  phoneLabel: "טל.",
  faxLabel: "פקס.",
  emailLabel: 'דוא"ל.',
  branchesTitle: "הסניפים שלנו",
  legal: [
    { label: "מדיניות פרטיות", href: "/privacy" },
    { label: "הצהרת נגישות", href: "/accessibility" },
  ] satisfies NavLink[],
};
