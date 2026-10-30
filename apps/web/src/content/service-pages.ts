/** Copy taken from the Figma service frames (texts in the design export). */

export const currencies = [
  { name: "דולר", place: "ארה״ב", flag: "/services/fx-exchange/flags/us.png" },
  { name: "גריבנה", place: "אוקראינה", flag: "/services/fx-exchange/flags/ua.png" },
  { name: "דירהם", place: "דובאי", flag: "/services/fx-exchange/flags/ae.png" },
  { name: "באט", place: "תאילנד", flag: "/services/fx-exchange/flags/th.png" },
  { name: "לירה שטרלינג", place: "אנגליה", flag: "/services/fx-exchange/flags/gb.png" },
  { name: "פורינט", place: "הונגריה", flag: "/services/fx-exchange/flags/hu.png" },
  { name: "לירה", place: "מצרים", flag: "/services/fx-exchange/flags/eg.png" },
  { name: "יוהן", place: "סין", flag: "/services/fx-exchange/flags/cn.png" },
  { name: "לאי", place: "רומניה", flag: "/services/fx-exchange/flags/ro.png" },
  { name: "דינר", place: "ירדן", flag: "/services/fx-exchange/flags/jo.png" },
  { name: "דולר", place: "קנדה", flag: "/services/fx-exchange/flags/ca.png" },
  { name: "דולר", place: "הונג קונג", flag: "/services/fx-exchange/flags/hk.png" },
  { name: "לארי", place: "גיאורגיה", flag: "/services/fx-exchange/flags/ge.png" },
  { name: "דירהם", place: "מרוקו", flag: "/services/fx-exchange/flags/ma.png" },
  { name: "דולר", place: "אוסטרליה", flag: "/services/fx-exchange/flags/au.png" },
  { name: "רובל", place: "רוסיה", flag: "/services/fx-exchange/flags/ru.png" },
  { name: "פסו", place: "מקסיקו", flag: "/services/fx-exchange/flags/mx.png" },
  { name: "רופי", place: "הודו", flag: "/services/fx-exchange/flags/in.png" },
  { name: "מאנט", place: "אזרבייג׳אן", flag: "/services/fx-exchange/flags/az.png" },
  { name: "זלוטי", place: "פולין", flag: "/services/fx-exchange/flags/pl.png" },
  { name: "לירה", place: "טורקיה", flag: "/services/fx-exchange/flags/tr.png" },
  { name: "פרנק", place: "שוויץ", flag: "/services/fx-exchange/flags/ch.png" },
  { name: "ריאל", place: "ברזיל", flag: "/services/fx-exchange/flags/br.png" },
  { name: "שקל", place: "ישראל", flag: "/services/fx-exchange/flags/il.png" },
  { name: "יורו", place: "האיחוד האירופאי", flag: "/services/fx-exchange/flags/eu.png" },
  { name: "קרונה", place: "צ׳כיה", flag: "/services/fx-exchange/flags/cz.png" },
  { name: "ראנד", place: "דרום אפריקה", flag: "/services/fx-exchange/flags/za.png" },
  { name: "ין", place: "יפן", flag: "/services/fx-exchange/flags/jp.png" },
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
} as const;

export type ServiceSlug = keyof typeof servicePages;
