# Core Development Principles - ExpatNews

## DRY (Don't Repeat Yourself) Enforcement

### Code Reusability

- Extract common functionality into utility functions in `/src/utils/`
- Create reusable components in `/src/components/shared/`
- Use TypeScript interfaces and types in `/src/types/` for shared data structures
- Implement shared constants in `/src/constants/`

### Configuration Management

- Centralize all configuration in `/src/config/`
- Use environment variables for all external service configurations
- Create typed configuration objects rather than scattered string literals
- Maintain single source of truth for API endpoints, scraping targets, etc.

### Database Schema Consistency

- Use Prisma schema as single source of truth for data models
- Generate TypeScript types from Prisma schema
- Avoid duplicating validation logic between client and server
- Use shared Zod schemas for validation across API boundaries

## Organization Standards

### File Structure Conventions

- Group related functionality in feature-based directories
- Use consistent naming: `kebab-case` for files, `PascalCase` for components
- Separate concerns: `/scrapers/`, `/ai-processing/`, `/content-management/`
- Keep utility functions pure and testable

### Import Organization

- Group imports: external libraries → internal modules → relative imports
- Use absolute imports with path aliases (@/ for src/)
- Avoid deep relative imports (../../..)
- Export from index files for cleaner imports

### Component Architecture

- Single responsibility per component/function
- Compose complex functionality from smaller, focused pieces
- Use custom hooks for shared stateful logic
- Separate presentation from business logic

## Code Quality Standards

### TypeScript Usage

- Strict mode enabled - no `any` types without explicit justification
- Use discriminated unions for complex state management
- Leverage type inference where possible, explicit types where clarity needed
- Create custom type guards for runtime type checking

### Error Handling

- Use Result/Either pattern for operations that can fail
- Centralized error logging and monitoring
- Graceful degradation for non-critical failures
- Clear error messages with actionable information

### Performance Considerations

- Implement caching at appropriate layers (Redis, in-memory, CDN)
- Use database indexes for frequently queried fields
- Batch operations where possible (scraping, AI processing)
- Monitor and optimize expensive operations

## Documentation Requirements

### Code Documentation

- JSDoc comments for all public functions and complex logic
- README files for each major module/feature
- Inline comments for business logic and complex algorithms
- API documentation using OpenAPI/Swagger

### Decision Records

- Document architectural decisions in `/docs/adr/`
- Record rationale for technology choices
- Maintain changelog for breaking changes
- Update TODO.md with completed items and new discoveries
