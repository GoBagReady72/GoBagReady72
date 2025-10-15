#!/usr/bin/env bash
set -euo pipefail

echo "=== Ready72 Git Prep ==="

# Helpers
has_cmd() { command -v "$1" >/dev/null 2>&1; }

if ! has_cmd git; then
  echo "Error: git is not installed or not in PATH." >&2
  exit 1
fi

# Ensure we're in a project directory (has package.json or src/ as a hint)
if [ ! -f "package.json" ] && [ ! -d "src" ]; then
  echo "Warning: This doesn't look like a typical project folder (no package.json or src/)."
  read -r -p "Continue anyway? [y/N] " cont
  cont=${cont:-N}
  if [[ ! "$cont" =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
  fi
fi

# Ask for repo URL if not provided as arg
REPO_URL="${1:-}"
if [ -z "$REPO_URL" ]; then
  read -r -p "Enter your GitHub repo URL (e.g., https://github.com/you/repo.git): " REPO_URL
fi
if [ -z "$REPO_URL" ]; then
  echo "Error: Repo URL is required." >&2
  exit 1
fi

# Branch, tag, and commit message (with sensible defaults)
read -r -p "Branch name [main]: " BRANCH
BRANCH=${BRANCH:-main}

read -r -p "Tag name (optional, e.g., admin-v0.1-clean): " TAGNAME
TAGNAME=${TAGNAME:-}

read -r -p "Commit message [Initial import]: " COMMIT_MSG
COMMIT_MSG=${COMMIT_MSG:-Initial import}

# Initialize repo if needed
if [ ! -d ".git" ]; then
  echo "→ Initializing new Git repository..."
  git init
else
  echo "→ Existing Git repository detected."
fi

# Set branch
echo "→ Setting branch: $BRANCH"
git checkout -B "$BRANCH"

# Stage files
echo "→ Staging files..."
git add -A

# Commit (only if there is something to commit)
if git diff --cached --quiet; then
  echo "→ No changes to commit (index is clean)."
else
  echo "→ Committing: $COMMIT_MSG"
  git commit -m "$COMMIT_MSG"
fi

# Set remote origin (create or update)
if git remote get-url origin >/dev/null 2>&1; then
  CURRENT_URL="$(git remote get-url origin)"
  if [ "$CURRENT_URL" != "$REPO_URL" ]; then
    echo "→ Updating remote 'origin' from $CURRENT_URL to $REPO_URL"
    git remote set-url origin "$REPO_URL"
  else
    echo "→ Remote 'origin' already set."
  fi
else
  echo "→ Adding remote 'origin' → $REPO_URL"
  git remote add origin "$REPO_URL"
fi

# Push branch
echo "→ Pushing branch to origin/$BRANCH (setting upstream)"
git push -u origin "$BRANCH"

# Create and push tag (if provided)
if [ -n "$TAGNAME" ]; then
  if git rev-parse "$TAGNAME" >/dev/null 2>&1; then
    echo "→ Tag '$TAGNAME' already exists locally. Skipping create."
  else
    echo "→ Creating tag: $TAGNAME"
    git tag -a "$TAGNAME" -m "$COMMIT_MSG"
  fi
  echo "→ Pushing tag: $TAGNAME"
  git push origin "$TAGNAME"
else
  echo "→ No tag provided. Skipping tag creation."
fi

cat <<EOF

✅ Done.

Next steps:
- Verify on GitHub: $REPO_URL
- On Vercel: Import this repo as a new project, set Framework: Vite, build: "vite build", output: "dist".
- (Optional) Enable Vercel Authentication for this project to restrict access to team members.

Tip: You can re-run this script later with:
  ./git-prep.sh https://github.com/you/repo.git

EOF
