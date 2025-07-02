import {
  BaseScraper,
  type ArticleData,
  type ScrapingResult,
} from "./base-scraper";
import { CHINESE_NEWS_SOURCES } from "@/constants/sources";
import {
  extractLinks,
  extractTextBySelector,
  toAbsoluteUrl,
  cleanHtmlContent,
} from "../utils/html-parser";

export class TencentNewsScraper extends BaseScraper {
  constructor() {
    const source = CHINESE_NEWS_SOURCES.TENCENT_NEWS;
    super(source.id, source.baseUrl, source.scrapingConfig);
  }

  /**
   * Scrape articles from Tencent News
   */
  async scrapeArticles(): Promise<ScrapingResult> {
    try {
      const articles = await this.withRetry(async () => {
        // Focus on Beijing section for expat relevance
        const beijingUrl = `${this.baseUrl}/d/bj`;
        console.log(`🌐 Fetching: ${beijingUrl}`);
        const response = await this.makeRequest(beijingUrl);
        const html = await response.text();

        return this.extractArticleUrls(html);
      });

      const scrapedArticles: ArticleData[] = [];

      // Process articles in batches to respect rate limits
      for (const articleUrl of articles.slice(0, 5)) {
        // Limit to 5 articles for initial implementation
        try {
          console.log(`📄 Scraping article: ${articleUrl}`);
          const article = await this.scrapeArticle(articleUrl);
          if (article) {
            if (this.isGeographicallyRelevant(article.content)) {
              console.log(
                `✅ Article is geographically relevant: ${article.title}`,
              );
              scrapedArticles.push(article);
            } else {
              console.log(
                `⏭️ Article not geographically relevant: ${article.title}`,
              );
            }
          }
        } catch (error) {
          console.error(`Failed to scrape article ${articleUrl}:`, error);
          // Continue with other articles
        }
      }

      return {
        success: true,
        data: scrapedArticles,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        retryAfter: this.config.retryDelay,
      };
    }
  }

  /**
   * Extract article URLs from the main page
   */
  private extractArticleUrls(html: string): string[] {
    console.log("🔍 Extracting article URLs from HTML...");

    // Extract all links from the page
    const allLinks = extractLinks(html);
    console.log(`Found ${allLinks.length} total links`);

    const articleUrls: string[] = [];

    for (const link of allLinks) {
      // Convert to absolute URL
      const absoluteUrl = toAbsoluteUrl(link, this.baseUrl);

      // Debug: log all URLs for inspection
      if (absoluteUrl.includes("qq.com")) {
        console.log(`🔗 QQ URL found: ${absoluteUrl}`);
      }

      // Filter for news articles
      if (this.isNewsArticleUrl(absoluteUrl)) {
        articleUrls.push(absoluteUrl);
      }
    }

    // Remove duplicates
    const uniqueUrls = [...new Set(articleUrls)];
    console.log(`Found ${uniqueUrls.length} potential article URLs`);

    // Log first few URLs for debugging
    if (uniqueUrls.length > 0) {
      console.log("Sample URLs:", uniqueUrls.slice(0, 3));
    }

    return uniqueUrls;
  }

  /**
   * Check if URL is likely a news article
   */
  private isNewsArticleUrl(url: string): boolean {
    // Updated Tencent News article URL patterns based on current structure
    const newsPatterns = [
      /news\.qq\.com\/rain\/a\/[A-Z0-9]+/, // Rain format: https://news.qq.com/rain/a/20250702A06KD400
      /news\.qq\.com\/rain\/a\/UTR\d+/, // UTR format: https://news.qq.com/rain/a/UTR2023082100085600
      /news\.qq\.com\/rain\/a\/\d{8}V[A-Z0-9]+/, // Video format: https://news.qq.com/rain/a/20250702V04F1K00
      /new\.qq\.com\/.*\/\d+\.html/, // Legacy format
      /news\.qq\.com\/.*\.htm/, // Legacy format
    ];

    const isNews = newsPatterns.some((pattern) => pattern.test(url));

    // Exclude common non-article URLs
    const excludePatterns = [
      /\/index\./,
      /\/login/,
      /\/register/,
      /\/search/,
      /\/category/,
      /\/tag/,
      /javascript:/,
      /mailto:/,
      /#$/,
      /\/d\/bj$/,
      /\/d\/$/,
      /\/omn\/author\//, // Author pages
      /\/static\//, // Static resources
      /\.css$/,
      /\.js$/,
      /\.png$/,
      /\.jpg$/,
      /\.gif$/,
    ];

    const shouldExclude = excludePatterns.some((pattern) => pattern.test(url));

    return isNews && !shouldExclude;
  }

