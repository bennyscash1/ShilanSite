/**
 * Home page content, verbatim from FigmaPages/FigmaShilan.pdf.
 * Shaped like future Firestore documents so the admin panel can take it over.
 * "\n" marks a line break that the design shows on desktop.
 */

export type HeroTab = {
  id: string;
  label: string;
  headline: string;
  subtext: string;
  cta: { label: string; href: string };
};

export const heroTabs: HeroTab[] = [
  {
    id: "importers-exporters",
    label: "יבואנים ויצואנים",
    headline: 'מט"ח ליבואנים וליצואנים,\nבשער תחרותי ובליווי אישי',
    subtext: 'תשלום לספקים בחו"ל, קבלת תקבולים והמרתם,\nעם צוות מקצועי ואמין.',
    cta: { label: "לשירותים לעסקים", href: "/business" },
  },
  {
    id: "companies",
    label: "חברות ותאגידים",
    headline: 'מט"ח לחברות ולתאגידים,\nבשער מועדף ובליווי מנהל תיק',
    subtext: 'המרות ותשלומים בינלאומיים,\nעם מענה אישי שמותאם לארגון.',
    cta: { label: "לשירותים לעסקים", href: "/business" },
  },
  {
    id: "private",
    label: "לקוחות פרטיים",
    headline: 'מט"ח ללקוחות פרטיים,\nבשער משתלם ובליווי אישי',
    subtext: 'המרת מטבע, העברות לחו"ל ורכישה באשראי,\nעם צוות מקצועי ואמין.',
    cta: { label: "לשירותים לפרטיים", href: "/services/fx-exchange" },
  },
];

export const business = {
  title: "מט”ח לעסקים",
  cards: [
    {
      id: "importer",
      title: "אני יבואן",
      text: "תשלומים לספקים בחו”ל והמרת שקלים למטבע הספק",
      link: { label: "לפתרונות ליבואנים", href: "/business#importers" },
    },
    {
      id: "exporter",
      title: "אני יצואן",
      text: "קבלת תשלומים מחו”ל והמרתם במועד שמתאים לכם",
      link: { label: "לפתרונות ליצואנים", href: "/business#exporters" },
    },
  ],
};

export type ServiceSlug =
  | "fx-exchange"
  | "international-transfers"
  | "fx-credit"
  | "prepaid-card"
  | "check-discounting";

export type Service = { slug: ServiceSlug; title: string; summary: string };

export const servicesSection = { title: "השירותים שלנו" };

export const services: Service[] = [
  { slug: "fx-exchange", title: "המרת מט”ח", summary: "לעסקים ופרטיים\nבמגוון מטבעות\nבשערים הטובים בשוק" },
  {
    slug: "international-transfers",
    title: "העברות בינלאומיות",
    summary: "העברת כספים לכל\nמקום בעולם\nבכל סוגי המטבעות",
  },
  { slug: "fx-credit", title: "מט”ח באשראי", summary: "רכישת מטבע בכרטיס\nאשראי, בתשלומים" },
  {
    slug: "prepaid-card",
    title: "כרטיס אשראי נטען",
    summary: 'כרטיסי אשראי נטענים\nבשקלים או מט"ח\nעמלות נמוכות',
  },
  {
    slug: "check-discounting",
    title: "נכיון שיקים",
    summary: "לעסקים שמקבלים\nשיקים דחויים וצריכים\nמימון חוץ בנקאי",
  },
];

export const calculatorSection = {
  title: "מחשבון המרת מט”ח",
  cta: { label: "להמרת מט”ח", href: "/services/fx-exchange" },
  // From the brief (not shown in the Figma frame).
  disclaimer: "שערים להמחשה בלבד",
};

export const whySection = {
  title: "למה לעבוד עם שילן?",
  // Order = reading order in RTL (right column first, row by row).
  cards: [
    { title: "שירות אישי וליווי מקצועי", text: "מענה אנושי בכל פנייה, מהצעת המחיר ועד הביצוע." },
    { title: "שערי המרה תחרותיים", text: "עמלות נמוכות ושערים משתלמים בכל עסקה." },
    { title: "פתרונות מותאמים", text: "מעסקה חד־פעמית ועד ליווי שוטף." },
    { title: "הכול במקום אחד", text: 'המרה, העברות, מט"ח באשראי, כרטיס נטען וניכיון שיקים.' },
    { title: "אמינות ושקיפות", text: "חותם אמינות ורשיון של רשות שוק ההון" },
    { title: "זמינות ופריסה", text: "שלושה סניפים ומענה זמין באתר בטלפון ובווצאפ" },
  ],
};

export type Testimonial = { id: string; name: string; text: string; rating: number };

export const testimonialsSection = { title: "מה אומרים הלקוחות שלנו" };

// Same embed as the live homepage, directly above "לקוחות ממליצים".
export const crossRates = {
  title: "שערים מצטלבים",
  src: "https://il.widgets.investing.com/single-currency-crosses?theme=darkTheme&currency=23",
} as const;

// Local fallback; Firestore `testimonials` takes over in step 4.
export const testimonials: Testimonial[] = [
  {
    id: "eli-shahar",
    name: "אלי שחר",
    rating: 5,
    text: 'שירות מעולה. יחס אישי, והכי חשוב הם נותנים גם שירותי המרה ורכישת מט"ח עד הבית. כל הכבוד לניסים',
  },
  {
    id: "odelia",
    name: "אודליה",
    rating: 5,
    text: "שירות ואדיבות מעל הכל!!\nיוני בסניף בנעימי נותן שירות מעולה לכל לקוח. שי ואלי בסניף הרמה נותנים שרות בסבלנות ובחיוך. מומלץ מאוד!!!!",
  },
  {
    id: "shiran",
    name: "שירן",
    rating: 5,
    text: "בעל הבית איש אמין , מתייחס בסבר פנים יפות לכל אדם ,שירות נפלא יחס אישי !! ממליצה בחום !",
  },
  {
    id: "nachman",
    name: "נחמן",
    rating: 5,
    text: "כמה טוב שמעבר למקצועיות ברמה הטובה ביותר, יש גם מיוחדות של שירות ואדיבות, אמינות והארות פנים תמיד. ממליץ ממש בחום.",
  },
  {
    id: "bar-zohar",
    name: "בר זהר",
    rating: 5,
    text: "צוות מקצועי שנותן שירות אדיב ומהיר, שערים תחרותיים שחסכו לי הרבה כסף. זן נדיר בענף הצ'ינגים",
  },
];

export const contactForm = {
  title: "נשמח לשמוע מכם",
  subtitle: "השאירו פרטים ונחזור אליכם\nעם הצעה שמותאמת לפעילות שלכם.",
  name: "שם",
  phone: "טלפון",
  message: "איך אפשר לעזור?",
  audienceLabel: "אני:",
  audiences: [
    { value: "importer", label: "יבואן" },
    { value: "exporter", label: "יצואן" },
    { value: "company", label: "חברה" },
    { value: "private", label: "לקוח פרטי" },
  ],
  consentPrefix: "בשליחה אני מאשר/ת את ",
  consentLink: "מדיניות הפרטיות",
  submit: "נהיה בקשר!",
};
