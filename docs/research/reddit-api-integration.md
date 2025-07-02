# Reddit API Integration Research

## Overview

**Priority: HIGH** - Essential for capturing expat community perspectives and international discussions about China-related topics.

## Target Subreddits for Monitoring

### Primary Expat Communities

- **r/China** - General China discussions and news
- **r/shanghai** - Shanghai-specific content and local expat community
- **r/beijing** - Beijing-specific content and local expat community
- **r/chinalife** - Expat lifestyle discussions and practical advice
- **r/chinabusiness** - Business and economic discussions

### Secondary Communities

- **r/expats** - General expat discussions (China-related filtering needed)
- **r/teachinginchina** - Education sector expats
- **r/financialindependence** - Expat financial planning discussions
- **r/digitalnomad** - Remote work and travel in China

## API Technical Requirements

### Authentication

- **OAuth2 Required**: All API access must use OAuth2 authentication
- **Application Registration**: Must register app at https://www.reddit.com/prefs/apps
- **Client Credentials**: Need client_id and client_secret for authentication
- **User Agent**: Must use unique, descriptive User-Agent string

### Rate Limits

- **60 requests per minute** for OAuth2 authenticated clients
- **Rate Limit Headers**: Monitor X-Ratelimit-Used, X-Ratelimit-Remaining, X-Ratelimit-Reset
- **Batch Requests**: Prefer multiple resources per request over single-resource loops
- **Request Optimization**: Use pagination parameters (after/before, limit, count)

### API Access Rules

- **Unique User-Agent**: Must include platform, app ID, version, username
- **No User-Agent Spoofing**: Strictly prohibited, will result in ban
- **Respect robots.txt**: For search engines only, not API clients
- **Batch Operations**: Use /r/redditdev for guidance on batch APIs

## Content Extraction Strategy

### Post Monitoring

- **New Posts**: Monitor /r/{subreddit}/new for real-time content
- **Hot Posts**: Track /r/{subreddit}/hot for trending discussions
- **Top Posts**: Analyze /r/{subreddit}/top for high-engagement content
- **Search**: Use /r/{subreddit}/search for keyword-based filtering

### Comment Analysis

- **Thread Comments**: Extract full comment trees for context
- **Comment Scoring**: Use upvotes/downvotes for sentiment analysis
- **User Credibility**: Track user karma and account age
- **Nested Discussions**: Parse comment hierarchies for conversation flow

### Metadata Extraction

- **Post Data**: Title, content, author, timestamp, score, comments count
- **Geographic Tags**: Location mentions in titles/content
- **Flair Analysis**: Subreddit-specific categorization tags
- **Cross-posting**: Track content shared across multiple subreddits

## Expat Relevance Filtering

### High-Relevance Indicators

1. **Geographic Keywords**: Shanghai, Beijing, China, expat, foreigner
2. **Policy Topics**: Visa, immigration, work permit, residence permit
3. **Business Keywords**: Business license, tax, employment, investment
4. **Daily Life**: Housing, healthcare, education, transportation
5. **Cultural Topics**: Language learning, cultural differences, adaptation

### Content Categories

- **Immigration & Visas**: Policy changes, application processes, experiences
- **Business & Employment**: Job market, regulations, entrepreneurship
- **Daily Life**: Housing, healthcare, education, transportation
- **Cultural Integration**: Language, customs, social interactions
- **Safety & Security**: Health alerts, safety concerns, emergency information

## Implementation Architecture

### Data Collection Pipeline

1. **Authentication Service**: OAuth2 token management and refresh
2. **Subreddit Monitoring**: Real-time post and comment collection
3. **Content Filtering**: Keyword-based relevance scoring
4. **Data Normalization**: Standardize format across subreddits
5. **Deduplication**: Handle cross-posts and reposts

### Rate Limit Management

- **Request Queue**: Implement FIFO queue with rate limiting
- **Priority System**: Prioritize high-engagement content
- **Backoff Strategy**: Exponential backoff for rate limit violations
- **Monitoring Dashboard**: Track API usage and performance

### Content Processing

- **Relevance Scoring**: AI-based scoring for expat relevance (0-100)
- **Sentiment Analysis**: Community sentiment on topics
- **Trend Detection**: Identify emerging topics and concerns
- **Geographic Tagging**: Shanghai vs Beijing content classification

## Integration with Chinese Sources

### Cross-Reference Strategy

- **Topic Correlation**: Match Reddit discussions with Chinese news topics
- **Sentiment Comparison**: Expat vs domestic perspectives on same events
- **Information Gaps**: Identify stories discussed internationally but not domestically
- **Verification**: Use Reddit discussions to validate Chinese source content

### Content Enrichment

- **Context Addition**: Add expat community perspective to Chinese news
- **Translation Validation**: Community feedback on Chinese content translations
- **Cultural Explanation**: Expat interpretations of Chinese cultural topics
- **Practical Impact**: Real-world effects of policies on expat community

## Success Metrics

### Content Quality Indicators

- **Relevance Accuracy**: >85% of collected content relevant to expats
- **Geographic Precision**: >80% correct Shanghai/Beijing classification
- **Engagement Correlation**: High-engagement Reddit content matches trending topics
- **Update Frequency**: <15 minute delay from post to collection

### Technical Performance Metrics

- **API Success Rate**: >95% successful requests within rate limits
- **Content Freshness**: Real-time monitoring of active subreddits
- **Deduplication Accuracy**: <3% duplicate content in database
- **Rate Limit Compliance**: Zero rate limit violations

## Implementation Priority: HIGH

**Rationale**: Reddit provides the international expat perspective that complements Chinese domestic sources. The community-driven content offers real-world experiences and practical insights that official sources may not cover.

**Phase 2 Integration Strategy**:

1. **OAuth2 Setup**: Register application and implement authentication
2. **Subreddit Monitoring**: Start with r/shanghai, r/beijing, r/chinalife
3. **Content Filtering**: Implement keyword-based relevance scoring
4. **Cross-Reference System**: Connect Reddit discussions with Chinese news topics

## Technical Implementation Steps

### Phase 2 Development

1. **Reddit API Client**: Build OAuth2-authenticated API wrapper
2. **Subreddit Scrapers**: Implement real-time post/comment monitoring
3. **Content Processor**: Relevance scoring and geographic tagging
4. **Database Integration**: Store Reddit content with Chinese news correlation

### Rate Limit Optimization

- **Request Batching**: Combine multiple subreddit requests
- **Intelligent Polling**: Adjust frequency based on subreddit activity
- **Priority Queue**: Focus on high-engagement content first
- **Caching Strategy**: Reduce redundant API calls

### Content Quality Assurance

- **Spam Filtering**: Remove promotional and irrelevant content
- **User Verification**: Track credible community members
- **Content Validation**: Cross-reference with multiple sources
- **Community Moderation**: Respect subreddit rules and guidelines

---

**Research completed**: 2025-07-02 15:17  
**Implementation phase**: Phase 2 - Web Scraping Implementation  
**Integration priority**: Parallel with Chinese source implementation
