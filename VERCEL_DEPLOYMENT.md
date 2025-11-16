# 🚀 Vercel Deployment Guide for ideas.gtmvp.com

## Quick Deploy Steps

### 1. Deploy to Vercel

#### Option A: One-Click Deploy (Fastest)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Stevekaplanai/gtmvp-mvp-validator)

#### Option B: Manual Deploy

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import repository: `Stevekaplanai/gtmvp-mvp-validator`
3. Configure project:
   - **Project Name**: `gtmvp-ideas`
   - **Framework**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next` (auto-detected)

### 2. Set Environment Variables

Add these in **Project Settings > Environment Variables**:

#### Required Variables:
```bash
ANTHROPIC_API_KEY=sk-ant-xxxxx
CLAUDE_MODEL=claude-3-5-haiku-20241022
NEXT_PUBLIC_APP_NAME=GTMVP Ideas Validator
NEXT_PUBLIC_APP_URL=https://ideas.gtmvp.com
```

#### Optional (for enhanced features):
```bash
# Enable/disable features
ENABLE_MVP_VALIDATOR=true
ENABLE_KNOWLEDGE_CHATBOT=true
ENABLE_REAL_TIME_RESEARCH=false

# MCP Servers (optional)
REDDIT_MCP_ENABLED=false
GITHUB_MCP_ENABLED=false
CONTEXT7_MCP_ENABLED=false
YOUTUBE_MCP_ENABLED=false
NOTION_MCP_ENABLED=false

# Notion (if enabled)
NOTION_API_KEY=secret_xxxxx
NOTION_WORKSPACE_ID=xxxxx

# GitHub (if enabled)
GITHUB_TOKEN=ghp_xxxxx

# Vector DB (for RAG knowledge base)
VECTOR_DB_PROVIDER=local
```

### 3. Configure Custom Domain

#### In Vercel Dashboard:

1. Go to your project **Settings > Domains**
2. Click **"Add Domain"**
3. Enter: `ideas.gtmvp.com`
4. Vercel will provide DNS records

#### DNS Configuration (at your domain provider):

Add these DNS records for `gtmvp.com`:

**CNAME Record:**
```
Type: CNAME
Name: ideas
Value: cname.vercel-dns.com
TTL: 3600 (or Auto)
```

**Alternative A Record (if CNAME not supported):**
```
Type: A
Name: ideas
Value: 76.76.21.21
TTL: 3600
```

#### Verification:

1. Wait 5-10 minutes for DNS propagation
2. Vercel will auto-verify the domain
3. SSL certificate will be auto-provisioned
4. Your app will be live at `https://ideas.gtmvp.com`

### 4. Deploy

Click **"Deploy"** in Vercel dashboard

The build process will:
- Install dependencies
- Build Next.js app
- Deploy to edge network
- Configure SSL
- Go live at `ideas.gtmvp.com`

## 🔄 Automatic Deployments

Once connected, Vercel will automatically deploy:
- **Production**: Every push to `main` branch → `ideas.gtmvp.com`
- **Preview**: Every PR or branch → unique preview URL

## 📊 Environment-Specific Settings

### Production (ideas.gtmvp.com)
```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://ideas.gtmvp.com
```

### Development (localhost)
```bash
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🔐 Security Checklist

- ✅ Environment variables stored in Vercel (not in code)
- ✅ API keys never committed to Git
- ✅ SSL certificate auto-provisioned
- ✅ HTTPS enforced
- ✅ `.env.local` in `.gitignore`

## 🎯 Post-Deployment Verification

After deployment, test:

1. **Main Page**: `https://ideas.gtmvp.com`
2. **Validator**: Submit an idea and test validation
3. **Engagement Features**: Validate an idea → click "View Engagement Features"
4. **Demo Page**: `https://ideas.gtmvp.com/engagement-demo`
5. **Knowledge Chat**: Test the "Ask About GTMVP" tab

## 🐛 Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Ensure `package.json` scripts are correct

### Domain Not Working
- Verify DNS records are correct
- Wait 5-10 minutes for DNS propagation
- Check domain status in Vercel dashboard
- Use `nslookup ideas.gtmvp.com` to verify DNS

### API Errors
- Verify `ANTHROPIC_API_KEY` is set correctly
- Check API key has sufficient credits
- Review function logs in Vercel dashboard

### 404 Errors
- Check `vercel.json` rewrites configuration
- Verify routes exist in `app/` directory

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review environment variables
3. Test locally first with `npm run build && npm start`
4. Contact Vercel support via dashboard

## 🚀 Next Steps

After successful deployment:
1. Test all engagement features
2. Monitor performance in Vercel Analytics
3. Set up custom error pages
4. Configure caching strategies
5. Add monitoring/logging (optional)

---

**Repository**: https://github.com/Stevekaplanai/gtmvp-mvp-validator
**Vercel Dashboard**: https://vercel.com/dashboard
**Domain**: https://ideas.gtmvp.com
