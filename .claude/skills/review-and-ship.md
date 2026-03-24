---
name: review-and-ship
description: Run full code review, fix all issues, update plan.md, commit, and push
user_invocable: true
---

# Review and Ship

Run a full code review of the current working tree, fix all issues found, then ship.

## Steps

### 1. Code Review
- Run `git diff HEAD --stat` to identify all changed files
- Read CLAUDE.md for project rules
- Review all changes for:
  - Bugs (logic errors, runtime failures, security issues)
  - CLAUDE.md compliance (design tokens, no borders, architecture rules, naming conventions)
  - Missing migrations or untracked files that should be committed

### 2. Fix All Issues
- Apply fixes for every issue found
- Run tests to verify nothing is broken:
  - Django: `cd backend-django && source venv/bin/activate && python manage.py test apps.users apps.authentication apps.estimates apps.cms apps.pricing`
  - Frontend: `cd frontend && npx vitest run`

### 3. Update plan.md
- Append a dated changelog entry to the `## Changelog` section in `plan.md`
- Include: what was reviewed, number of issues found, summary of fixes applied

### 4. Commit and Push
- `git add` all changed files (src, tests, migrations, plan.md, CLAUDE.md)
- Do NOT add: `.env`, `node_modules/`, `__pycache__/`, `*.pyc`, lock files unless they changed
- Commit with a descriptive message summarizing all changes
- `git push origin` to the current branch

## Important
- Do NOT ask for confirmation at any step — execute the full pipeline
- If tests fail after fixes, debug and fix before committing
- Always include the Co-Authored-By trailer in the commit
