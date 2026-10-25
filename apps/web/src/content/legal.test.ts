import { describe, expect, it } from "vitest";
import { accessibilityStatement } from "./legal";

describe("accessibility statement", () => {
  it("explains the Nagishli menu and how to open it", () => {
    const text = [accessibilityStatement.menuTitle, ...accessibilityStatement.menuParagraphs].join(" ");
    expect(text).toContain("נגיש לי");
    expect(text).toContain("נגישות");
    expect(text).toContain("שמאלית התחתונה");
    expect(text).toContain("Alt ו־Z");
  });
});
