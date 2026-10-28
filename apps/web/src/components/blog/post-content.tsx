import { parseMarkdown, type Block, type Inline } from "@shilan/core";
import Link from "next/link";
import type { ReactNode } from "react";

function renderInline(nodes: Inline[], keyPrefix = ""): ReactNode[] {
  return nodes.map((node, i) => {
    const key = `${keyPrefix}${i}`;
    switch (node.type) {
      case "text":
        return node.value;
      case "strong":
        return <strong key={key}>{renderInline(node.children, `${key}-`)}</strong>;
      case "em":
        return <em key={key}>{renderInline(node.children, `${key}-`)}</em>;
      case "link": {
        const children = renderInline(node.children, `${key}-`);
        return node.href.startsWith("/") || node.href.startsWith("#") ? (
          <Link key={key} href={node.href}>
            {children}
          </Link>
        ) : (
          <a key={key} href={node.href} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        );
      }
    }
  });
}

function renderLines(lines: Inline[][]): ReactNode[] {
  return lines.flatMap((line, i) => [...(i > 0 ? [<br key={`br${i}`} />] : []), ...renderInline(line, `l${i}-`)]);
}

function renderBlock(block: Block, i: number): ReactNode {
  switch (block.type) {
    case "heading":
      return block.level === 2 ? (
        <h2 key={i}>{renderInline(block.children)}</h2>
      ) : (
        <h3 key={i}>{renderInline(block.children)}</h3>
      );
    case "paragraph":
      return <p key={i}>{renderLines(block.lines)}</p>;
    case "list": {
      const items = block.items.map((item, j) => <li key={j}>{renderInline(item)}</li>);
      return block.ordered ? <ol key={i}>{items}</ol> : <ul key={i}>{items}</ul>;
    }
    case "quote":
      return <blockquote key={i}>{renderLines(block.lines)}</blockquote>;
    case "image":
      return (
        <figure key={i}>
          {/* Author images have unknown dimensions, so a plain lazy <img> is used. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={block.src} alt={block.alt} loading="lazy" decoding="async" />
          {block.alt && <figcaption>{block.alt}</figcaption>}
        </figure>
      );
    case "divider":
      return <hr key={i} />;
  }
}

/** Renders post content (markdown subset) as safe React elements. Styled by `.post-prose`. */
export function PostContent({ source, className }: { source: string; className?: string }) {
  return <div className={`post-prose ${className ?? ""}`}>{parseMarkdown(source).map(renderBlock)}</div>;
}
