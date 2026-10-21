import { Fragment } from "react";

/**
 * Renders "\n"-separated copy with the design's line breaks on desktop (lg+),
 * and as normally wrapping text on smaller screens.
 */
export function DesktopLines({ text }: { text: string }) {
  const lines = text.split("\n");
  return lines.map((line, i) => (
    <Fragment key={i}>
      <span className="lg:block">{line}</span>
      {i < lines.length - 1 && " "}
    </Fragment>
  ));
}
