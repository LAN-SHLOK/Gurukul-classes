# 🚀 GitHub Setup Commands

## Step 1: Initialize Git Repository

```bash
# Navigate to your project directory
cd gurukul-nextjs

# Initialize git repository (if not already done)
git init

# Add all files to staging
git add .

# Create initial commit
git commit -m "🎉 Initial commit: Gurukul Classes educational platform

✨ Features:
- Complete educational platform with admin panel
- Student registration and dashboard
- Faculty management and career portal
- Contact system with email notifications
- Real-time updates and AI search
- Responsive design with animations
- Next.js 14, TypeScript, MongoDB integration

🚀 Ready for production deployment"
```

## Step 2: Create GitHub Repository

### Option A: Using GitHub CLI (Recommended)
```bash
# Install GitHub CLI if not installed
# Windows: winget install GitHub.cli
# Mac: brew install gh
# Linux: sudo apt install gh

# Login to GitHub
gh auth login

# Create repository and push
gh repo create gurukul-nextjs --public --description "🎓 Gurukul Classes - Premium Educational Platform for JEE & NEET Coaching" --homepage "https://gurukul-classes.vercel.app"

# Set remote and push
git remote add origin https://github.com/YOUR_USERNAME/gurukul-nextjs.git
git branch -M main
git push -u origin main
```

### Option B: Manual GitHub Setup
1. Go to [github.com](https://github.com)
2. Click "New Repository"
3. Repository name: `gurukul-nextjs`
4. Description: `🎓 Gurukul Classes - Premium Educational Platform for JEE & NEET Coaching`
5. Make it Public
6. Don't initialize with README (we already have one)
7. Click "Create Repository"

Then run:
```bash
# Add remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/gurukul-nextjs.git

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 3: Verify Upload

```bash
# Check remote connection
git remote -v

# Check status
git status

# View commit history
git log --oneline
```

## Step 4: Create Branches (Optional)

```bash
# Create development branch
git checkout -b development
git push -u origin development

# Create feature branch example
git checkout -b feature/new-feature
git push -u origin feature/new-feature

# Switch back to main
git checkout main
```

## Step 5: Set Up Repository Settings

### On GitHub.com:
1. Go to your repository
2. Click "Settings" tab
3. Scroll to "Pages" section
4. Set source to "Deploy from a branch"
5. Select "main" branch
6. Add topics: `education`, `nextjs`, `typescript`, `coaching`, `jee`, `neet`
7. Add website URL when deployed

## Step 6: Future Updates

```bash
# Add changes
git add .

# Commit with descriptive message
git commit -m "✨ Add new feature: [description]"

# Push to GitHub
git push origin main
```

## Step 7: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (run from project root)
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: gurukul-nextjs
# - Directory: ./
# - Override settings? No
```

## Common Git Commands

```bash
# Check status
git status

# Add specific files
git add filename.js

# Add all files
git add .

# Commit changes
git commit -m "Your commit message"

# Push changes
git push

# Pull latest changes
git pull

# Create new branch
git checkout -b branch-name

# Switch branches
git checkout branch-name

# Merge branch to main
git checkout main
git merge branch-name

# Delete branch
git branch -d branch-name
```

## Repository Structure After Push

```
gurukul-nextjs/
├── 📁 src/                    # Source code
├── 📁 public/                 # Static assets
├── 📁 ai-service/             # AI service
├── 📄 README.md               # Project overview ✅
├── 📄 LICENSE.md              # MIT License ✅
├── 📄 CHANGELOG.md            # Version history ✅
├── 📄 package.json            # Dependencies
├── 📄 next.config.js          # Next.js config
├── 📄 tailwind.config.js      # Tailwind config
├── 📄 .gitignore              # Git ignore rules ✅
└── 📄 .env.local.example      # Environment template
```

## Excluded Files (in .gitignore)

- ❌ All test files (`*.test.js`, `__tests__/`)
- ❌ Development docs (`QUICKSTART.md`, `DEPLOYMENT_GUIDE.md`)
- ❌ Kiro folders (`.kiro/`)
- ❌ Environment files (`.env.local`)
- ❌ Node modules (`node_modules/`)
- ❌ Build files (`.next/`)
- ❌ Cache files

## ✅ Ready to Push!

Your repository will contain only the essential files:
- ✅ Source code
- ✅ README.md (project overview)
- ✅ LICENSE.md (MIT license)
- ✅ CHANGELOG.md (version history)
- ✅ Configuration files
- ✅ Package.json

Run the commands above to push to GitHub! 🚀