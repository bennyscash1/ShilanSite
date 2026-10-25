/**
 * Customer onboarding ("הקמת לקוח").
 *
 * Form labels and URLs are copied from the live pages:
 * https://shilan.co.il/הקמת-לקוח/
 * https://shilan.co.il/לקוח-פרטי/
 * https://shilan.co.il/לקוח-עסקי-עוסק-מורשה/
 * https://shilan.co.il/לקוח-עיסקי-תאגיד/
 *
 * The explanatory copy is a plain-language summary of those pages plus:
 * - the about page on shilan.co.il (license and supervisor)
 * - צו איסור הלבנת הון (חובות זיהוי, דיווח וניהול רישומים של נותני שירות
 *   בנכס פיננסי ונותני שירותי אשראי), תשע"ח-2018
 *   https://www.nevo.co.il/law_html/law00/154372.htm
 *
 * File upload is an Elementor form on each live sub-page (no separate URL).
 * The upload buttons point at those pages. One iForms address is shared by
 * the three "מקבל שירות" forms; the label on each page is kept as published.
 */

export type OnboardingDocument = {
  label: string;
  href: string;
};

export type OnboardingStep = {
  title: string;
  body: string;
};

export type CustomerType = {
  slug: "private" | "osek" | "corporation";
  /** Button label on the live hub page. */
  navLabel: string;
  /** Heading on the live sub-page. */
  title: string;
  summary: string;
  intro: string;
  needs: string[];
  documentsNote: string;
  documents: OnboardingDocument[];
  uploadLabel: string;
  uploadHref: string;
};

const SERVICE_DECLARATION_HREF =
  "https://flow.iforms.co.il/Show_form/j87903lgbe0o0cko48wwokwkgc88sk";

export const onboarding = {
  title: "הקמת לקוח",
  description: "פתיחת התקשרות קבועה בשילן: זיהוי הלקוח, מילוי הטפסים והעלאת המסמכים.",
  paragraphs: [
    "הקמת לקוח היא הפתיחה של התקשרות קבועה איתנו. לפני שממירים מט״ח, מעבירים כסף או מנכים שיקים באופן קבוע, אנחנו מזהים את הלקוח ומכירים אותו.",
    "שילן שירותי המרה בע״מ היא חברה בעלת רישיון למתן שירותים פיננסיים, ופועלת תחת פיקוח רשות שוק ההון, ביטוח וחיסכון. נותן שירות בנכס פיננסי לא מתחיל שירות קבוע בלי לזהות מי מקבל את השירות, בלי לדעת עבור מי מתבצעת הפעולה, ובתאגיד גם בלי לדעת מי שולט בחברה.",
    "בוחרים את סוג הלקוח, ממלאים את הטפסים ומעלים את המסמכים. אנחנו עוברים על מה שנשלח. אם חסר פרט או מסמך, ניצור איתכם קשר. ההתקשרות הקבועה מתחילה אחרי שהזיהוי הושלם.",
  ],
  stepsTitle: "איך זה עובד",
  chooseTitle: "בחרו את סוג הלקוח",
  steps: [
    {
      title: "ממלאים את הטפסים",
      body: "מתחילים בטופס הכרת הלקוח. אחר כך חותמים על ההצהרות, ועל הסכם מסגרת האשראי אם מבקשים ניכיון שיקים.",
    },
    {
      title: "מעלים את המסמכים",
      body: "מעלים את תעודות הזיהוי ואת שאר המסמכים מהרשימה. ההעלאה נפתחת בטופס שבאתר שילן.",
    },
    {
      title: "אנחנו בודקים וחוזרים אליכם",
      body: "עוברים על הטפסים ועל המסמכים. אם חסר משהו, ניצור איתכם קשר לפני שמתחילים.",
    },
  ] satisfies OnboardingStep[],
};

