# Phase 1: Content Strategy & Sources Setup Rules

## Research-First Approach

- Document all findings before implementing
- Create `/docs/research/` directory for API documentation
- Test API endpoints manually before writing scrapers
- Record rate limits, authentication requirements, and data structures

## Chinese News Sources Priority

- Focus on the big 5: 新浪新闻, 腾讯新闻, 网易新闻, 今日头条, 澎湃新闻
- Document each source's:
  - RSS feeds availability
  - API endpoints (if any)
  - Content structure and metadata
  - Geographic tagging capabilities
  - Update frequency patterns

## Social Media Integration Planning

- Start with 微博 (Weibo) trending topics - highest impact
- Document 知乎 (Zhihu) API limitations and alternatives
- Map out content types: text, images, videos, polls
- Identify key accounts to monitor for each platform

## Reddit API Setup

- Use official Reddit API (not scraping)
- Focus on expat-relevant subreddits first
- Document rate limits and authentication flow
- Plan for real-time vs batch processing

## Database Schema Design

- Start with core entities: Article, Source, User
- Plan for multilingual content (Chinese + English)
- Design for geographic tagging (Shanghai/Beijing focus)
- Include metadata for AI processing results

## Proof of Concept Requirements

- Each integration should have a working demo
- Test with real data, not mock data
- Validate data quality and completeness
- Document any blockers or limitations discovered

## Phase 1 Completion Checklist

- [ ] All 5 Chinese news sources researched and documented
- [ ] Weibo trending topics integration working
- [ ] Reddit API integration functional
- [ ] Database schema supports all planned features
- [ ] Basic data flow from source to storage working
- [ ] Documentation complete for Phase 2 handoff
