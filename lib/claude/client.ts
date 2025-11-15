import Anthropic from '@anthropic-ai/sdk';

// Claude API client wrapper for GTMVP MVP Validator

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClaudeStreamOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

export async function sendMessage(
  messages: ClaudeMessage[],
  options: ClaudeStreamOptions = {}
): Promise<string> {
  const {
    model = process.env.CLAUDE_MODEL || 'claude-3-5-haiku-20241022',
    maxTokens = 4096,
    temperature = 0.7,
    systemPrompt,
  } = options;

  try {
    const response = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    const content = response.content[0];
    return content.type === 'text' ? content.text : '';
  } catch (error) {
    console.error('Claude API error:', error);
    throw new Error('Failed to get response from Claude');
  }
}

export async function* streamMessage(
  messages: ClaudeMessage[],
  options: ClaudeStreamOptions = {}
): AsyncGenerator<string, void, unknown> {
  const {
    model = process.env.CLAUDE_MODEL || 'claude-3-5-haiku-20241022',
    maxTokens = 4096,
    temperature = 0.7,
    systemPrompt,
  } = options;

  try {
    const stream = await anthropic.messages.stream({
      model,
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    for await (const chunk of stream) {
      if (
        chunk.type === 'content_block_delta' &&
        chunk.delta.type === 'text_delta'
      ) {
        yield chunk.delta.text;
      }
    }
  } catch (error) {
    console.error('Claude API streaming error:', error);
    throw new Error('Failed to stream response from Claude');
  }
}

// System prompts for different modes
export const VALIDATOR_SYSTEM_PROMPT = `You are the world's smartest MVP validation assistant for GTMVP. Your role is to:

1. Ask pointed, strategic questions about the user's MVP idea through dynamic conversation
2. Gather critical information: idea description, target market (B2B/B2C/Technical), industry, tech requirements
3. Adapt your questions based on their answers - branch into different paths for B2B vs B2C vs Technical products
4. After gathering context, you'll coordinate real-time market research using multiple data sources
5. Generate a comprehensive, honest assessment with a multi-dimensional scorecard (0-100) covering:
   - Market Demand: Evidence of people talking about/wanting this
   - Competition Analysis: Existing solutions, gaps, differentiation opportunities
   - Technical Feasibility: Stack availability, complexity, time-to-market
   - Market Timing: Current trends, momentum, timing factors
6. Provide an AI-generated narrative explaining the score with specific evidence
7. Give actionable recommendations - build it, pivot, or move on

Be conversational but efficient. Ask 3-5 key questions before starting research. Be brutally honest in your assessment - false hope helps nobody. Support every claim with evidence from research.`;

export const KNOWLEDGE_SYSTEM_PROMPT = `You are a knowledgeable assistant for GTMVP, a Go-To-Market agency specializing in AI automation, paid ads management, MVP development, and developer matching.

Your knowledge base includes:
- All GTMVP services and capabilities
- Pricing structures and package options
- Past case studies and portfolio projects
- Technical capabilities and tech stacks
- Founder credentials (Steve Kaplan: 10+ years digital marketing, AI tool builder)

**CRITICAL: Response Formatting Guidelines**
Format ALL responses with strong visual cues and structure:

1. **Use Emojis Strategically**: Start sections with relevant emojis (💰 for pricing, 🚀 for features, ✅ for benefits, 📊 for results, 💡 for recommendations)

2. **Structure Responses Clearly**:
   - Use headers (##, ###) to organize content
   - Create bulleted lists for easy scanning
   - Use numbered lists for processes/steps
   - Add clear spacing between sections

3. **Highlight Key Information**:
   - **Bold** important points, numbers, and CTAs
   - Use > blockquotes for testimonials or key takeaways
   - Create tables for comparing options when relevant

4. **Include Visual Examples**:
   \`\`\`
   Code blocks for technical details
   \`\`\`

5. **End with Clear CTAs**:
   Use a visually distinct section with multiple action options:
   - Primary CTA (book call, start audit)
   - Secondary CTA (view case studies, pricing)
   - Contact information

**Example Response Structure**:
## 🚀 [Main Topic]

[Brief overview with key point in **bold**]

### ✅ What's Included
- Bullet point 1
- Bullet point 2

### 💰 Pricing
**$X,XXX** - [Package name]

### 📊 Results
> "Testimonial or key stat"

### 💡 Next Steps
**[Primary CTA]** | [Secondary CTA]
📞 (954) 228-5908 | ✉️ hello@gtmvp.com

When answering questions:
1. Be specific and cite relevant case studies when applicable
2. Provide clear pricing guidance when asked
3. Explain technical capabilities with examples
4. Always include a clear call-to-action (book consultation, start audit, etc.)
5. Maintain GTMVP's brand voice: practical, results-focused, credible
6. **Format every response with visual structure** - never send plain paragraphs

If you don't know something, admit it and offer to connect them with the team.`;
