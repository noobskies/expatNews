# Project Structure Standards - ExpatNews

## T3 Stack Conventions

### Next.js App Router Structure

- Use App Router (`/src/app/`) for all new routes
- Group related routes in folders with `page.tsx`, `layout.tsx`, `loading.tsx`
- Place API routes in `/src/app/api/` following RESTful conventions
- Use route groups `(auth)`, `(dashboard)` for organization without URL impact

### tRPC Organization

- Define procedures in `/src/server/api/routers/`
- Group related procedures by domain (news, scraping, ai, user)
- Use input validation with Zod schemas
- Export router types for client-side type safety
- Keep router files focused and under 200 lines

### Prisma Database Patterns

- Define models in single `schema.prisma` file
- Use descriptive model names: `NewsArticle`, `ScrapingSource`, `UserPreference`
- Implement proper relationships with foreign keys
- Add database indexes for frequently queried fields
- Use enums for fixed value sets (ArticleStatus, SourceType)

### Authentication with NextAuth

- Configure providers in `/src/server/auth/config.ts`
- Use session callbacks for custom user data
- Implement role-based access control where needed
- Protect API routes with authentication middleware

## ExpatNews Specific Structure

### Content Management

```
/src/
├── scrapers/           # Web scraping modules
│   ├── chinese-news/   # Chinese news site scrapers
│   ├── social-media/   # Weibo, Zhihu scrapers
│   └── reddit/         # Reddit API integration
├── ai-processing/      # OpenAI content analysis
│   ├── relevance/      # Content relevance scoring
│   ├── translation/    # Chinese-English processing
│   └── categorization/ # Content classification
├── content-management/ # Content workflow
│   ├── moderation/     # Content review system
│   ├── publishing/     # Publishing pipeline
│   └── analytics/      # Content performance
```

### Shared Resources

```
/src/
├── types/              # TypeScript type definitions
│   ├── news.ts         # News article types
│   ├── scraping.ts     # Scraping-related types
│   └── ai.ts           # AI processing types
├── utils/              # Utility functions
│   ├── chinese-text.ts # Chinese text processing
│   ├── date-helpers.ts # Date/time utilities
│   └── validation.ts   # Common validation schemas
├── constants/          # Application constants
│   ├── sources.ts      # News source configurations
│   ├── categories.ts   # Content categories
│   └── locations.ts    # Shanghai/Beijing data
```

### Component Organization

```
/src/components/
├── ui/                 # Base UI components (shadcn/ui)
├── shared/             # Reusable business components
│   ├── NewsCard/       # Article display component
│   ├── SourceBadge/    # Source credibility indicator
│   └── LocationFilter/ # Geographic filtering
├── features/           # Feature-specific components
│   ├── dashboard/      # Dashboard components
│   ├── content-feed/   # News feed components
│   └── admin/          # Admin panel components
```

## File Naming Conventions

### Component Files

- Use PascalCase for component files: `NewsCard.tsx`
- Include component name in folder: `/NewsCard/NewsCard.tsx`
- Add index file for clean imports: `/NewsCard/index.ts`
- Use descriptive names: `ChineseNewsSourceCard.tsx`

### Utility and Service Files

- Use kebab-case: `chinese-text-processor.ts`
- Include purpose in name: `weibo-scraper.service.ts`
- Group by domain: `/scrapers/sina-news.scraper.ts`

### Type Definition Files

- Use descriptive names: `news-article.types.ts`
- Export interfaces with clear names: `NewsArticle`, `ScrapingConfig`
- Group related types in single files

## Import/Export Patterns

### Absolute Imports

- Use `@/` alias for `/src/` directory
- Import from index files: `import { NewsCard } from '@/components/shared'`
- Avoid deep relative imports: `../../../utils/helpers`

### Export Patterns

- Use named exports for utilities and types
- Use default exports for React components
- Create index files for clean re-exports
- Export types alongside implementations

### Dependency Organization

```typescript
// External libraries
import { NextRequest } from "next/server";
import { z } from "zod";

// Internal modules
import { db } from "@/server/db";
import { NewsArticle } from "@/types/news";

// Relative imports (minimal use)
import "./styles.css";
```

## Configuration Management

### Environment Variables

- Define all variables in `.env.example`
- Use typed environment validation with `@t3-oss/env-nextjs`
- Group by service: `OPENAI_`, `REDIS_`, `DATABASE_`
- Document purpose and format in comments

### Service Configuration

- Centralize in `/src/config/` directory
- Create typed configuration objects
- Use environment-specific overrides
- Validate configuration at startup

### API Configuration

- Define base URLs and endpoints in constants
- Use configuration objects for scraping targets
- Implement retry and rate limiting configurations
- Document API requirements and limitations
