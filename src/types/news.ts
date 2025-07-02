// News Article Types
export interface NewsArticle {
  id: string;
  title: string;
  titleEn?: string;
  content: string;
  contentEn?: string;
  excerpt?: string;
  sourceId: string;
  originalUrl: string;
  author?: string;
  publishedAt: Date;
  scrapedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  category?: string;
  categoryEn?: string;
  relevanceScore?: number;
  sentimentScore?: number;
  urgencyLevel: UrgencyLevel;
  isTranslated: boolean;
  isProcessed: boolean;
  isFeatured: boolean;
  isArchived: boolean;
  contentHash?: string;
}

// News Source Types
export interface NewsSource {
  id: string;
  name: string;
  nameEn: string;
  baseUrl: string;
  sourceType: SourceType;
  credibilityScore: number;
  isActive: boolean;
  scrapingConfig?: ScrapingConfig;
  lastScrapedAt?: Date;
  scrapingErrors: number;
  description?: string;
  language: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

// Social Metrics Types
export interface SocialMetrics {
  id: string;
  articleId: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  engagementRate: number;
  lastUpdated: Date;
}

// Location Types
export interface Location {
  id: string;
  name: string;
  nameEn: string;
  type: LocationType;
  latitude?: number;
  longitude?: number;
  parentId?: string;
  isActive: boolean;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArticleLocation {
  id: string;
  articleId: string;
  locationId: string;
  relevanceScore: number;
  detectionMethod: DetectionMethod;
  confidence: number;
  createdAt: Date;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  nameZh: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  priority: number;
  isActive: boolean;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Enums
export enum SourceType {
  CHINESE_NEWS = "CHINESE_NEWS",
  SOCIAL_MEDIA = "SOCIAL_MEDIA",
  INTERNATIONAL = "INTERNATIONAL",
  GOVERNMENT = "GOVERNMENT",
  BUSINESS = "BUSINESS",
}

export enum LocationType {
  COUNTRY = "COUNTRY",
  PROVINCE = "PROVINCE",
  CITY = "CITY",
  DISTRICT = "DISTRICT",
  LANDMARK = "LANDMARK",
}

export enum UrgencyLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum DetectionMethod {
  KEYWORD_MATCH = "KEYWORD_MATCH",
  NLP_EXTRACTION = "NLP_EXTRACTION",
  MANUAL_TAG = "MANUAL_TAG",
  SOURCE_TAG = "SOURCE_TAG",
}

// Scraping Configuration Types
export interface ScrapingConfig {
  // Anti-detection settings
  userAgents: string[];
  requestDelay: {
    min: number;
    max: number;
  };
  proxyRotation: boolean;

  // Content extraction settings
  selectors: {
    title: string;
    content: string;
    author?: string;
    publishedAt?: string;
    category?: string;
  };

  // Geographic filtering
  locationKeywords: {
    shanghai: string[];
    beijing: string[];
  };

  // Rate limiting
  maxRequestsPerMinute: number;
  maxConcurrentRequests: number;

  // Error handling
  maxRetries: number;
  retryDelay: number;
}

// Content Processing Types
export interface ContentProcessingResult {
  success: boolean;
  relevanceScore?: number;
  sentimentScore?: number;
  extractedLocations: ExtractedLocation[];
  translatedTitle?: string;
  translatedSummary?: string;
  categories: string[];
  errors?: string[];
}

export interface ExtractedLocation {
  name: string;
  nameEn: string;
  type: LocationType;
  confidence: number;
  detectionMethod: DetectionMethod;
  relevanceScore: number;
}

// API Response Types
export interface ScrapingResult {
  success: boolean;
  articlesFound: number;
  articlesProcessed: number;
  errors: ScrapingError[];
  source: string;
  timestamp: Date;
}

export interface ScrapingError {
  type: "NETWORK" | "PARSING" | "RATE_LIMIT" | "BLOCKED" | "UNKNOWN";
  message: string;
  url?: string;
  timestamp: Date;
}

// Expat Relevance Scoring
export interface RelevanceFactors {
  geographicRelevance: number; // 0-1 based on Shanghai/Beijing content
  categoryRelevance: number; // 0-1 based on expat-relevant categories
  socialEngagement: number; // 0-1 based on social metrics
  sourceCredibility: number; // 0-1 based on source reliability
  urgencyBoost: number; // Multiplier based on urgency level
  recencyBoost: number; // Multiplier based on article age
}

export interface RelevanceScore {
  overall: number; // Final 0-1 relevance score
  factors: RelevanceFactors;
  explanation: string; // Human-readable explanation
}
