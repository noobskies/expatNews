import { SourceType, type ScrapingConfig } from "@/types/news";

// Chinese News Sources Configuration
export const CHINESE_NEWS_SOURCES = {
  SINA_NEWS: {
    id: "sina-news",
    name: "新浪新闻",
    nameEn: "Sina News",
    baseUrl: "https://news.sina.com.cn",
    sourceType: SourceType.CHINESE_NEWS,
    credibilityScore: 85,
    description:
      "Major Chinese news portal with trending topics and comprehensive coverage",
    scrapingConfig: {
      userAgents: [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      ],
      requestDelay: { min: 2000, max: 5000 },
      proxyRotation: true,
      selectors: {
        title: ".main-title, h1, .news-title",
        content: ".article-content, .news-content, .main-content",
        author: ".author, .news-author",
        publishedAt: ".time, .publish-time, .news-time",
        category: ".category, .news-category",
      },
      locationKeywords: {
        shanghai: [
          "上海",
          "沪",
          "浦东",
          "黄浦",
          "徐汇",
          "长宁",
          "静安",
          "普陀",
          "虹口",
          "杨浦",
        ],
        beijing: [
          "北京",
          "京",
          "朝阳",
          "海淀",
          "丰台",
          "石景山",
          "门头沟",
          "房山",
          "通州",
          "顺义",
        ],
      },
      maxRequestsPerMinute: 30,
      maxConcurrentRequests: 3,
      maxRetries: 3,
      retryDelay: 5000,
    } as ScrapingConfig,
  },

  TENCENT_NEWS: {
    id: "tencent-news",
    name: "腾讯新闻",
    nameEn: "Tencent News",
    baseUrl: "https://news.qq.com",
    sourceType: SourceType.CHINESE_NEWS,
    credibilityScore: 88,
    description:
      "Tencent's news platform with social engagement metrics and Beijing section",
    scrapingConfig: {
      userAgents: [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
      ],
      requestDelay: { min: 3000, max: 7000 },
      proxyRotation: true,
      selectors: {
        title: ".LEFT h1, .article-title, .news-title",
        content: ".Cnt-Main-Article-QQ, .content, .article-content",
        author: ".author, .article-author",
        publishedAt: ".a_time, .publish-time",
        category: ".channel, .category",
      },
      locationKeywords: {
        shanghai: [
          "上海",
          "沪",
          "浦东",
          "黄浦",
          "徐汇",
          "长宁",
          "静安",
          "普陀",
          "虹口",
          "杨浦",
        ],
        beijing: [
          "北京",
          "京",
          "朝阳",
          "海淀",
          "丰台",
          "石景山",
          "门头沟",
          "房山",
          "通州",
          "顺义",
        ],
      },
      maxRequestsPerMinute: 25,
      maxConcurrentRequests: 2,
      maxRetries: 3,
      retryDelay: 6000,
    } as ScrapingConfig,
  },

  NETEASE_NEWS: {
    id: "netease-news",
    name: "网易新闻",
    nameEn: "NetEase News",
    baseUrl: "https://news.163.com",
    sourceType: SourceType.CHINESE_NEWS,
    credibilityScore: 82,
    description:
      "NetEase news with focus on editorial quality and comprehensive categories",
    scrapingConfig: {
      userAgents: [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      ],
      requestDelay: { min: 1500, max: 4000 },
      proxyRotation: false, // NetEase has more traditional structure
      selectors: {
        title: ".post_title h1, .article-title, h1",
        content: ".post_body, .post_text, .article-content",
        author: ".ep-source, .author",
        publishedAt: ".post_time_source, .publish-time",
        category: ".nav_path, .category",
      },
      locationKeywords: {
        shanghai: [
          "上海",
          "沪",
          "浦东",
          "黄浦",
          "徐汇",
          "长宁",
          "静安",
          "普陀",
          "虹口",
          "杨浦",
        ],
        beijing: [
          "北京",
          "京",
          "朝阳",
          "海淀",
          "丰台",
          "石景山",
          "门头沟",
          "房山",
          "通州",
          "顺义",
        ],
      },
      maxRequestsPerMinute: 40,
      maxConcurrentRequests: 4,
      maxRetries: 2,
      retryDelay: 3000,
    } as ScrapingConfig,
  },

  TOUTIAO: {
    id: "toutiao",
    name: "今日头条",
    nameEn: "Toutiao",
    baseUrl: "https://www.toutiao.com",
    sourceType: SourceType.CHINESE_NEWS,
    credibilityScore: 75,
    description:
      "AI-curated trending topics and personalized news recommendations",
    scrapingConfig: {
      userAgents: [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
      ],
      requestDelay: { min: 4000, max: 8000 },
      proxyRotation: true,
      selectors: {
        title: ".article-title, h1",
        content: ".article-content, .content",
        author: ".author-name, .author",
        publishedAt: ".time, .publish-time",
        category: ".category, .channel",
      },
      locationKeywords: {
        shanghai: [
          "上海",
          "沪",
          "浦东",
          "黄浦",
          "徐汇",
          "长宁",
          "静安",
          "普陀",
          "虹口",
          "杨浦",
        ],
        beijing: [
          "北京",
          "京",
          "朝阳",
          "海淀",
          "丰台",
          "石景山",
          "门头沟",
          "房山",
          "通州",
          "顺义",
        ],
      },
      maxRequestsPerMinute: 20,
      maxConcurrentRequests: 2,
      maxRetries: 4,
      retryDelay: 8000,
    } as ScrapingConfig,
  },

  THE_PAPER: {
    id: "the-paper",
    name: "澎湃新闻",
    nameEn: "The Paper",
    baseUrl: "https://www.thepaper.cn",
    sourceType: SourceType.CHINESE_NEWS,
    credibilityScore: 90,
    description: "High-quality investigative journalism and policy analysis",
    scrapingConfig: {
      userAgents: [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      ],
      requestDelay: { min: 3000, max: 6000 },
      proxyRotation: true,
      selectors: {
        title: ".news_title h1, .article-title",
        content: ".news_txt, .article-content",
        author: ".news_about .author, .author",
        publishedAt: ".news_about .time, .publish-time",
        category: ".channel, .category",
      },
      locationKeywords: {
        shanghai: [
          "上海",
          "沪",
          "浦东",
          "黄浦",
          "徐汇",
          "长宁",
          "静安",
          "普陀",
          "虹口",
          "杨浦",
        ],
        beijing: [
          "北京",
          "京",
          "朝阳",
          "海淀",
          "丰台",
          "石景山",
          "门头沟",
          "房山",
          "通州",
          "顺义",
        ],
      },
      maxRequestsPerMinute: 15,
      maxConcurrentRequests: 2,
      maxRetries: 3,
      retryDelay: 7000,
    } as ScrapingConfig,
  },
} as const;

