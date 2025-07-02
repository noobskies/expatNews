# Database Design and Management Rules - ExpatNews

## Prisma Schema Standards

### Model Naming Conventions

- Use PascalCase for model names: `NewsArticle`, `ScrapingSource`
- Use descriptive names that reflect business domain
- Avoid abbreviations unless widely understood
- Include the entity type in compound names: `UserPreference`, `ContentCategory`

### Field Design Patterns

- Use `id` as primary key with `@id @default(cuid())`
- Include `createdAt` and `updatedAt` for all entities
- Use enums for fixed value sets: `ArticleStatus`, `SourceType`, `LocationTag`
- Store URLs as `String` with validation, not custom URL type

### Relationship Patterns

- Use explicit foreign key fields: `authorId String` with `author User @relation(...)`
- Implement cascade deletes carefully - prefer `SetNull` for most cases
- Use many-to-many through explicit junction tables for complex relationships
- Add indexes on foreign keys and frequently queried fields

### Chinese Content Handling

- Store original Chinese text in separate fields: `titleChinese`, `contentChinese`
- Use UTF-8 encoding for all text fields
- Include language detection metadata: `detectedLanguage String?`
- Store translation metadata: `translatedBy`, `translationConfidence`

## Query Optimization

### Index Strategy

- Add `@@index([field])` for single-field queries
- Use compound indexes for multi-field queries: `@@index([sourceId, publishedAt])`
- Index foreign keys automatically with relationships
- Monitor query performance and add indexes as needed

### Pagination Patterns

- Use cursor-based pagination for large datasets
- Implement `take` and `skip` with reasonable defaults
- Include total count only when necessary (expensive operation)
- Use `orderBy` consistently for predictable results

### Data Loading Strategies

- Use `include` for related data that's always needed
- Use `select` to limit fields when only specific data is required
- Implement data loaders for N+1 query prevention
- Cache frequently accessed reference data

## Content Storage Patterns

### Article Content Structure

```prisma
model NewsArticle {
  id              String   @id @default(cuid())
  title           String
  titleChinese    String?
  content         String   @db.Text
  contentChinese  String?  @db.Text
  summary         String?
  publishedAt     DateTime
  scrapedAt       DateTime @default(now())
  sourceUrl       String
  imageUrl        String?

  // Geographic relevance
  locationTags    LocationTag[]
  relevanceScore  Float?

  // AI processing results
  aiProcessed     Boolean  @default(false)
  relevanceScore  Float?
  categories      ContentCategory[]

  // Relationships
  source          ScrapingSource @relation(fields: [sourceId], references: [id])
  sourceId        String

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([sourceId, publishedAt])
  @@index([locationTags])
  @@index([aiProcessed])
}
```

### Source Management

- Track source reliability and credibility scores
- Store rate limiting information per source
- Include last successful scrape timestamp
- Maintain source-specific configuration (headers, delays, etc.)

## Data Integrity Rules

### Validation at Database Level

- Use Prisma validators for basic constraints
- Implement custom validation in tRPC procedures
- Validate URLs, dates, and enum values
- Check for required relationships before deletion

### Deduplication Strategy

- Create unique constraints on natural keys where possible
- Implement content fingerprinting for duplicate detection
- Use `upsert` operations for idempotent data insertion
- Store original source URLs to track content propagation

### Data Cleanup Policies

- Archive old articles after 1 year (configurable)
- Clean up failed scraping attempts after 30 days
- Maintain audit logs for data modifications
- Implement soft deletes for user-generated content

## Performance Monitoring

### Query Performance

- Log slow queries (>100ms) in development
- Monitor database connection pool usage
- Track most expensive queries in production
- Set up alerts for query timeout issues

### Storage Management

- Monitor database size growth
- Implement data archiving for old content
- Compress large text fields where appropriate
- Plan for horizontal scaling when needed

## Migration Best Practices

### Schema Changes

- Always create reversible migrations
- Test migrations on production-like data
- Plan for zero-downtime deployments
- Document breaking changes and migration steps

### Data Migrations

- Use Prisma seed scripts for reference data
- Implement data transformation scripts separately
- Validate data integrity after migrations
- Keep migration scripts in version control
