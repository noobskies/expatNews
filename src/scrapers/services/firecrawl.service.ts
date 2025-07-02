import { z } from "zod";

// Firecrawl response schemas for type safety
const FirecrawlScrapeResponseSchema = z.object({
  content: z.array(
    z.object({
      type: z.string(),
      text: z.string(),
    }),
  ),
  isError: z.boolean().optional(),
});

const FirecrawlSearchResponseSchema = z.object({
  content: z.array(
    z.object({
      type: z.string(),
      text: z.string(),
    }),
  ),
  isError: z.boolean().optional(),
});

const FirecrawlMapResponseSchema = z.object({
  content: z.array(
    z.object({
      type: z.string(),
      text: z.string(),
    }),
  ),
  isError: z.boolean().optional(),
});

export type FirecrawlScrapeResponse = z.infer<
  typeof FirecrawlScrapeResponseSchema
>;
export type FirecrawlSearchResponse = z.infer<
  typeof FirecrawlSearchResponseSchema
>;
export type FirecrawlMapResponse = z.infer<typeof FirecrawlMapResponseSchema>;

// Configuration for different scraping scenarios
export interface FirecrawlScrapeOptions {
  formats?: string[];
  onlyMainContent?: boolean;
  waitFor?: number;
  timeout?: number;
  includeTags?: string[];
  excludeTags?: string[];
  maxAge?: number; // For caching - 500% faster scrapes
}

export interface FirecrawlSearchOptions {
  limit?: number;
  lang?: string;
  country?: string;
  scrapeOptions?: {
    formats?: string[];
    onlyMainContent?: boolean;
  };
}

export interface FirecrawlMapOptions {
  search?: string;
  limit?: number;
  includeSubdomains?: boolean;
}

/**
 * Centralized service for Firecrawl MCP operations
 * Handles all web scraping needs for ExpatNews project
 */
export class FirecrawlService {
  private static readonly DEFAULT_SCRAPE_OPTIONS: FirecrawlScrapeOptions = {
    formats: ["markdown"],
    onlyMainContent: true,
    waitFor: 2000, // Wait for dynamic content
    timeout: 30000,
    excludeTags: ["nav", "footer", "aside", "script", "style"],
    maxAge: 3600000, // 1 hour cache for performance
  };

  private static readonly DEFAULT_SEARCH_OPTIONS: FirecrawlSearchOptions = {
    limit: 10,
    lang: "zh", // Chinese content
    country: "cn",
    scrapeOptions: {
      formats: ["markdown"],
      onlyMainContent: true,
    },
  };

