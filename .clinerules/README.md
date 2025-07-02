# ExpatNews Cline Rules System

This directory contains the active Cline rules for the ExpatNews project. These rules enforce DRY principles, organization standards, and bite-size workload management.

## Active Rules Structure

### Core Rules (Always Active)

- `01-core-principles.md` - DRY enforcement, organization standards, code quality
- `02-bite-size-workflow.md` - Task breakdown, incremental development, progress tracking
- `03-project-structure.md` - T3 stack conventions, file organization, naming patterns

### Context-Specific Rules

- `current-phase.md` - Active phase focus and priorities (update when switching phases)

## Rules Bank System

The `clinerules-bank/` directory contains inactive rules that can be activated as needed:

### Phase-Specific Rules

```
clinerules-bank/phases/
├── phase1-content-strategy.md  # Research-first approach, API documentation
├── phase2-scraping.md          # Anti-detection, scraper architecture
├── phase3-ai-filtering.md      # OpenAI integration, content analysis
└── phase4-frontend.md          # UI components, user experience
```

### Component-Specific Rules

```
clinerules-bank/components/
├── database-rules.md           # Prisma patterns, query optimization
├── api-rules.md               # tRPC procedures, validation
└── frontend-rules.md          # React components, state management
```

### Context Rules

```
clinerules-bank/contexts/
├── debugging-mode.md          # Debugging-focused development
└── refactoring-mode.md        # Code cleanup and optimization
```

## How to Switch Contexts

### Activate Phase-Specific Rules

When moving to a new phase, copy the relevant rules from the bank:

```bash
# Switch to Phase 2 (Scraping Implementation)
cp clinerules-bank/phases/phase2-scraping.md .clinerules/
# Update current phase
# Edit .clinerules/current-phase.md to reflect Phase 2 priorities
```

### Activate Component Rules

When working on specific components:

```bash
# Working on database schema
cp clinerules-bank/components/database-rules.md .clinerules/

# Working on API development
cp clinerules-bank/components/api-rules.md .clinerules/
```

### Deactivate Rules

Remove rules that are no longer relevant:

```bash
# Remove phase-specific rules when switching phases
rm .clinerules/phase1-content-strategy.md
```

## Rule Management Best Practices

### Keep Active Rules Focused

- Only activate rules relevant to current work
- Maximum 5-6 active rule files to avoid overwhelming Cline
- Regularly review and deactivate unused rules

### Update Current Phase

- Always update `current-phase.md` when switching phases
- Include specific tasks and success criteria
- Reference the main TODO.md for detailed task breakdown

### Document Context Switches

- Note why specific rules were activated/deactivated
- Update project documentation when changing focus areas
- Maintain consistency across team members

## Rule Effectiveness

### Core Principles Enforcement

- DRY violations should be caught early
- File organization should be consistent
- Code quality standards maintained

### Bite-Size Workflow

- Tasks broken into 30-minute chunks
- Clear progress tracking and documentation
- Incremental development with frequent commits

### Phase-Specific Focus

- Avoid premature optimization
- Stay focused on current phase objectives
- Document discoveries for future phases

## Troubleshooting

### Rules Not Being Followed

- Check if rules are too vague or conflicting
- Ensure active rules are relevant to current task
- Consider breaking complex rules into smaller, specific guidelines

### Context Switching Issues

- Verify current-phase.md reflects actual work
- Remove outdated phase-specific rules
- Ensure component rules match current development area

### Performance Issues

- Limit active rules to essential ones only
- Move detailed specifications to the rules bank
- Keep rule files focused and concise

## Contributing to Rules

### Adding New Rules

1. Create rule file in appropriate `clinerules-bank/` subdirectory
2. Test effectiveness with small tasks
3. Document when and why to use the rule
4. Update this README with usage instructions

### Modifying Existing Rules

1. Edit rules based on actual development experience
2. Keep changes focused and specific
3. Test changes with real development tasks
4. Document rationale for changes

### Rule Validation

- Rules should be actionable and specific
- Avoid conflicting or contradictory guidelines
- Test rules with actual development scenarios
- Gather feedback from development sessions
