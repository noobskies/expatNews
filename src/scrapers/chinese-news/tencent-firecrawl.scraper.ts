import {
  FirecrawlService,
  FirecrawlUtils,
} from "../services/firecrawl.service";
import type {
  NewsArticle,
  ScrapingResult,
  ScrapingError,
} from "../../types/news";
import { UrgencyLevel } from "../../types/news";

/**
 * Tencent News scraper using Firecrawl MCP service
 * Focuses on Beijing section and social engagement metrics
 */
export class TencentFirecrawlScraper {
  private static readonly BASE_URL = "https://news.qq.com";
  private static readonly BEIJING_SECTION_URL =
    "https://news.qq.com/ch/beijing/";
  private static readonly SOURCE_NAME = "Tencent News";

  /**
   * Scrape latest Beijing news from Tencent News
   */
  static async scrapeBeijingNews(limit = 10): Promise<ScrapingResult> {
    try {
      console.log("Starting Tencent News Beijing section scraping...");

      // First, discover article URLs in the Beijing section
      const articleUrls = await this.discoverBeijingArticles(limit);

      if (articleUrls.length === 0) {
        return {
          success: false,
          articlesFound: 0,
          articlesProcessed: 0,
          errors: [
            {
              type: "UNKNOWN",
              message: "No Beijing articles found",
              timestamp: new Date(),
            },
          ],
          source: this.SOURCE_NAME,
          timestamp: new Date(),
        };
      }

      console.log(`Found ${articleUrls.length} Beijing articles to scrape`);

      // Scrape articles in batches
      const scrapingResults = await FirecrawlService.scrapeMultipleUrls(
        articleUrls,
        {
          formats: ["markdown"],
          onlyMainContent: true,
          waitFor: 3000, // Tencent sites have dynamic content
          includeTags: [
            "article",
            "main",
            "h1",
            "h2",
            "h3",
            "time",
            ".content",
          ],
          excludeTags: [
            "nav",
            "footer",
            "aside",
            "script",
            "style",
            ".ad",
            ".advertisement",
            ".comment",
            ".related",
          ],
          maxAge: 1800000, // 30 minutes cache
        },
        3, // Batch size of 3 to be respectful
      );

      // Process scraped content into NewsArticle format
      const articles: NewsArticle[] = [];
      const errors: ScrapingError[] = [];

      for (const result of scrapingResults) {
        if (result.success && result.content) {
          try {
            const article = await this.parseArticle(result.url, result.content);
            if (article) {
              articles.push(article);
            }
          } catch (error) {
            console.error(`Failed to parse article ${result.url}:`, error);
            errors.push({
              type: "PARSING",
              message: `Parse error for ${result.url}: ${error instanceof Error ? error.message : "Unknown error"}`,
              url: result.url,
              timestamp: new Date(),
            });
          }
        } else {
          errors.push({
            type: "NETWORK",
            message: `Failed to scrape ${result.url}`,
            url: result.url,
            timestamp: new Date(),
          });
        }
      }

      return {
        success: articles.length > 0,
        articlesFound: articleUrls.length,
        articlesProcessed: articles.length,
        errors,
        source: this.SOURCE_NAME,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error("Tencent News scraping failed:", error);
      return {
        success: false,
        articlesFound: 0,
        articlesProcessed: 0,
        errors: [
          {
            type: "UNKNOWN",
            message:
              error instanceof Error ? error.message : "Unknown scraping error",
            timestamp: new Date(),
          },
        ],
        source: this.SOURCE_NAME,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Search for specific topics in Tencent News
   */
  static async searchTopics(query: string, limit = 5): Promise<ScrapingResult> {
    try {
      console.log(`Searching Tencent News for: ${query}`);

      // Use Firecrawl search to find relevant articles
      const searchResults = await FirecrawlService.searchContent(
        `site:news.qq.com ${query} Beijing Shanghai`,
        {
          limit,
          lang: "zh",
          country: "cn",
          scrapeOptions: {
            formats: ["markdown"],
            onlyMainContent: true,
          },
        },
      );

      const articles: NewsArticle[] = [];
      const errors: ScrapingError[] = [];

      for (const result of searchResults) {
        try {
          const article = await this.parseArticle(result.url, result.content);
          if (article) {
            articles.push(article);
          }
        } catch (error) {
          console.error(`Failed to parse search result ${result.url}:`, error);
          errors.push({
            type: "PARSING",
            message: `Parse error: ${error instanceof Error ? error.message : "Unknown error"}`,
            url: result.url,
            timestamp: new Date(),
          });
        }
      }

      return {
        success: articles.length > 0,
        articlesFound: searchResults.length,
        articlesProcessed: articles.length,
        errors,
        source: this.SOURCE_NAME,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error(`Tencent News search failed for "${query}":`, error);
      return {
        success: false,
        articlesFound: 0,
        articlesProcessed: 0,
        errors: [
          {
            type: "UNKNOWN",
            message: error instanceof Error ? error.message : "Search failed",
            timestamp: new Date(),
          },
        ],
        source: this.SOURCE_NAME,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Scrape a single Tencent News article
   */
  static async scrapeSingleArticle(url: string): Promise<NewsArticle | null> {
    try {
      if (!this.isValidTencentUrl(url)) {
        throw new Error("Invalid Tencent News URL");
      }

      const content = await FirecrawlService.scrapeUrl(url, {
        formats: ["markdown"],
        onlyMainContent: true,
        waitFor: 3000,
        includeTags: ["article", "main", "h1", "h2", "h3", "time", ".content"],
        excludeTags: [
          "nav",
          "footer",
          "aside",
          "script",
          "style",
          ".ad",
          ".advertisement",
          ".comment",
          ".related",
        ],
        maxAge: 1800000,
      });

      return await this.parseArticle(url, content);
    } catch (error) {
      console.error(`Failed to scrape Tencent article ${url}:`, error);
      return null;
    }
  }

  // Private helper methods

  private static async discoverBeijingArticles(
    limit: number,
  ): Promise<string[]> {
    try {
      // Map the Beijing section to discover article URLs
      const urls = await FirecrawlService.mapWebsite(this.BEIJING_SECTION_URL, {
        limit: limit * 2, // Get more URLs to filter from
      });

      // Filter for actual news articles
      const articleUrls = urls
        .filter((url) => this.isValidTencentUrl(url))
        .filter((url) => FirecrawlUtils.isNewsArticleUrl(url))
        .filter((url) => this.isBeijingRelated(url))
        .slice(0, limit);

      return articleUrls;
    } catch (error) {
      console.error("Failed to discover Beijing articles:", error);
      // Fallback: return some known Beijing article patterns
      return [];
    }
  }

  private static async parseArticle(
    url: string,
    content: string,
  ): Promise<NewsArticle | null> {
    try {
      // Extract basic article information
      const lines = content.split("\n").filter((line) => line.trim());

      // Find title (usually the first heading)
      const title = this.extractTitle(lines);
      if (!title) {
        console.warn(`No title found for article: ${url}`);
        return null;
      }

      // Extract content (everything after title, excluding metadata)
      const articleContent = this.extractContent(lines);
      if (!articleContent || articleContent.length < 100) {
        console.warn(`Insufficient content for article: ${url}`);
        return null;
      }

      // Extract metadata
      const publishDate = this.extractPublishDate(content);
      const author = this.extractAuthor(content);
      const tags = this.extractTags(content);

      // Determine location relevance
      const location = this.determineLocation(title, articleContent);
      const relevanceScore = this.calculateRelevanceScore(
        title,
        articleContent,
      );

      return {
        id: this.generateArticleId(url),
        title,
        content: articleContent,
        sourceId: "tencent-news", // Add required sourceId
        originalUrl: url,
        author: author ?? undefined,
        publishedAt: publishDate ?? new Date(), // Use current date if no publish date found
        scrapedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        relevanceScore,
        urgencyLevel: UrgencyLevel.MEDIUM, // Default urgency level
        isTranslated: false,
        isProcessed: false,
        isFeatured: false,
        isArchived: false,
        // Optional fields that match our extracted data
        excerpt: this.generateSummary(articleContent),
        category: location ?? undefined,
      };
    } catch (error) {
      console.error(`Failed to parse article content for ${url}:`, error);
      return null;
    }
  }

  private static isValidTencentUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return (
        urlObj.hostname.includes("qq.com") &&
        (url.includes("/a/") || url.includes("/news/"))
      );
    } catch {
      return false;
    }
  }

  private static isBeijingRelated(url: string): boolean {
    const beijingKeywords = ["beijing", "北京", "bj"];
    return beijingKeywords.some((keyword) =>
      url.toLowerCase().includes(keyword),
    );
  }

  private static extractTitle(lines: string[]): string | null {
    // Look for markdown heading or prominent text
    for (const line of lines) {
      if (line.startsWith("# ") && line.length > 3) {
        return line.replace("# ", "").trim();
      }
      if (line.startsWith("## ") && line.length > 4) {
        return line.replace("## ", "").trim();
      }
    }

    // Fallback: look for first substantial line
    for (const line of lines) {
      if (line.length > 10 && !line.includes("http") && !line.includes("@")) {
        return line.trim();
      }
    }

    return null;
  }

  private static extractContent(lines: string[]): string {
    // Skip title and metadata, extract main content
    let contentStarted = false;
    const contentLines: string[] = [];

    for (const line of lines) {
      // Skip initial metadata and navigation
      if (!contentStarted) {
        if (line.startsWith("# ") || line.startsWith("## ")) {
          contentStarted = true;
          continue;
        }
        if (line.length > 50 && !line.includes("http")) {
          contentStarted = true;
        }
      }

      if (contentStarted) {
        // Skip footer content and ads
        if (
          line.includes("版权") ||
          line.includes("转载") ||
          line.includes("广告") ||
          line.includes("推荐阅读")
        ) {
          break;
        }
        contentLines.push(line);
      }
    }

    return contentLines.join("\n").trim();
  }

  private static extractPublishDate(content: string): Date | null {
    // Look for Chinese date patterns
    const datePatterns = [
      /(\d{4})[年-](\d{1,2})[月-](\d{1,2})[日\s]/,
      /(\d{4})-(\d{2})-(\d{2})/,
      /(\d{2}):(\d{2})/,
    ];

    for (const pattern of datePatterns) {
      const match = pattern.exec(content);
      if (match) {
        try {
          if (match.length >= 4) {
            // Full date match
            const year = parseInt(match[1]!);
            const month = parseInt(match[2]!) - 1; // JS months are 0-indexed
            const day = parseInt(match[3]!);
            return new Date(year, month, day);
          }
        } catch {
          continue;
        }
      }
    }

    return null;
  }

  private static extractAuthor(content: string): string | null {
    const authorPatterns = [
      /(?:记者|作者|编辑)[:：]\s*([^\n\s]+)/,
      /文\/([^\n\s]+)/,
      /来源[:：]\s*([^\n]+)/,
    ];

    for (const pattern of authorPatterns) {
      const match = pattern.exec(content);
      if (match?.[1]) {
        return match[1].trim();
      }
    }

    return null;
  }

  private static extractTags(content: string): string[] {
    const tags: string[] = [];

    // Location tags
    if (content.includes("北京") || content.includes("Beijing")) {
      tags.push("Beijing");
    }
    if (content.includes("上海") || content.includes("Shanghai")) {
      tags.push("Shanghai");
    }

    // Topic tags based on content
    const topicKeywords = {
      政策: "Policy",
      经济: "Economy",
      社会: "Society",
      文化: "Culture",
      教育: "Education",
      医疗: "Healthcare",
      交通: "Transportation",
      环境: "Environment",
    };

    for (const [chinese, english] of Object.entries(topicKeywords)) {
      if (content.includes(chinese)) {
        tags.push(english);
      }
    }

    return tags;
  }

  private static determineLocation(
    title: string,
    content: string,
  ): string | null {
    const text = `${title} ${content}`.toLowerCase();

    if (text.includes("北京") || text.includes("beijing")) {
      return "Beijing";
    }
    if (text.includes("上海") || text.includes("shanghai")) {
      return "Shanghai";
    }

    return null;
  }

  private static calculateRelevanceScore(
    title: string,
    content: string,
  ): number {
    let score = 0;
    const text = `${title} ${content}`.toLowerCase();

    // Location relevance
    if (text.includes("北京") || text.includes("beijing")) score += 30;
    if (text.includes("上海") || text.includes("shanghai")) score += 30;

    // Expat-relevant topics
    const expatKeywords = [
      "外国人",
      "外籍",
      "国际",
      "签证",
      "居住证",
      "工作许可",
      "international",
      "foreign",
      "expat",
      "visa",
      "permit",
    ];

    for (const keyword of expatKeywords) {
      if (text.includes(keyword)) score += 20;
    }

    // Recent content bonus
    const now = new Date();
    const daysSincePublish = 1; // Would calculate from actual publish date
    if (daysSincePublish <= 1) score += 20;
    else if (daysSincePublish <= 7) score += 10;

    return Math.min(score, 100);
  }

  private static generateSummary(content: string): string {
    // Simple summary: first 200 characters of content
    const cleanContent = content.replace(/[#*\[\]]/g, "").trim();
    return cleanContent.length > 200
      ? cleanContent.substring(0, 200) + "..."
      : cleanContent;
  }

  private static extractSocialMetrics(content: string): Record<string, number> {
    // Extract social engagement metrics if available
    const metrics: Record<string, number> = {};

    // Look for view counts, likes, shares, etc.
    const patterns = {
      views: /(\d+)\s*(?:次浏览|阅读|views?)/i,
      likes: /(\d+)\s*(?:点赞|likes?|👍)/i,
      shares: /(\d+)\s*(?:分享|转发|shares?)/i,
      comments: /(\d+)\s*(?:评论|comments?)/i,
    };

    for (const [metric, pattern] of Object.entries(patterns)) {
      const match = pattern.exec(content);
      if (match?.[1]) {
        metrics[metric] = parseInt(match[1]);
      }
    }

    return metrics;
  }

  private static generateArticleId(url: string): string {
    // Generate consistent ID from URL
    const urlHash = Buffer.from(url).toString("base64").slice(0, 12);
    return `tencent_${urlHash}`;
  }
}
