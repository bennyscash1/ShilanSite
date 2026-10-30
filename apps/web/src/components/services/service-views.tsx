import { Button } from "@shilan/ui/components/button";
import { SectionHeading } from "@shilan/ui/components/section-heading";
import { ClockIcon, MessagesSquareIcon, ShieldCheckIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CheckDiscountingIcon } from "@/components/icons/figma-icons";
import { currencies } from "@/content/service-pages";
import { AudienceCards, CallVip, FeatureRow, PhotoHero } from "./service-blocks";

export function FxExchangeView() {
  return (
    <main id="main">
      <PhotoHero image="/services/fx-exchange/hero.jpg" imageAlt="">
        <SectionHeading as="h1" tone="light">
          המרת מט״ח
        </SectionHeading>
        <p className="mt-4 text-lead">לכל מטרה, לכל יעד</p>
        <p className="mt-3 max-w-3xl text-body leading-relaxed">
          טיול, עסקים לימודים, השתלמויות, קניות בחו״ל
          <br />
          או כל מטרה אחרת, אנחנו כאן כדי לדאוג לכם למטבע המתאים
        </p>
        <FeatureRow
          items={[
            {
              icon: "/services/fx-exchange/icon-money.svg",
              title: "מבחר רחב",
              text: "של מטבעות",
            },
            {
              icon: "/services/fx-exchange/icon-calc.svg",
              title: "שערי המרה",
              text: "אטרקטיביים",
            },
            {
              icon: "/services/fx-exchange/icon-clock.svg",
              title: "אפשרות",
              text: "להזמנה מראש",
            },
          ]}
        />
      </PhotoHero>

      <section className="section-screen bg-white">
        <div className="container-content">
          <h2 className="text-center text-h2 font-bold text-green-900">מגוון מטבעות, מגוון יעדים</h2>
          <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 lg:gap-4">
            {currencies.map((item) => (
              <li
                key={`${item.name}-${item.place}`}
                className="flex flex-col items-center rounded-card border border-gold-500 bg-white px-2 py-4 text-center"
              >
                <Image
                  src={item.flag}
                  alt=""
                  width={48}
                  height={36}
                  className="h-8 w-12 object-contain"
                />
                <p className="mt-2 text-body font-bold text-green-900">{item.name}</p>
                <p className="text-caption">{item.place}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-screen bg-green-900 text-white">
        <div className="container-content">
          <h2 className="text-center text-h2 font-bold">למה כדאי לרכוש מט״ח מראש?</h2>
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "חוסכים כסף",
                text: "רוכשים מט״ח מראש ונהנים מתנאי המרה משתלמים, בלי להסתמך על אפשרויות ההמרה היקרות בשדה התעופה.",
              },
              {
                title: "חוסכים זמן",
                text: "מגיעים ליעד כשהכול כבר מוכן, בלי לבזבז זמן בחיפוש אחר מקום להמיר בו כסף.",
              },
              {
                title: "יוצאים בראש שקט",
                text: "המטבע המקומי כבר ביד, כך שאפשר להתחיל את הנסיעה ברוגע ולהיות מוכנים להוצאות הראשונות מיד עם הנחיתה.",
              },
            ].map((card) => (
              <li key={card.title} className="rounded-card bg-white/15 px-6 py-8 text-center">
                <h3 className="text-title font-bold text-gold-300">{card.title}</h3>
                <p className="mt-3 text-body leading-relaxed">{card.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-green-950 text-white">
        <Image
          src="/services/fx-exchange/return.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div aria-hidden className="absolute inset-0 bg-green-950/55" />
        <div className="section-screen relative container-content text-center">
          <h2 className="text-h2 font-bold">המרת מט״ח בחזרה לשקלים</h2>
          <p className="mx-auto mt-4 max-w-3xl text-body leading-relaxed">
            חזרתם מחו״ל ונשארו לכם שטרות של מטבע זר?
            <br />
            נשמח לרכוש מכם את יתרת המט״ח ולהמיר אותה לשקלים, כך שתוכלו לחזור לשגרה בראש שקט.
          </p>
          <p className="mt-4 text-body">השירות מיועד לשטרות בלבד.</p>
        </div>
      </section>
    </main>
  );
}

export function TransfersView() {
  return (
    <main id="main">
      <PhotoHero image="/services/transfers/hero.jpg" imageAlt="">
        <SectionHeading as="h1" tone="light">
          העברות מט״ח בינלאומיות
        </SectionHeading>
        <p className="mt-5 max-w-3xl text-lead leading-relaxed">
          בשילן תמצאו פתרון נוח, מהיר ופשוט להעברות כספים בינלאומיות.
        </p>
      </PhotoHero>

      <section className="section-screen bg-white">
        <div className="container-content max-w-4xl space-y-8 text-center text-body leading-relaxed text-green-900">
          <p>
            צריכים להעביר כסף לקרוב משפחה בחו״ל, לשלם שכר לימוד או שכר דירה, או לקבל כסף ממישהו
            שנמצא מעבר לים?
            <br />
            בשילן שירותי המרה בע״מ תוכלו ליהנות משירותי העברת כספים בינלאומיים, בדרך פשוטה, נוחה
            ומהירה.
          </p>
          <p>
            אנו עובדים עם חברות בינלאומיות מובילות בתחום, בהן RIA, CONTACT, CRONAPAY, Welsend, Neena,
            WFS, BDO Remit, המפעילות רשתות של נקודות שירות ברחבי העולם
          </p>
          <p className="text-title font-bold">
            צריכים לשלוח או לקבל כסף מחו״ל? פנו אלינו ונשמח לעזור לכם למצוא את פתרון ההעברה המתאים
            לצרכים שלכם, וללוות אתכם בתהליך עד להשלמת הפעולה.
          </p>
        </div>
      </section>
    </main>
  );
}

export function FxCreditView() {
  return (
    <main id="main">
      <PhotoHero image="/services/fx-credit/hero.jpg" imageAlt="">
        <SectionHeading as="h1" tone="light">
          רכישת מט״ח בכרטיס אשראי,
          <br />
          עד 12 תשלומים
        </SectionHeading>
        <p className="mt-5 max-w-3xl text-body leading-relaxed">
          השירות מאפשר לכם לרכוש את המטבע הדרוש לכם וליהנות מגמישות באופן התשלום, ללא צורך הבגעה
          לסניף.
        </p>
        <div className="mt-12">
          <AudienceCards
            title="למי מתאימה רכישת מט״ח בכרטיס אשראי?"
            cards={[
              {
                title: "לקראת נסיעה לחו״ל",
                text: "רכישת מטבע חוץ לצורך חופשה, נסיעת עסקים או שהייה ממושכת בחו״ל.",
              },
              {
                title: "סטודנטים",
                text: "תשלום הוצאות מחיה, שכר דירה ושכר לימוד במדינה אחרת.",
              },
              {
                title: "תשלומים עסקיים",
                text: "רכישת מטבע חוץ לצורך תשלום לספקים בחו״ל והוצאות הקשורות לפעילות העסקית.",
              },
              {
                title: "תשלומים והתחייבויות",
                text: "רכישת המטבע הדרוש לביצוע תשלומים עבור שירותים, רכישות והתחייבויות שונות בחו״ל.",
              },
            ]}
          />
        </div>
      </PhotoHero>

      <section className="section-screen bg-white text-center text-green-900">
        <div className="container-content">
          <h2 className="text-h2 font-bold">אילו כרטיסי אשראי מתקבלים?</h2>
          <p className="mx-auto mt-4 max-w-3xl text-body leading-relaxed">
            ניתן לרכוש מטבע חוץ באמצעות מגוון כרטיסי אשראי, בכפוף לתנאי השירות ולאישור העסקה:
          </p>
          <ul className="mt-10 flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {(
              [
                ["diners.png", "Diners Club"],
                ["amex.png", "American Express"],
                ["visa.png", "Visa"],
                ["mastercard.png", "Mastercard"],
                ["isracard.png", "ישראכרט"],
              ] as const
            ).map(([file, label]) => (
              <li key={file}>
                <Image
                  src={`/services/fx-credit/${file}`}
                  alt={label}
                  width={140}
                  height={72}
                  className={
                    file === "isracard.png"
                      ? "size-14 object-cover object-right"
                      : "h-14 w-auto object-contain"
                  }
                />
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-10 max-w-3xl text-body leading-relaxed">
            צרו איתנו קשר לקבלת פרטים על תהליך הרכישה, המטבעות הזמינים ותנאי התשלום.
          </p>
        </div>
      </section>
    </main>
  );
}

const prepaidUses = [
  {
    title: "נוסעים לחו״ל? נהנים מחופש בלי להסתובב עם מזומן",
    text: "בין אם אתם טסים לחופשה משפחתית, לחופשה זוגית או לנסיעת עסקים, הכרטיס הנטען מאפשר לכם להצטייד מראש בכסף בדולר או באירו ולהשתמש בו בחו״ל. במקום להסתובב עם סכומי כסף גדולים במזומן, תוכלו לשלם באמצעות הכרטיס בהתאם לתנאיו וליהנות מדרך נוחה להתנהל עם הכסף במהלך הנסיעה.",
  },
  {
    title: "שולטים בהוצאות ומנהלים תקציב מוגדר",
    text: "רוצים לדעת כמה כסף עומד לרשותכם ולהימנע מהוצאות מעבר לתכנון? הכרטיס הנטען מאפשר לעבוד בשיטה פשוטה: מטעינים סכום מסוים ומשתמשים בכסף הזמין בכרטיס. אפשר להקצות אותו לקניות, לבילויים או להוצאות אחרות, בהתאם לצרכים שלכם. האפליקציה מאפשרת לעקוב אחר היתרה ולראות כמה כסף נותר לשימוש, כדי לנהל את התקציב בצורה מסודרת יותר.",
  },
  {
    title: "מלמדים את הילדים להתנהל נכון עם כסף",
    text: "רוצים להקנות לילדים הרגלים כלכליים טובים כבר מגיל צעיר? הכרטיס הנטען מאפשר להקצות להם סכום מוגדר לשימוש, ולעזור להם ללמוד לתכנן הוצאות, להבחין בין רצונות לצרכים ולפתח אחריות כלכלית. במקום לתת לילדים אמצעי תשלום ללא מסגרת תקציבית ברורה, אפשר להטעין סכום שנקבע מראש וללמד אותם להשתמש בכסף בצורה מושכלת.",
  },
  {
    title: "פתרון חוץ בנקאי למגוון צרכים",
    text: "מחפשים אמצעי תשלום שאינו כרטיס אשראי בנקאי רגיל? הכרטיס הנטען הוא פתרון חוץ בנקאי, המבוסס על כסף שנטען מראש. הוא עשוי להתאים גם למי שחשבונו מוגבל ומחפש אפשרות נוספת להתנהלות כספית, בכפוף לתנאי ההנפקה ולבדיקת הזכאות.",
  },
  {
    title: "קונים באינטרנט בלי להשתמש בכרטיס האשראי הרגיל",
    text: "מעדיפים שלא להשתמש בכרטיס האשראי המרכזי שלכם לרכישות מקוונות? הכרטיס הנטען מאפשר להקצות סכום ייעודי לקניות באינטרנט, בהתאם לתמיכת הכרטיס בסוג העסקה. טוענים את הסכום הרצוי ומשתמשים ביתרה הזמינה, בלי לערב את מסגרת כרטיס האשראי הרגיל. כך אפשר להפריד בין ההוצאות ולנהל תקציב ייעודי לרכישות מקוונות.",
  },
];

export function PrepaidView() {
  return (
    <main id="main">
      <PhotoHero image="/services/prepaid/hero.jpg" imageAlt="">
        <SectionHeading as="h1" tone="light">
          כרטיס אשראי נטען
        </SectionHeading>
        <p className="mt-5 max-w-3xl text-body leading-relaxed">
          לנסיעות לחו״ל, לילדים, ללימודים מעבר לים, לקניות באינטרנט או לניהול תקציב אישי, הכרטיס
          הנטען של שילן מציע דרך נוספת להתנהל עם הכסף שלכם. בוחרים את הסכום, טוענים את הכרטיס
          ומשתמשים בו בהתאם לצרכים ולתנאי השירות.
        </p>
      </PhotoHero>

      <section className="section-screen bg-white">
        <div className="container-content">
          <h2 className="text-center text-h2 font-bold text-gold-500">כרטיס אחד, מגוון אפשרויות</h2>
          <ol className="mt-10 space-y-5">
            {prepaidUses.map((item, index) => (
              <li
                key={item.title}
                className="grid gap-4 rounded-card border border-gold-500 px-5 py-6 md:grid-cols-[auto_1fr] md:gap-8 md:px-8 md:py-8"
              >
                <span className="text-display font-bold text-gold-500" aria-hidden>
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-title font-bold text-gold-700">{item.title}</h3>
                  <p className="mt-2 text-body leading-relaxed">{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-screen bg-cream-50">
        <div className="container-content text-center">
          <p className="text-title font-bold text-green-900">
            עם האפליקציה הנלווית לכרטיס תוכלו לנהל את השימוש בו בצורה פשוטה ונוחה:
          </p>
          <ul className="mx-auto mt-8 grid max-w-3xl gap-4 text-start sm:grid-cols-2">
            <li className="rounded-card border border-gold-500 bg-white p-6">
              <h3 className="text-title font-bold text-green-900">טעינת הכרטיס:</h3>
              <p className="mt-2 text-body">הוספת כסף בהתאם לאפשרויות הטעינה הזמינות.</p>
            </li>
            <li className="rounded-card border border-gold-500 bg-white p-6">
              <h3 className="text-title font-bold text-green-900">בדיקת יתרה:</h3>
              <p className="mt-2 text-body">צפייה בסכום שנותר בכרטיס וזמין לשימוש.</p>
            </li>
          </ul>
          <p className="mx-auto mt-10 max-w-3xl text-body leading-relaxed">
            רוצים לקבל פרטים נוספים על הכרטיס הנטען של שילן? צרו איתנו קשר ונשמח לסייע לכם להכיר את
            אפשרויות השימוש בכרטיס ואת תנאי ההנפקה.
          </p>
        </div>
      </section>
    </main>
  );
}

export function BusinessFxView() {
  return (
    <main id="main">
      <PhotoHero image="/services/business/hero.jpg" imageAlt="">
        <SectionHeading as="h1" tone="light">
          המרת מט״ח ליבואנים וליצואנים
        </SectionHeading>
        <p className="mt-4 text-lead">העסק שלכם פועל בזירה הבינלאומית?</p>
        <p className="mt-2 text-lead">המט״ח שלכם בידיים מקצועיות.</p>
        <p className="mt-5 max-w-3xl text-body leading-relaxed">
          יבוא ויצוא הם הרבה מעבר לרכישת סחורה ולמכירתה. עסקאות בינלאומיות מחייבות התנהלות במטבעות
          שונים, והמרתם לשקלים או מהם היא חלק בלתי נפרד מהפעילות העסקית.
        </p>
        <p className="mt-3 max-w-3xl text-body leading-relaxed">
          בשילן שירותי המרה בע״מ תמצאו שירותי המרת מט״ח לעסקים הפועלים מול השוק הבינלאומי, לצד ליווי
          אישי, שירות מקצועי ומחירים תחרותיים.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#importers"
            className="rounded-full border border-white px-5 py-2 text-body hover:bg-white/10"
          >
            אני יבואן
          </a>
          <a
            href="#exporters"
            className="rounded-full border border-white px-5 py-2 text-body hover:bg-white/10"
          >
            אני יצואן
          </a>
        </div>
      </PhotoHero>

      <section id="importers" className="section-screen bg-white">
        <div className="container-content grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <p className="text-title font-bold text-gold-700">יבואנים</p>
            <h2 className="mt-2 text-h2 font-bold text-green-900">רוכשים מט״ח לעסק</h2>
            <div className="mt-4 space-y-3 text-body leading-relaxed">
              <p>יבוא סחורות מחו״ל מחייב עסקים רבים לשלם לספקים במטבע חוץ.</p>
              <p>בין אם מדובר ברכישות שוטפות ובין אם בעסקאות בהיקפים משמעותיים,</p>
              <p>המרת המט״ח היא חלק בלתי נפרד מהפעילות העסקית, ולשער ההמרה יש השפעה על העלות הכוללת של הרכישה.</p>
              <p>רוכשים מט״ח לצורך תשלום לספקים בחו״ל? חדר העסקאות VIP של שילן עומד לרשותכם.</p>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-card">
            <Image src="/services/business/import.jpg" alt="" fill className="object-cover" sizes="(min-width: 1024px) 40vw, 100vw" />
          </div>
        </div>
      </section>

      <section id="exporters" className="section-screen bg-cream-50">
        <div className="container-content grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="relative aspect-[4/3] overflow-hidden rounded-card lg:order-first">
            <Image src="/services/business/export.jpg" alt="" fill className="object-cover" sizes="(min-width: 1024px) 40vw, 100vw" />
          </div>
          <div>
            <p className="text-title font-bold text-gold-700">יצואנים</p>
            <h2 className="mt-2 text-h2 font-bold text-green-900">מהכנסות במט״ח לתמורה בשקלים</h2>
            <div className="mt-4 space-y-3 text-body leading-relaxed">
              <p>
                הלקוחות הבינלאומיים משלמים במטבע זר, אבל ההוצאות של העסק בישראל עשויות להיות בשקלים.
                בין קבלת התשלום לבין השימוש בכסף, מגיע שלב המרת המט״ח.
              </p>
              <p>
                המרת הכנסות במטבע חוץ לשקלים מאפשרת להתאים את הכספים המתקבלים לצורכי העסק. בחירת
                תנאי ההמרה היא חלק מההתנהלות העסקית, וכדאי לתת לה את תשומת הלב הראויה.
              </p>
              <p>
                שילן מציעה שירותי המרת מט״ח ליצואנים, כדי לספק מענה לצורך בהמרת הכנסות המתקבלות
                מלקוחות בחו״ל.
              </p>
              <p>מקבלים תשלומים במטבע חוץ? פנו לחדר העסקאות VIP של שילן לבירור תנאי ההמרה.</p>
            </div>
          </div>
        </div>
      </section>

      <CallVip />
    </main>
  );
}

const checkSteps = [
  {
    title: "פונים אלינו",
    text: "משאירים פרטים ומתארים בקצרה את הצורך: שיק דחוי, ומימון עד למועד הפירעון.",
  },
  {
    title: "מעבירים את מה שנבקש",
    text: "כדי לבדוק את הפנייה נבקש פרטים על השיק ועל הפעילות. בלי זה אי אפשר לדעת אם יש מסלול מתאים.",
  },
  {
    title: "מקבלים תשובה",
    text: "אם אפשר להתקדם, נסביר מה השלב הבא. אם לא, נאמר זאת. אין התחייבות מראש שהשירות יינתן.",
  },
];

const checkAudiences = [
  {
    title: "שיקים דחויים מלקוחות",
    text: "עסקים שמקבלים שיקים שמועד הפירעון שלהם עדיין לא הגיע.",
  },
  {
    title: "צורך במימון עד הפירעון",
    text: "כשהתשלום קבוע למועד מאוחר יותר, והעסק בודק אפשרות למימון בינתיים.",
  },
  {
    title: "מסלול חוץ בנקאי",
    text: "מי שבוחן אפשרות נוספת לצד הבנק. כל פנייה נבדקת, ואין הבטחה מראש.",
  },
];

const checkQuestions = [
  {
    q: "מה זה נכיון שיקים?",
    a: "שיק דחוי הוא התחייבות לתשלום במועד עתידי. נכיון שיקים הוא בירור האפשרות לקבל מימון כנגד השיק לפני מועד הפירעון. כל פנייה נבדקת לגופה.",
  },
  {
    q: "האם כל שיק מתאים?",
    a: "לא. פרטי השיק, הצדדים והנסיבות נבדקים. רק אחרי הבדיקה אפשר לדעת אם יש מסלול מתאים.",
  },
  {
    q: "למי זה מיועד?",
    a: "לעסקים שמקבלים שיקים דחויים ושוקלים מימון חוץ בנקאי עד למועד הפירעון.",
  },
  {
    q: "איך מתחילים?",
    a: "משאירים פרטים ביצירת קשר. נחזור אליכם כדי להבין את הצורך ומה נדרש להמשך.",
  },
];

export function CheckDiscountingView() {
  return (
    <main id="main">
      <PhotoHero image="/services/checks/hero.jpg" imageAlt="">
        <SectionHeading as="h1" tone="light">
          נכיון שיקים
        </SectionHeading>
        <p className="mt-4 max-w-3xl text-lead">
          לעסקים שמקבלים שיקים דחויים וצריכים מימון חוץ בנקאי
        </p>
        <p className="mt-4 max-w-3xl text-body leading-relaxed">
          אפשר לפנות אלינו כדי לבדוק אם יש מסלול למימון כנגד שיק דחוי, לפני מועד הפירעון. הפנייה
          אינה התחייבות: כל מקרה נבחן לפי הפרטים שיועברו.
        </p>
        <ul className="mt-10 grid gap-8 sm:grid-cols-3 md:mt-14">
          {[
            { icon: CheckDiscountingIcon, title: "שיקים דחויים", text: "מימון לפני מועד הפירעון" },
            { icon: ShieldCheckIcon, title: "בדיקה אישית", text: "כל פנייה נבחנת לגופה" },
            { icon: ClockIcon, title: "בלי התחייבות מראש", text: "קודם מבינים, אחר כך מחליטים" },
          ].map((item) => (
            <li key={item.title} className="flex flex-col items-center text-center">
              <item.icon className="size-12 text-white" aria-hidden />
              <p className="mt-4 text-title font-bold">{item.title}</p>
              <p className="text-body">{item.text}</p>
            </li>
          ))}
        </ul>
      </PhotoHero>

      <section className="section-screen bg-white">
        <div className="container-content">
          <h2 className="text-center text-h2 font-bold text-green-900">איך זה עובד</h2>
          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {checkSteps.map((step, index) => (
              <li key={step.title} className="rounded-card border border-gold-500 px-6 py-8">
                <span className="text-display font-bold text-gold-500" aria-hidden>
                  {index + 1}
                </span>
                <h3 className="mt-3 text-title font-bold text-green-900">{step.title}</h3>
                <p className="mt-2 text-body leading-relaxed">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-screen bg-green-900 text-white">
        <div className="container-content">
          <AudienceCards title="למי זה מתאים" cards={checkAudiences} />
        </div>
      </section>

      <section className="section-screen bg-cream-50">
        <div className="container-content">
          <h2 className="text-center text-h2 font-bold text-green-900">שאלות לפני שפונים</h2>
          <dl className="mx-auto mt-10 max-w-3xl space-y-4">
            {checkQuestions.map((item) => (
              <div key={item.q} className="rounded-card border border-gold-500 bg-white px-6 py-5">
                <dt className="text-title font-bold text-green-900">{item.q}</dt>
                <dd className="mt-2 text-body leading-relaxed">{item.a}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-12 text-center">
            <p className="text-title font-bold text-green-900">נשמח לבדוק את הפנייה</p>
            <p className="mx-auto mt-3 max-w-2xl text-body leading-relaxed">
              השאירו פרטים ונחזור אליכם. השיחה היא לבירור בלבד, בלי התחייבות ובלי הבטחה שהשירות
              יינתן.
            </p>
            <Button asChild className="mt-6">
              <Link href="/#contact">
                <MessagesSquareIcon className="size-4" aria-hidden />
                ליצירת קשר
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
