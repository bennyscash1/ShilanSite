import { describe, expect, it } from "vitest";
import { currencies } from "./service-pages";

describe("currency grid", () => {
  it("follows the Figma right-to-left order", () => {
    expect(currencies).toHaveLength(28);
    expect(currencies.slice(0, 7).map((item) => item.place || item.name)).toEqual([
      "ארה״ב",
      "יורו",
      "אנגליה",
      "קנדה",
      "אוסטרליה",
      "שוויץ",
      "ישראל",
    ]);
    expect(currencies.at(-1)?.place).toBe("טורקיה");
    expect(currencies.map((item) => item.flag).filter((flag, index, all) => all.indexOf(flag) !== index)).toEqual([]);
  });
});
