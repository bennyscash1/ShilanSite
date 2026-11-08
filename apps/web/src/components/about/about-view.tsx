import { SectionHeading } from "@shilan/ui/components/section-heading";
import Image from "next/image";
import { about } from "@/content/about";

export function AboutView() {
  return (
    <main id="main">
      <section className="section-screen bg-brand-radial text-white">
        <div className="container-content grid items-center gap-8 lg:grid-cols-[auto_minmax(0,1fr)]">
          <a
            href={about.duns.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto block w-40 shrink-0 lg:w-52"
          >
            <Image src={about.duns.src} alt={about.duns.alt} width={297} height={246} className="h-auto w-full" />
            <span className="sr-only"> נפתח בחלון חדש</span>
          </a>
          <div>
            <SectionHeading as="h1" tone="light">
              {about.heading}
            </SectionHeading>
            <p className="mt-5 text-title font-bold">{about.kicker}</p>
            <p className="mt-3 max-w-3xl text-body leading-relaxed text-white/95">{about.lead}</p>
            <p className="mt-3 max-w-3xl text-body leading-relaxed text-white/95">{about.leadMore}</p>
          </div>
        </div>
      </section>

      <section className="section-screen bg-white" aria-labelledby="about-stats">
        <div className="container-content">
          <h2 id="about-stats" className="text-h2 font-bold text-green-900">
            {about.statsTitle}
          </h2>
          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
            {about.stats.map((stat) => (
              <li key={stat.label} className="text-gold-700">
                <p className="text-h2 font-bold">{stat.value}</p>
                <p className="mt-1 text-body">{stat.label}</p>
                {"detail" in stat && stat.detail ? <p className="text-body">{stat.detail}</p> : null}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-screen bg-cream-50">
        <div className="container-content space-y-6">
          <article className="rounded-card border border-gold-500 bg-white/80 px-6 py-8 md:px-10">
            <h2 className="text-title font-bold text-green-900">אמינות, שקיפות ופיקוח רגולטורי</h2>
            <div className="mt-3 max-w-3xl space-y-3 text-body leading-relaxed text-green-900">
              <p>
                אמינות, שקיפות ומקצועיות הן אבני היסוד של פעילות שילן שירותי המרה בע״מ.
                <br />
                אנו פועלים כגוף פיננסי מורשה ומפוקח על ידי רשות שוק ההון, ביטוח וחיסכון, ומקפידים על
                התנהלות אחראית בהתאם לדרישות הרגולציה החלות על פעילותנו.
              </p>
              <p>לרשות החברה הרישיונות הנדרשים למתן שירותיה הפיננסיים:</p>
              <ul className="list-disc ps-6">
                <li>רישיון למתן שירותים פיננסיים מס׳ 57644.</li>
                <li>רישיון למתן שירותי אשראי מס׳ 54722.</li>
              </ul>
              <p>
                אנו רואים בשקיפות ובשמירה על אמון לקוחותינו חלק בלתי נפרד מהשירות שאנו מעניקים.
                הרישיונות והאישורים של החברה עומדים לעיונכם, כחלק ממחויבותנו לפעילות מקצועית, אחראית
                ומפוקחת.
              </p>
            </div>
            <Image
              src="/about/license.png"
              alt=""
              width={208}
              height={295}
              className="mx-auto mt-8 h-auto w-40 rounded-control border border-gold-500 object-contain md:w-52"
            />
          </article>

          <article className="rounded-card border border-gold-500 bg-white/80 px-6 py-8 md:px-10">
            <h2 className="text-title font-bold text-green-900">צוות מקצועי ושירות אישי</h2>
            <div className="mt-3 max-w-3xl space-y-3 text-body leading-relaxed">
              <p>הצוות של שילן מורכב מאנשי מקצוע בעלי ניסיון של שנים בתחום הפיננסי, המעניקים שירות אדיב, מקצועי ואישי.</p>
              <p>
                אנו מקפידים על הכשרות מקצועיות שוטפות ועל עדכון הידע המקצועי, כדי להעניק ללקוחותינו
                שירות איכותי ומענה המבוסס על היכרות עם תחום הפעילות.
              </p>
              <p>
                השירות שלנו ניתן גם בשפה האנגלית, והמשרדים שלנו מונגשים לבעלי מוגבלויות, מתוך רצון
                להעניק לכל לקוח חוויית שירות נוחה ונגישה.
              </p>
            </div>
          </article>

          <article className="rounded-card border border-gold-500 bg-white/80 px-6 py-8 md:px-10">
            <h2 className="text-title font-bold text-green-900">
              שילן שירותי המרה בע״מ – כל הפתרונות הפיננסיים שלכם במקום אחד
            </h2>
            <div className="mt-3 max-w-3xl space-y-3 text-body leading-relaxed">
              <p>
                בין אם אתם זקוקים למטבע חוץ לקראת נסיעה, מעוניינים להעביר או לקבל כספים מחו״ל, צריכים
                לבצע פעולות פיננסיות שוטפות או מחפשים פתרונות מט״ח לפעילות העסקית שלכם, בשילן תמצאו
                מגוון שירותים תחת קורת גג אחת.
              </p>
              <p>נשמח לעמוד לשירותכם ולהעניק לכם מענה מקצועי, אמין ואישי.</p>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
