import { describe, expect, it } from "vitest";
import { mainNav, serviceNav } from "./site";

describe("main navigation", () => {
  it("opens the service pages from the services item", () => {
    const services = mainNav.find((item) => item.label === "השירותים שלנו");
    expect(services?.href).toBeUndefined();
    expect(services?.children).toEqual(serviceNav);
    expect(serviceNav.map((item) => item.href)).toEqual([
      "/business",
      "/services/fx-exchange",
      "/services/international-transfers",
      "/services/fx-credit",
      "/services/prepaid-card",
      "/services/check-discounting",
    ]);
    expect(serviceNav.filter((item) => item.href !== "/business").every((item) => item.href.startsWith("/services/"))).toBe(true);
  });
});
