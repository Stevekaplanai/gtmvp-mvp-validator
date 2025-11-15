# 🚀 Deploy to Vercel - Quick Guide

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Name: `gtmvp-mvp-validator`
3. Description: `AI-Powered MVP Validation Platform`
4. **Public** repository
5. **DO NOT** check "Initialize with README"
6. Click **Create repository**

## Step 2: Push Code

```bash
# Replace YOUR-USERNAME with your GitHub username
git remote add origin https://github.com/YOUR-USERNAME/gtmvp-mvp-validator.git
git push -u origin master
```

## Step 3: Deploy to Vercel

1. Go to https://vercel.com/new
2. Import `gtmvp-mvp-validator`
3. Add environment variables (see below)
4. Click **Deploy**

## Required Environment Variables

Add these in Vercel → Settings → Environment Variables:

```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
CLAUDE_MODEL=claude-haiku-4-5-20251001
OPENAI_API_KEY=your_openai_api_key_here
NOTION_API_KEY=your_notion_integration_token_here
NOTION_WORKSPACE_ID=your_notion_workspace_id_here
```

Done! Your app will be live at: `https://gtmvp-mvp-validator.vercel.app`
