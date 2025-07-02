# Phase 2: Web Scraping Implementation Rules

## Anti-Detection First

- Implement proxy rotation before scraping any site
- Use realistic user agents and headers
- Add random delays between requests (2-10 seconds)
- Monitor for CAPTCHA challenges and IP blocks

## Scraper Architecture Standards

- One scraper class per news source
- Implement common interface: `NewsSourceScraper`
- Use dependency injection for HTTP clients and storage
- Include retry logic with exponential backoff
- Log all scraping attempts and results

## Chinese News Site Specifics

- Handle both simplified and traditional Chinese
- Parse publication dates in Chinese format
- Extract author information and credibility indicators
- Identify geographic tags (Shanghai/Beijing mentions)
- Handle multimedia content (images, videos)

## Data Quality Assurance

- Validate extracted content before storage
- Implement content deduplication logic
- Check for incomplete or corrupted articles
- Verify timestamp accuracy and timezone handling
- Flag suspicious or spam content

## Social Media Scraping Rules

- Use official APIs when available (Twitter, Reddit)
- For Weibo: focus on trending hashtags and verified accounts
- For Zhihu: prioritize high-quality answers with expert credentials
- Implement engagement metrics collection (likes, shares, comments)
- Handle different content types (text, images, polls, videos)

## Performance and Scalability

- Implement concurrent scraping with worker pools
- Use database connection pooling
- Cache frequently accessed data (source configurations)
- Monitor memory usage and prevent leaks
- Implement graceful shutdown for long-running scrapers

## Error Handling and Monitoring

- Log all errors with context (source, URL, timestamp)
- Implement alerting for scraping failures
- Track success rates per source
- Monitor content freshness and update frequency
- Create dashboards for scraping health metrics

## Testing Strategy

- Unit tests for each scraper component
- Integration tests with real (but limited) data
- Mock external services for reliable testing
- Test error scenarios and edge cases
- Performance tests for high-volume scraping

## Phase 2 Completion Criteria

- [ ] All 5 Chinese news sources have working scrapers
- [ ] Weibo trending topics scraper operational
- [ ] Zhihu content extraction working
- [ ] Reddit API integration complete
- [ ] Anti-detection measures implemented and tested
- [ ] Error handling and monitoring in place
- [ ] Performance benchmarks met
- [ ] Legal compliance verified