// Social Media Sources
export const SOCIAL_MEDIA_SOURCES = {
  WEIBO: {
    id: "weibo",
    name: "微博",
    nameEn: "Weibo",
    baseUrl: "https://weibo.com",
    sourceType: SourceType.SOCIAL_MEDIA,
    credibilityScore: 70,
    description:
      "Chinese microblogging platform with trending topics and real-time discussions",
  },

  ZHIHU: {
    id: "zhihu",
    name: "知乎",
    nameEn: "Zhihu",
    baseUrl: "https://www.zhihu.com",
    sourceType: SourceType.SOCIAL_MEDIA,
    credibilityScore: 78,
    description:
      "Chinese Q&A platform with professional analysis and expert opinions",
  },
} as const;

// International Sources
export const INTERNATIONAL_SOURCES = {
  REDDIT_CHINA: {
    id: "reddit-china",
    name: "Reddit - China Communities",
    nameEn: "Reddit China",
    baseUrl: "https://www.reddit.com",
    sourceType: SourceType.INTERNATIONAL,
    credibilityScore: 65,
    description: "Reddit communities discussing China-related topics",
    subreddits: ["China", "shanghai", "beijing", "chinalife", "chinabusiness"],
  },
} as const;

// All sources combined
export const ALL_SOURCES = {
  ...CHINESE_NEWS_SOURCES,
  ...SOCIAL_MEDIA_SOURCES,
  ...INTERNATIONAL_SOURCES,
} as const;

// Source priority for scraping
export const SCRAPING_PRIORITY = [
  "tencent-news", // High priority - Beijing section + social metrics
  "sina-news", // High priority - trending topics + broad coverage
  "netease-news", // Medium-high priority - editorial quality
  "the-paper", // Medium priority - investigative journalism
  "toutiao", // Medium priority - AI-curated content
  "weibo", // Low priority - social media monitoring
  "zhihu", // Low priority - expert opinions
  "reddit-china", // Low priority - expat discussions
] as const;
