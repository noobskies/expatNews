import { type ScrapingConfig } from "@/types/news";

export interface ScrapingResult {
  success: boolean;
  data?: ArticleData[];
  error?: string;
  retryAfter?: number;
}

export interface ArticleData {
  title: string;
  content: string;
  author?: string;
  publishedAt: Date;
  category?: string;
  url: string;
  sourceId: string;
}

export abstract class BaseScraper {
  protected config: ScrapingConfig;
  protected sourceId: string;
  protected baseUrl: string;
  private requestCount = 0;
  private lastRequestTime = 0;

  constructor(sourceId: string, baseUrl: string, config: ScrapingConfig) {
    this.sourceId = sourceId;
    this.baseUrl = baseUrl;
    this.config = config;
  }

  /**
   * Get a random user agent from the configured list
   */
  protected getRandomUserAgent(): string {
    const userAgents = this.config.userAgents;
    return userAgents[Math.floor(Math.random() * userAgents.length)]!;
  }

  /**
   * Calculate delay between requests based on configuration
   */
  protected getRequestDelay(): number {
    const { min, max } = this.config.requestDelay;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Enforce rate limiting based on configuration
   */
  protected async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const minDelay = this.getRequestDelay();

    if (timeSinceLastRequest < minDelay) {
      const waitTime = minDelay - timeSinceLastRequest;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    this.lastRequestTime = Date.now();
    this.requestCount++;
  }

  /**
   * Check if we're within rate limits
   */
  protected isWithinRateLimit(): boolean {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;

    // Reset counter if more than a minute has passed
    if (this.lastRequestTime < oneMinuteAgo) {
      this.requestCount = 0;
    }

    return this.requestCount < this.config.maxRequestsPerMinute;
  }

  /**
   * Make HTTP request with anti-detection measures
   */
  protected async makeRequest(
    url: string,
    options: RequestInit = {},
  ): Promise<Response> {
    if (!this.isWithinRateLimit()) {
      throw new Error("Rate limit exceeded");
    }

    await this.enforceRateLimit();

    const headers = {
      "User-Agent": this.getRandomUserAgent(),
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
      "Accept-Encoding": "gzip, deflate, br",
      DNT: "1",
      Connection: "keep-alive",
      "Upgrade-Insecure-Requests": "1",
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response;
  }

  /**
   * Extract text content from HTML using CSS selector
   */
  protected extractText(html: string, selector: string): string | null {
    // Simple regex-based extraction for now
    // In production, we'd use a proper HTML parser like cheerio
    const regex = new RegExp(
      `<[^>]*class="[^"]*${selector.replace(".", "")}[^"]*"[^>]*>([^<]*)</`,
      "i",
    );
    const match = html.match(regex);
    return match ? (match[1]?.trim() ?? null) : null;
  }

  /**
   * Check if content is geographically relevant
   */
  protected isGeographicallyRelevant(content: string): boolean {
    const { shanghai, beijing } = this.config.locationKeywords;
    const allKeywords = [...shanghai, ...beijing];

    return allKeywords.some((keyword) => content.includes(keyword));
  }

  /**
   * Retry logic with exponential backoff
   */
  protected async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = this.config.maxRetries,
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        if (attempt === maxRetries) {
          break;
        }

        const delay = this.config.retryDelay * Math.pow(2, attempt);
        console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  /**
   * Abstract method to be implemented by specific scrapers
   */
  abstract scrapeArticles(): Promise<ScrapingResult>;

  /**
   * Abstract method to scrape a specific article
   */
  abstract scrapeArticle(url: string): Promise<ArticleData | null>;
}
