/**
 * Functional UI microcopy that the design does not show but accessibility requires
 * (screen-reader labels, skip link, carousel controls...). Written by the developer:
 * the business should review this file.
 */
export const uiStrings = {
  skipToContent: "דילוג לתוכן הראשי",
  homeLink: "שילן שירותי המרה - לדף הבית",
  openMenu: "פתיחת תפריט",
  closeMenu: "סגירת תפריט",
  menuTitle: "תפריט",
  mainNav: "ניווט ראשי",
  audienceTabs: "בחירת קהל יעד",
  carouselLabel: "המלצות לקוחות",
  carouselPrev: "הקודם",
  carouselNext: "הבא",
  rating: (value: number, max: number) => `דירוג ${value} מתוך ${max}`,
  currencyA: "מטבע ראשון",
  currencyB: "מטבע שני",
  amountIn: (currencyName: string) => `סכום ב${currencyName}`,
  swapCurrencies: "החלפת מטבעות",
  ratesUpdated: "עדכון אחרון:",
} as const;

/** Blog pages. Developer-written (the design has no blog page): review with the business. */
export const blogStrings = {
  title: "בלוג",
  description: "מאמרים, מדריכים ועדכונים בנושא מט״ח, העברות בינלאומיות ושירותי המרה מצוות שילן.",
  empty: "בקרוב יתפרסמו כאן מאמרים.",
  home: "דף הבית",
  backToBlog: "לכל המאמרים",
  readingTime: (minutes: number) => `${minutes} דקות קריאה`,
  latest: "מאמרים נוספים",
} as const;