  /**
   * Scrape a single URL with optimized settings for Chinese news sites
   */
  static async scrapeUrl(
    url: string,
    options: FirecrawlScrapeOptions = {},
  ): Promise<string> {
    const mergedOptions = { ...this.DEFAULT_SCRAPE_OPTIONS, ...options };

    try {
      // Note: In actual implementation, this would use the MCP tool
      // For now, we'll structure it to be easily replaceable
      const response = await this.callFirecrawlScrape(url, mergedOptions);

      if (response.isError) {
        throw new Error(`Firecrawl scraping failed for ${url}`);
      }

      // Extract markdown content from response
      const content = response.content
        .filter((item) => item.type === "text")
        .map((item) => item.text)
        .join("\n");

      return this.cleanContent(content);
    } catch (error) {
      console.error(`Failed to scrape ${url}:`, error);
      throw new Error(
        `Scraping failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * Search for content across Chinese news sites
   */
  static async searchContent(
    query: string,
    options: FirecrawlSearchOptions = {},
  ): Promise<Array<{ url: string; title: string; content: string }>> {
    const mergedOptions = { ...this.DEFAULT_SEARCH_OPTIONS, ...options };

    try {
      const response = await this.callFirecrawlSearch(query, mergedOptions);

      if (response.isError) {
        throw new Error(`Firecrawl search failed for query: ${query}`);
      }

      // Parse search results
      return this.parseSearchResults(response.content);
    } catch (error) {
      console.error(`Failed to search for "${query}":`, error);
      throw new Error(
        `Search failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * Discover URLs on a website (useful for finding article links)
   */
  static async mapWebsite(
    baseUrl: string,
    options: FirecrawlMapOptions = {},
  ): Promise<string[]> {
    try {
      const response = await this.callFirecrawlMap(baseUrl, options);

      if (response.isError) {
        throw new Error(`Firecrawl mapping failed for ${baseUrl}`);
      }

      // Extract URLs from response
      return this.parseMapResults(response.content);
    } catch (error) {
      console.error(`Failed to map ${baseUrl}:`, error);
      throw new Error(
        `Mapping failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * Specialized method for scraping Chinese news articles
   */
  static async scrapeChineseNewsArticle(url: string): Promise<{
    title: string;
    content: string;
    publishDate?: string;
    author?: string;
    tags?: string[];
  }> {
    const options: FirecrawlScrapeOptions = {
      formats: ["markdown"],
      onlyMainContent: true,
      waitFor: 3000, // Chinese sites often have more dynamic content
      includeTags: ["article", "main", "h1", "h2", "h3", "time"],
      excludeTags: [
        "nav",
        "footer",
        "aside",
        "script",
        "style",
        "ad",
        "advertisement",
      ],
      maxAge: 1800000, // 30 minutes cache for news content
    };

    const content = await this.scrapeUrl(url, options);
    return this.parseNewsArticle(content, url);
  }

  /**
   * Batch scraping for multiple URLs with rate limiting
   */
  static async scrapeMultipleUrls(
    urls: string[],
    options: FirecrawlScrapeOptions = {},
    batchSize = 5,
  ): Promise<Array<{ url: string; content: string; success: boolean }>> {
    const results: Array<{ url: string; content: string; success: boolean }> =
      [];

    // Process in batches to avoid overwhelming the service
    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      const batchPromises = batch.map(async (url) => {
        try {
          const content = await this.scrapeUrl(url, options);
          return { url, content, success: true };
        } catch (error) {
          console.error(`Failed to scrape ${url}:`, error);
          return { url, content: "", success: false };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Add delay between batches to be respectful
      if (i + batchSize < urls.length) {
        await this.delay(2000);
      }
    }

    return results;
  }

  // Private helper methods

  private static async callFirecrawlScrape(
    url: string,
    options: FirecrawlScrapeOptions,
  ): Promise<FirecrawlScrapeResponse> {
    // This will be replaced with actual MCP tool call
    // For now, return a mock structure
    throw new Error(
      "MCP tool integration needed - replace with actual use_mcp_tool call",
    );
  }

  private static async callFirecrawlSearch(
    query: string,
    options: FirecrawlSearchOptions,
  ): Promise<FirecrawlSearchResponse> {
    // This will be replaced with actual MCP tool call
    throw new Error(
      "MCP tool integration needed - replace with actual use_mcp_tool call",
    );
  }

  private static async callFirecrawlMap(
    url: string,
    options: FirecrawlMapOptions,
  ): Promise<FirecrawlMapResponse> {
    // This will be replaced with actual MCP tool call
    throw new Error(
      "MCP tool integration needed - replace with actual use_mcp_tool call",
    );
  }

  private static cleanContent(content: string): string {
    // Remove excessive whitespace and clean up markdown
    return content
      .replace(/\n{3,}/g, "\n\n") // Reduce multiple newlines
      .replace(/\s+$/gm, "") // Remove trailing whitespace
      .trim();
  }

  private static parseSearchResults(
    content: Array<{ type: string; text: string }>,
  ): Array<{ url: string; title: string; content: string }> {
    // Parse search results from Firecrawl response
    // This would need to be implemented based on actual response format
    return [];
  }

  private static parseMapResults(
    content: Array<{ type: string; text: string }>,
  ): string[] {
    // Parse URL list from Firecrawl map response
    // This would need to be implemented based on actual response format
    return [];
  }

  private static parseNewsArticle(
    content: string,
    url: string,
  ): {
    title: string;
    content: string;
    publishDate?: string;
    author?: string;
    tags?: string[];
  } {
    // Extract structured data from news article content
    const lines = content.split("\n");
    const title =
      lines.find((line) => line.startsWith("# "))?.replace("# ", "") ?? "";

    // Basic parsing - would be enhanced based on actual content structure
    return {
      title,
      content: content,
      publishDate: this.extractDate(content),
      author: this.extractAuthor(content),
      tags: this.extractTags(content),
    };
  }

  private static extractDate(content: string): string | undefined {
    // Extract publication date from content
    const dateRegex = /(\d{4}[-年]\d{1,2}[-月]\d{1,2}[日]?)/;
    const match = dateRegex.exec(content);
    return match?.[1];
  }

  private static extractAuthor(content: string): string | undefined {
    // Extract author information
    const authorRegex = /(?:作者|记者|编辑)[:：]\s*([^\n]+)/;
    const match = authorRegex.exec(content);
    return match?.[1]?.trim();
  }

  private static extractTags(content: string): string[] {
    // Extract tags or categories
    const tagRegex = /(?:标签|分类|关键词)[:：]\s*([^\n]+)/;
    const match = tagRegex.exec(content);
    return match?.[1]?.split(/[,，\s]+/).filter(Boolean) ?? [];
  }

  private static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Utility functions for common scraping patterns
export const FirecrawlUtils = {
  /**
   * Check if a URL is likely a news article
   */
  isNewsArticleUrl(url: string): boolean {
    const newsPatterns = [
      /\/news\//,
      /\/article\//,
      /\/\d{4}\/\d{2}\/\d{2}\//,
      /\.html$/,
      /\/[a-z0-9-]+\.shtml$/,
    ];
    return newsPatterns.some((pattern) => pattern.test(url));
  },

  /**
   * Extract domain from URL for source identification
   */
  extractDomain(url: string): string {
    try {
      return new URL(url).hostname;
    } catch {
      return "";
    }
  },

  /**
   * Generate cache key for content
   */
  generateCacheKey(url: string, options: FirecrawlScrapeOptions): string {
    const optionsHash = JSON.stringify(options);
    return `firecrawl:${url}:${Buffer.from(optionsHash).toString("base64")}`;
  },
};
