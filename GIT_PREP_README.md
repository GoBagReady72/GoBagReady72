# Ready72 Git Prep Helper

This script initializes a Git repo (if needed), commits your files, sets the remote, pushes the branch, and optionally creates & pushes a tag.

## Usage

1) Place `git-prep.sh` in your project root (where `package.json` or `src/` lives).
2) Make it executable:
```bash
chmod +x git-prep.sh
```
3) Run it and follow prompts:
```bash
./git-prep.sh https://github.com/<your-user>/<repo>.git
```
- Branch defaults to `main` (you can change it).
- You can provide a tag name (e.g., `admin-v0.1-clean`) when prompted.

## What it does
- `git init` (if not already a repo)
- `git checkout -B <branch>`
- `git add -A && git commit -m "<message>"` (only if there are changes)
- `git remote add/set-url origin <repo-url>`
- `git push -u origin <branch>`
- (Optional) `git tag -a <tag>` and `git push origin <tag>`

