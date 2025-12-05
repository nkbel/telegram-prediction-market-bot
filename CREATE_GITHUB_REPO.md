# Create GitHub Repository and Deploy

## Quick Steps:

### Option 1: Create Repo via GitHub Website (Easiest)

1. Go to https://github.com/new
2. Repository name: `telegram-prediction-market-bot`
3. Make it **Public** (or Private if you prefer)
4. **Don't** initialize with README
5. Click "Create repository"

### Option 2: Use GitHub CLI (If installed)

```powershell
gh repo create telegram-prediction-market-bot --public --source=. --remote=origin --push
```

### Then Push Your Code:

```powershell
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/telegram-prediction-market-bot.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### Then Deploy to Vercel:

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import from GitHub
4. Select your repository
5. Configure:
   - Root Directory: `webapp`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Deploy!

