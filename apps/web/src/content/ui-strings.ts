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
