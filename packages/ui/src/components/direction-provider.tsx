"use client";

import { Direction } from "radix-ui";
import type { ReactNode } from "react";

/** Makes Radix primitives (Select, Tabs, RadioGroup...) use RTL keyboard and positioning logic. */
export function DirectionProvider({ children }: { children: ReactNode }) {
  return <Direction.Provider dir="rtl">{children}</Direction.Provider>;
}
