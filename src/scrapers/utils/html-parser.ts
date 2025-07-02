/**
 * Simple HTML parsing utilities for content extraction
 * In production, we'd use a proper HTML parser like cheerio
 */

export interface ParsedElement {
  tag: string;
  attributes: Record<string, string>;
  content: string;
  innerHTML: string;
}

/**
 * Extract text content from HTML using improved parsing
 */
export function extractTextBySelector(
  html: string,
  selector: string,
): string | null {
  // Handle class selectors
  if (selector.startsWith(".")) {
    const className = selector.slice(1);
    const classRegex = new RegExp(
      `<[^>]*class="[^"]*\\b${className}\\b[^"]*"[^>]*>([\\s\\S]*?)</[^>]*>`,
      "i",
    );
    const match = html.match(classRegex);
    if (match?.[1]) {
      return cleanHtmlContent(match[1]);
    }
  }

  // Handle ID selectors
  if (selector.startsWith("#")) {
    const id = selector.slice(1);
    const idRegex = new RegExp(
      `<[^>]*id="${id}"[^>]*>([\\s\\S]*?)</[^>]*>`,
      "i",
    );
    const match = html.match(idRegex);
    if (match?.[1]) {
      return cleanHtmlContent(match[1]);
    }
  }

  // Handle tag selectors
  const tagRegex = new RegExp(
    `<${selector}[^>]*>([\\s\\S]*?)</${selector}>`,
    "i",
  );
  const match = html.match(tagRegex);
  if (match?.[1]) {
    return cleanHtmlContent(match[1]);
  }

  return null;
}

/**
 * Extract all links from HTML
 */
export function extractLinks(html: string): string[] {
  const linkRegex = /href="([^"]+)"/gi;
  const links: string[] = [];
  let match;

  while ((match = linkRegex.exec(html)) !== null) {
    if (match[1]) {
      links.push(match[1]);
    }
  }

  return links;
}

/**
 * Extract all elements with a specific class
 */
export function extractElementsByClass(
  html: string,
  className: string,
): ParsedElement[] {
  const elements: ParsedElement[] = [];
  const regex = new RegExp(
    `<([^>\\s]+)[^>]*class="[^"]*\\b${className}\\b[^"]*"([^>]*)>([\\s\\S]*?)</\\1>`,
    "gi",
  );

  let match;
  while ((match = regex.exec(html)) !== null) {
    const tag = match[1] ?? "";
    const attributesStr = match[2] ?? "";
    const innerHTML = match[3] ?? "";

    const attributes = parseAttributes(attributesStr);
    const content = cleanHtmlContent(innerHTML);

    elements.push({
      tag,
      attributes,
      content,
      innerHTML,
    });
  }

  return elements;
}

/**
 * Parse HTML attributes from attribute string
 */
function parseAttributes(attributesStr: string): Record<string, string> {
  const attributes: Record<string, string> = {};
  const attrRegex = /(\w+)="([^"]*)"/g;
  let match;

  while ((match = attrRegex.exec(attributesStr)) !== null) {
    if (match[1] && match[2] !== undefined) {
      attributes[match[1]] = match[2];
    }
  }

  return attributes;
}

/**
 * Clean HTML content by removing tags and normalizing whitespace
 */
export function cleanHtmlContent(html: string): string {
  return html
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/&nbsp;/g, " ") // Replace &nbsp; with space
    .replace(/&amp;/g, "&") // Replace &amp; with &
    .replace(/&lt;/g, "<") // Replace &lt; with <
    .replace(/&gt;/g, ">") // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/&#39;/g, "'") // Replace &#39; with '
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();
}

/**
 * Check if a URL is absolute
 */
export function isAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//.test(url);
}

/**
 * Convert relative URL to absolute URL
 */
export function toAbsoluteUrl(url: string, baseUrl: string): string {
  if (isAbsoluteUrl(url)) {
    return url;
  }

  if (url.startsWith("/")) {
    const base = new URL(baseUrl);
    return `${base.protocol}//${base.host}${url}`;
  }

  return new URL(url, baseUrl).href;
}
