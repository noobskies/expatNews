# Bite-Size Workload Management - ExpatNews

## Task Breakdown Principles

### Maximum Task Duration

- Break all work into 30-minute maximum chunks
- If a task takes longer than 30 minutes, decompose it further
- Create clear entry and exit criteria for each chunk
- Document progress and next steps after each session

### Incremental Development

- Implement one feature/component at a time
- Test each increment before moving to the next
- Commit working code frequently (every 15-30 minutes)
- Each commit should represent a complete, testable unit of work

### Task Prioritization

- Focus on high-impact, low-effort tasks first
- Complete one TODO item fully before starting another
- Avoid context switching between different phases
- Maintain a "current focus" file to track active work

## Implementation Strategy

### Feature Development Approach

- Start with the simplest possible implementation
- Add complexity incrementally
- Validate each step with tests or manual verification
- Document assumptions and decisions as you go

### Code Review Readiness

- Each commit should be reviewable in isolation
- Include clear commit messages explaining the "why"
- Add inline comments for complex business logic
- Update relevant documentation with each change

### Testing Strategy

- Write tests for each new function/component
- Test edge cases as you discover them
- Use TDD when appropriate for complex logic
- Maintain test coverage above 80%

## Progress Tracking

### Daily Workflow

- Start each session by reviewing current TODO phase
- Pick the next smallest, most impactful task
- Set a 30-minute timer for focused work
- Document what was completed and what's next
- Update TODO.md with progress and discoveries

### Session Documentation

- Create brief notes in `/docs/progress/` for each work session
- Include what was learned, what worked, what didn't
- Note any blockers or dependencies discovered
- Update estimates for remaining work

### Milestone Management

- Break each TODO phase into weekly milestones
- Define clear success criteria for each milestone
- Review and adjust scope based on actual progress
- Celebrate completed milestones before moving forward

## Context Switching Rules

### Single Focus Principle

- Work on only one TODO phase at a time
- Complete current task before investigating new ideas
- Use a "parking lot" document for ideas that arise during work
- Resist the urge to "quickly fix" unrelated issues

### Clean Handoffs

- Always leave code in a working state
- Document current state and next steps clearly
- Commit or stash work-in-progress appropriately
- Update project status before switching contexts

### Interruption Management

- If interrupted, immediately document current state
- Note exactly where you left off and what you were thinking
- Set a clear plan for resuming work
- Use TODO comments in code for quick context restoration

## Quality Gates

### Definition of Done

- Feature works as intended
- Tests pass and coverage maintained
- Documentation updated
- Code reviewed (self-review minimum)
- No obvious performance issues
- Error handling implemented

### Before Moving to Next Task

- Current task fully complete and tested
- All related files saved and committed
- Documentation updated
- Next task clearly defined
- Any blockers or dependencies noted

### Phase Completion Criteria

- All tasks in current phase completed
- Integration tests passing
- Performance benchmarks met
- Documentation comprehensive
- Ready for user testing/feedback
