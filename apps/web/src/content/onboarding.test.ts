import { describe, expect, it } from "vitest";
import { customerTypes } from "./onboarding";

describe("onboarding links", () => {
  it("keeps the live form addresses, including the KYC form", () => {
    expect(
      customerTypes.map((customer) => ({
        slug: customer.slug,
        documents: customer.documents,
      })),
    ).toEqual([
      {
        slug: "private",
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
            href: "https://flow.iforms.co.il/Show_form/j87903lgbe0o0cko48wwokwkgc88sk",
          },
          {
            label: "טופס יפוי כוח עבור פרטי",
            href: "https://flow.iforms.co.il/Show_form/fx1qqra4v2o8okswc0kksoks440084",
          },
        ],
      },
      {
        slug: "osek",
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
            href: "https://flow.iforms.co.il/Show_form/j87903lgbe0o0cko48wwokwkgc88sk",
          },
          {
            label: "טופס יפוי כוח",
            href: "https://flow.iforms.co.il/Show_form/iyspha69m2o0kw00wks40gc4k80s0w",
          },
        ],
      },
      {
        slug: "corporation",
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
            href: "https://flow.iforms.co.il/Show_form/j87903lgbe0o0cko48wwokwkgc88sk",
          },
          {
            label: "טופס יפוי כוח",
            href: "https://flow.iforms.co.il/Show_form/or5fiyabsw0084c00o0so08g0sg080",
          },
        ],
      },
    ]);
  });
});
