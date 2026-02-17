# Issue Template (AI Agent Optimized)

```markdown
## Title

### Branch
`type/short-description` (e.g., `fix/layout-redesign`, `feat/dark-mode`, `fix/canvas-overflow`)

### Why
1-2 sentences. Why this matters to the user/product — not what the code currently looks like.

### Files
- `path/to/file.tsx` — short description of what changes here
- `path/to/other.ts` — short description of what changes here

### Tasks
1. [ ] First task — do X in `file.tsx`. Be prescriptive, not suggestive
2. [ ] Second task — do Y in `other.ts`
3. [ ] Third task — do Z in `file.tsx` (depends on task 1)

### Acceptance Criteria
- [ ] `pnpm build` passes
- [ ] `pnpm lint` passes
- [ ] Concrete, verifiable condition (e.g., "no hardcoded widths remain in component")
- [ ] [Visual] Description of what to visually confirm

### Constraints
- Do NOT touch X
- Do NOT refactor Y
- Agent's discretion on [specific thing you don't care about]
```

## Guidelines

### Why this format works for AI agents
- **File paths are the highest-ROI context.** Pointing to specific files saves the most tokens and prevents the agent from wandering the codebase.
- **Ordered tasks with dependencies** prevent wrong-order bugs. Agents work sequentially — make the order explicit.
- **Programmatic acceptance criteria** (`pnpm build` passes, "no X remains in file Y") let the agent self-verify. Visual checks are fine but shouldn't be the only verification.
- **Constraints prevent scope creep.** Without them, agents tend to refactor adjacent code, add error handling, or install dependencies unprompted.

### Branch naming convention
Use `type/short-description` where type is one of: `feat`, `fix`, `refactor`, `chore`, `docs`. The agent should create this branch from `main`, do all work there, and PR back into `main`.

### Before starting work
The agent should always read `ISSUES.md` and check the current state of the files listed in the issue before making changes. Code may have changed since the issue was written — other issues may have been completed first, files may have been renamed, or logic may have moved. Never assume the issue description is a perfect snapshot of the current code.

### When writing new issues
Before writing an issue, the author (human or agent) must read the actual source files that will be affected. Issues should reference real line numbers, real class/function names, and real current behavior — not guesses. If a file has changed since the issue was drafted, update the issue before starting work.


### Principles
1. **Be prescriptive, not suggestive.** "Use `grid-cols-[1fr_300px]`" not "likely something like grid-cols". If you genuinely don't care, say "agent's discretion" explicitly.
2. **Skip the background narrative.** The agent can read every file instantly. Don't describe what the code currently looks like — just say why the change matters.
3. **One issue = one concern.** Agent adherence drops as instruction count rises. Split large specs into focused pieces.
4. **Tailor constraints per issue.** Each constraint should answer: "What will the agent be tempted to do here that I don't want?" General project rules belong in `CLAUDE.md`, not in individual issues.
5. **At least one programmatic check.** Every issue needs at least one acceptance criterion the agent can verify by running a command.
