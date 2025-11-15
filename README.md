# GTMVP MVP Validator

**The World's Smartest MVP Validation Platform** - AI-powered idea validation with real-time market research.

![GTMVP MVP Validator](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)
![Claude AI](https://img.shields.io/badge/Powered%20by-Claude%20AI-5865F2?style=for-the-badge)

## 🎯 What is This?

GTMVP MVP Validator is a dual-interface AI system that:

1. **Smart MVP Validator**: Ask pointed questions about your idea, then conduct real-time research across Reddit, GitHub, YouTube, and technical docs to generate a comprehensive validation scorecard (0-100) with:
   - Market Demand Analysis
   - Competition Assessment
   - Technical Feasibility Review
   - Market Timing Evaluation

2. **GTMVP Knowledge Chatbot**: Answer questions about GTMVP services, pricing, case studies, and technical capabilities using RAG-powered knowledge base.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Anthropic API key ([Get one here](https://console.anthropic.com/))

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd gtmvp-software

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🔧 Environment Variables

Required:
```env
ANTHROPIC_API_KEY=sk-ant-xxxxx  # Your Claude API key
CLAUDE_MODEL=claude-3-5-haiku-20241022  # Fast, cost-effective model
```

Optional (for advanced features):
```env
# MCP Server Integrations
REDDIT_MCP_ENABLED=false
GITHUB_MCP_ENABLED=false
CONTEXT7_MCP_ENABLED=false
YOUTUBE_MCP_ENABLED=false
NOTION_MCP_ENABLED=false

# Vector Database for RAG
VECTOR_DB_PROVIDER=local
```

## 📁 Project Structure

```
gtmvp-software/
├── app/
│   ├── api/
│   │   ├── chat/           # Claude API integration
│   │   └── validate/       # MVP validation endpoint
│   ├── components/         # Reusable UI components
│   ├── validator/          # MVP Validator chat interface
│   ├── chatbot/            # GTMVP Knowledge chatbot
│   └── page.tsx            # Main landing page
├── lib/
│   ├── claude/             # Claude API client
│   ├── mcp/                # MCP server integrations (future)
│   ├── scoring/            # Scoring algorithm (future)
│   ├── rag/                # RAG system (future)
│   └── types/              # TypeScript types
└── public/                 # Static assets
```

## 🎨 Features

### Current (MVP)
- ✅ Dual-interface chat system (Validator + Knowledge)
- ✅ Dark theme matching gtmvp.com
- ✅ Claude 3.5 Haiku integration
- ✅ Dynamic branching conversation flow
- ✅ 4-dimension scoring framework
- ✅ Responsive design
- ✅ Real-time chat interface

### Coming Soon
- 🔜 Real-time MCP research (Reddit, GitHub, Context7, YouTube)
- 🔜 Knowledge base ingestion from GitHub repos
- 🔜 Notion workspace integration
- 🔜 RAG-powered chatbot responses
- 🔜 Scorecard visualization
- 🔜 Shareable results pages
- 🔜 Email/SMS notifications

## 🧪 Testing

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Playwright Testing (Coming Soon)
```bash
# Install Playwright
npx playwright install

# Run tests
npm run test
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub:
```bash
git init
git add .
git commit -m "Initial commit: GTMVP MVP Validator"
git remote add origin <your-repo-url>
git push -u origin main
```

2. Deploy to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables (ANTHROPIC_API_KEY)
   - Deploy!

3. Configure custom domain (mvp.gtmvp.com):
   - Go to your Vercel project settings
   - Add custom domain: `mvp.gtmvp.com`
   - Update DNS records as instructed

## 🔐 API Keys

### Claude API (Required)
1. Sign up at [console.anthropic.com](https://console.anthropic.com/)
2. Create an API key
3. Add to `.env.local`: `ANTHROPIC_API_KEY=sk-ant-xxxxx`

### Cost Estimate
- **Claude 3.5 Haiku**: ~$0.001 per validation (ultra-cheap!)
- Expected: $5-10/month for moderate usage

## 🛠️ MCP Server Setup (Optional)

To enable real-time research features:

1. **Reddit MCP**: Install and configure Reddit MCP server
2. **GitHub MCP**: Already configured via GitHub PAT
3. **Context7 MCP**: For technical documentation
4. **YouTube Transcript MCP**: For trend analysis
5. **Notion MCP**: For knowledge base ingestion

See `docs/MCP_SETUP.md` for detailed instructions.

## 📊 Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React 19, Tailwind CSS 4
- **Backend**: Next.js API routes
- **AI**: Claude 3.5 Haiku (Anthropic)
- **Deployment**: Vercel
- **Future**: MCP servers, Vector DB (Supabase/Pinecone)

### AI Models
- **Validator**: Claude 3.5 Haiku (fast, cheap, smart)
- **Knowledge Bot**: Claude 3.5 Haiku (consistent quality)
- **Embeddings** (future): Voyage AI or OpenAI

## 🤝 Contributing

This is a proprietary GTMVP project. For internal development only.

## 📝 License

Proprietary - GTMVP © 2025

## 📞 Support

- **Email**: hello@gtmvp.com
- **Phone**: (954) 228-5908
- **Website**: [gtmvp.com](https://gtmvp.com)

---

**Built with AI by GTMVP** 🚀