  /**
   * Scrape a specific article
   */
  async scrapeArticle(url: string): Promise<ArticleData | null> {
    try {
      const response = await this.makeRequest(url);
      const html = await response.text();

      const title = this.extractTitle(html);
      const content = this.extractContent(html);
      const author = this.extractAuthor(html);
      const publishedAt = this.extractPublishedAt(html);
      const category = this.extractCategory(html);

      if (!title || !content) {
        console.warn(`Missing required fields for article: ${url}`);
        console.warn(
          `Title: ${title ? "✓" : "✗"}, Content: ${content ? "✓" : "✗"}`,
        );
        return null;
      }

      return {
        title,
        content,
        author: author ?? undefined,
        publishedAt: publishedAt ?? new Date(),
        category: category ?? undefined,
        url,
        sourceId: this.sourceId,
      };
    } catch (error) {
      console.error(`Error scraping article ${url}:`, error);
      return null;
    }
  }

  /**
   * Extract text content from HTML using CSS selector
   */
  protected extractText(html: string, selector: string): string | null {
    return extractTextBySelector(html, selector);
  }

  /**
   * Extract article title
   */
  private extractTitle(html: string): string | null {
    const selectors = this.config.selectors.title.split(", ");

    for (const selector of selectors) {
      const title = this.extractText(html, selector);
      if (title) return title;
    }

    // Fallback: look for common title patterns
    const titlePatterns = [/<title>([^<]+)</i, /<h1[^>]*>([^<]+)</i];

    for (const pattern of titlePatterns) {
      const match = html.match(pattern);
      if (match?.[1]) {
        return cleanHtmlContent(match[1]);
      }
    }

    return null;
  }

  /**
   * Extract article content
   */
  private extractContent(html: string): string | null {
    const selectors = this.config.selectors.content.split(", ");

    for (const selector of selectors) {
      const content = this.extractText(html, selector);
      if (content && content.length > 100) {
        // Ensure substantial content
        return content;
      }
    }

    // Fallback: look for paragraph content
    const paragraphs = html.match(/<p[^>]*>([^<]+)</gi);
    if (paragraphs && paragraphs.length > 2) {
      return paragraphs
        .map((p) => cleanHtmlContent(p))
        .filter((text) => text.length > 20)
        .join("\n\n");
    }

    return null;
  }

  /**
   * Extract article author
   */
  private extractAuthor(html: string): string | null {
    const selectors = this.config.selectors.author?.split(", ") ?? [];

    for (const selector of selectors) {
      const author = this.extractText(html, selector);
      if (author) return author;
    }

    return null;
  }

  /**
   * Extract publication date
   */
  private extractPublishedAt(html: string): Date | null {
    const selectors = this.config.selectors.publishedAt?.split(", ") ?? [];

    for (const selector of selectors) {
      const dateText = this.extractText(html, selector);
      if (dateText) {
        const date = this.parseChineseDate(dateText);
        if (date) return date;
      }
    }

    return null;
  }

  /**
   * Extract article category
   */
  private extractCategory(html: string): string | null {
    const selectors = this.config.selectors.category?.split(", ") ?? [];

    for (const selector of selectors) {
      const category = this.extractText(html, selector);
      if (category) return category;
    }

    return null;
  }

  /**
   * Parse Chinese date formats commonly used by Tencent News
   */
  private parseChineseDate(dateText: string): Date | null {
    try {
      // Common Chinese date patterns
      const patterns = [
        /(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})/, // 2024-01-15 14:30:00
        /(\d{4})年(\d{1,2})月(\d{1,2})日\s*(\d{1,2}):(\d{2})/, // 2024年1月15日 14:30
        /(\d{2})-(\d{2})\s+(\d{2}):(\d{2})/, // 01-15 14:30 (current year assumed)
      ];

      for (const pattern of patterns) {
        const match = dateText.match(pattern);
        if (match) {
          if (match.length >= 4) {
            const year = match[1]
              ? parseInt(match[1])
              : new Date().getFullYear();
            const month = parseInt(match[2] ?? "1") - 1; // JavaScript months are 0-indexed
            const day = parseInt(match[3] ?? "1");
            const hour = match[4] ? parseInt(match[4]) : 0;
            const minute = match[5] ? parseInt(match[5]) : 0;
            const second = match[6] ? parseInt(match[6]) : 0;

            return new Date(year, month, day, hour, minute, second);
          }
        }
      }

      // Fallback: try standard Date parsing
      const standardDate = new Date(dateText);
      if (!isNaN(standardDate.getTime())) {
        return standardDate;
      }
    } catch (error) {
      console.warn(`Failed to parse date: ${dateText}`, error);
    }

    return null;
  }
}
