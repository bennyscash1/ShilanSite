/** Copy taken from the Figma service frames (texts in the design export). */

/** Flag grid from Figma 132:213, right to left. Each image is the asset tied to that country in the frame. */
export const currencies = [
  { name: "דולר", place: "ארה״ב", flag: "/services/fx-exchange/flags/us.png" },
  { name: "יורו", place: "", flag: "/services/fx-exchange/flags/eu.png" },
  { name: "לירה שטרלינג", place: "אנגליה", flag: "/services/fx-exchange/flags/gb.png" },
  { name: "דולר", place: "קנדה", flag: "/services/fx-exchange/flags/ca.png" },
  { name: "דולר", place: "אוסטרליה", flag: "/services/fx-exchange/flags/au.png" },
  { name: "פרנק", place: "שוויץ", flag: "/services/fx-exchange/flags/ch.png" },
  { name: "שקל", place: "ישראל", flag: "/services/fx-exchange/flags/il.png" },
  { name: "גריבנה", place: "אוקראינה", flag: "/services/fx-exchange/flags/ua.png" },
  { name: "קרונה", place: "צ׳כיה", flag: "/services/fx-exchange/flags/cz.png" },
  { name: "פורינט", place: "הונגריה", flag: "/services/fx-exchange/flags/hu.png" },
  { name: "לאי", place: "רומניה", flag: "/services/fx-exchange/flags/ro.png" },
  { name: "לארי", place: "גיאורגיה", flag: "/services/fx-exchange/flags/ge.png" },
  { name: "רובל", place: "רוסיה", flag: "/services/fx-exchange/flags/ru.png" },
  { name: "זלוטי", place: "פולין", flag: "/services/fx-exchange/flags/pl.png" },
  { name: "באט", place: "תאילנד", flag: "/services/fx-exchange/flags/th.png" },
  { name: "יוהן", place: "סין", flag: "/services/fx-exchange/flags/cn.png" },
  { name: "ין", place: "יפן", flag: "/services/fx-exchange/flags/jp.png" },
  { name: "רופי", place: "הודו", flag: "/services/fx-exchange/flags/in.png" },
  { name: "דולר", place: "הונג קונג", flag: "/services/fx-exchange/flags/hk.png" },
  { name: "ריאל", place: "ברזיל", flag: "/services/fx-exchange/flags/br.png" },
  { name: "פסו", place: "מקסיקו", flag: "/services/fx-exchange/flags/mx.png" },
  { name: "דירהם", place: "דובאי", flag: "/services/fx-exchange/flags/ae.png" },
  { name: "ראנד", place: "דרום אפריקה", flag: "/services/fx-exchange/flags/za.png" },
  { name: "מאנט", place: "אזרבאיג׳אן", flag: "/services/fx-exchange/flags/az.png" },
  { name: "דירהם", place: "מרוקו", flag: "/services/fx-exchange/flags/ma.png" },
  { name: "לירה", place: "מצרים", flag: "/services/fx-exchange/flags/eg.png" },
  { name: "דינר", place: "ירדן", flag: "/services/fx-exchange/flags/jo.png" },
  { name: "לירה", place: "טורקיה", flag: "/services/fx-exchange/flags/tr.png" },
] as const;

export const servicePages = {
  "fx-exchange": {
    title: "המרת מט״ח",
    description: "לכל מטרה, לכל יעד. טיול, עסקים, לימודים, השתלמויות, קניות בחו״ל או כל מטרה אחרת.",
  },
  "international-transfers": {
    title: "העברות מט״ח בינלאומיות",
    description: "בשילן תמצאו פתרון נוח, מהיר ופשוט להעברות כספים בינלאומיות.",
  },
  "fx-credit": {
    title: "רכישת מט״ח בכרטיס אשראי",
    description: "עד 12 תשלומים, ללא צורך בהגעה לסניף.",
  },
  "prepaid-card": {
    title: "כרטיס אשראי נטען",
    description: "כרטיס אחד, מגוון אפשרויות.",
  },
  "check-discounting": {
    title: "נכיון שיקים",
    description: "לעסקים שמקבלים שיקים דחויים וצריכים מימון חוץ בנקאי.",
  },
} as const;

export type ServiceSlug = keyof typeof servicePages;