export const customerTypes: CustomerType[] = [
  {
    slug: "private",
    navLabel: "לקוח פרטי ישראלי",
    title: "הקמת לקוח פרטי",
    summary: "לאדם פרטי תושב ישראל. תעודת זהות, ומסמך מזהה נוסף עם תמונה.",
    intro:
      "ללקוח פרטי ישראלי מזהים את האדם שמקבל את השירות: תעודת זהות בתוקף, ומסמך מזהה נוסף בתוקף עם תמונה ומספר זהות. בטפסים מצהירים אם אתם פועלים עבור עצמכם או עבור מישהו אחר. אם מישהו פועל בשמכם, ממלאים גם ייפוי כוח.",
    needs: [
      "תעודת זהות בתוקף",
      "מסמך מזהה נוסף בתוקף, עם תמונה ומספר זהות (רישיון נהיגה, דרכון, רישיון נשיאת נשק או רישיון עורך דין)",
    ],
    documentsNote:
      "טופס הכרת הלקוח הוא הצעד הראשון. הסכם מסגרת האשראי מיועד למי שמבקש ניכיון שיקים. ייפוי כוח ממלאים אם מישהו אחר פועל בשמכם.",
    documents: [
      {
        label: "טופס הכרת לקוח",
        href: "https://flow.iforms.co.il/Show_form/3v9daiduoosg8gg4c8kk4swcoso44k",
      },
      {
        label: "טופס הסכם מסגרת אשראי לניכיון שיקים - יחיד",
        href: "https://flow.iforms.co.il/Show_form/p66szf6tjvkksc0csk8ocos00s84kg",
      },
      {
        label: "טופס הצהרת נהנה",
        href: "https://flow.iforms.co.il/Show_form/4nbr0z6tenc4osso0ookosg0ksww0c",
      },
      {
        label: "הצהרת מקבל שירות קבוע לקוח פרטי",
        href: SERVICE_DECLARATION_HREF,
      },
      {
        label: "טופס יפוי כוח עבור פרטי",
        href: "https://flow.iforms.co.il/Show_form/fx1qqra4v2o8okswc0kksoks440084",
      },
    ],
    uploadLabel: "העלאת קבצים",
    uploadHref: "https://shilan.co.il/לקוח-פרטי/",
  },
  {
    slug: "osek",
    navLabel: "לקוח עסקי עוסק מורשה",
    title: "הקמת לקוח עסקי עוסק מורשה",
    summary: "לעוסק מורשה. זיהוי של מי שמבצע את הפעולה, ותעודת עוסק.",
    intro:
      "לעוסק מורשה מזהים את מי שמבצע את הפעולה, ומכירים את העסק. מכינים תעודת זהות בתוקף, מסמך מזהה נוסף עם תמונה ומספר זהות, ותעודת עוסק מורשה. אם יש לעסק רישיון נש״פ או נש״א, מעלים גם אותו. בטפסים מצהירים מי נהנה מהשירות ומי בעל השליטה.",
    needs: [
      "תעודת זהות בתוקף",
      "מסמך מזהה נוסף בתוקף, עם תמונה ומספר זהות, של מי שמבצע את הפעולה (רישיון נהיגה, דרכון, רישיון עורך דין או רישיון נשיאת נשק)",
      "תעודת עוסק מורשה",
      "רישיון נש״פ או נש״א, אם יש",
    ],
    documentsNote:
      "טופס הכרת הלקוח הוא הצעד הראשון. הסכם מסגרת האשראי מיועד למי שמבקש ניכיון שיקים. ייפוי כוח ממלאים אם מישהו אחר פועל בשם העסק. הצהרת הנהנה והצהרת בעל השליטה משלימות את ההיכרות עם הלקוח.",
    documents: [
      {
        label: "טופס הכרת לקוח עסקי",
        href: "https://flow.iforms.co.il/Show_form/6yns38oapncwskkggcwsk4wsg04kk4",
      },
      {
        label: "טופס הסכם מסגרת אשראי לניכיון שיקים - עוסק מורשה",
        href: "https://flow.iforms.co.il/Show_form/jw5l3k2t4o0kgk0c00c884g008kws4",
      },
      {
        label: "טופס הצהרת נהנה",
        href: "https://flow.iforms.co.il/Show_form/qrmkhgl237k4080soc4wo84wcwswwk",
      },
      {
        label: "הצהרת בעל שליטה עוסק מורשה",
        href: "https://flow.iforms.co.il/Show_form/l2kpwtow7w0swwcwwk4woggkg40kso",
      },
      {
        label: "טופס מקבל שירות קבוע עוסק מורשה",
        href: SERVICE_DECLARATION_HREF,
      },
      {
        label: "טופס יפוי כוח",
        href: "https://flow.iforms.co.il/Show_form/iyspha69m2o0kw00wks40gc4k80s0w",
      },
    ],
    uploadLabel: "העלאת מסמכים",
    uploadHref: "https://shilan.co.il/לקוח-עסקי-עוסק-מורשה/",
  },
  {
    slug: "corporation",
    navLabel: "לקוח עסקי תאגיד",
    title: "הקמת לקוח עסקי - תאגיד",
    summary: "לחברה או לתאגיד. מסמכי התאגדות, וזיהוי של מי שפועל בשם החברה.",
    intro:
      "לתאגיד מזהים את החברה ואת מי שפועל בשמה. מכינים תעודת התאגדות, נסח חברה מלא, ופרוטוקול מורשי חתימה חתום בידי עורך דין או רואה חשבון. מזהים גם את בעל המניות ואת מי שמבצע את הפעולה, עם תעודת זהות ומסמך נוסף עם תמונה. בטפסים מצהירים מי הנהנים ומי בעלי השליטה. אם מישהו פועל מטעם החברה, מצרפים ייפוי כוח חתום בחותמת ובחתימה.",
    needs: [
      "תעודת התאגדות",
      "נסח חברה מלא",
      "פרוטוקול מורשה חתימה, חתום בידי עורך דין או רואה חשבון",
      "תעודת זהות בתוקף של בעל המניות",
      "תעודת זהות בתוקף של מי שמבצע את הפעולה",
      "מסמך מזהה נוסף בתוקף, עם תמונה ומספר זהות, של מי שמבצע את הפעולה (רישיון נהיגה, דרכון, רישיון עורך דין או רישיון נשיאת נשק)",
      "רישיון נש״פ או נש״א, אם יש",
      "ייפוי כוח לביצוע פעולות בשילן שירותי המרה בע״מ, חתום בחותמת ובחתימה, אם מישהו פועל מטעם החברה",
    ],
    documentsNote:
      "טופס הכרת הלקוח הוא הצעד הראשון. הסכם מסגרת האשראי מיועד למי שמבקש ניכיון שיקים. ייפוי כוח ממלאים אם מישהו פועל מטעם החברה. הצהרת הנהנה והצהרת בעלי השליטה משלימות את ההיכרות עם הלקוח.",
    documents: [
      {
        label: "טופס הכרת לקוח תאגיד",
        href: "https://flow.iforms.co.il/Show_form/17wr4b42vg1wkwoocs00g44o8sswo0",
      },
      {
        label: "טופס הסכם מסגרת אשראי לניכיון – תאגיד",
        href: "https://flow.iforms.co.il/Show_form/6viquonw27wgscoo8sg8c4w808ck88",
      },
      {
        label: "טופס הצהרת נהנה",
        href: "https://flow.iforms.co.il/Show_form/j4tmsbp8r5cs0k4ow480ss88ks80kg",
      },
      {
        label: "טופס הצהרת בעלי שליטה",
        href: "https://flow.iforms.co.il/Show_form/jv9udghoew0kc0cggcw4ockg0kg0cg",
      },
      {
        label: "הצהרת מקבל שירות תאגיד",
        href: SERVICE_DECLARATION_HREF,
      },
      {
        label: "טופס יפוי כוח",
        href: "https://flow.iforms.co.il/Show_form/or5fiyabsw0084c00o0so08g0sg080",
      },
    ],
    uploadLabel: "העלאת מסמכים",
    uploadHref: "https://shilan.co.il/לקוח-עיסקי-תאגיד/",
  },
];

export function getCustomerType(slug: string): CustomerType | undefined {
  return customerTypes.find((customer) => customer.slug === slug);
}
