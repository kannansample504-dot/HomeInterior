---
name: quick-push
description: Stage all changes, commit with auto-generated message, and push
user_invocable: true
---

# Quick Push

Fast-track commit and push for when changes are already reviewed.

## Steps

1. Run `git status --short` and `git diff --stat HEAD` to see what changed
2. Stage all relevant files (exclude `.env`, `__pycache__/`, `*.pyc`, `.~lock.*`)
3. Generate a concise commit message from the diff summary
4. Commit with Co-Authored-By trailer
5. Push to origin on the current branch
6. Report the commit hash and push status
