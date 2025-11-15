import { NextRequest, NextResponse } from 'next/server';
import { sendMessage, VALIDATOR_SYSTEM_PROMPT, KNOWLEDGE_SYSTEM_PROMPT } from '@/lib/claude/client';
import { ragSystem } from '@/lib/rag/rag-system';
import { z } from 'zod';

const chatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    })
  ),
  mode: z.enum(['validator', 'knowledge']),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, mode } = chatRequestSchema.parse(body);

    let systemPrompt = mode === 'validator'
      ? VALIDATOR_SYSTEM_PROMPT
      : KNOWLEDGE_SYSTEM_PROMPT;

    // For knowledge mode, use RAG to enhance responses
    if (mode === 'knowledge' && messages.length > 0) {
      const lastUserMessage = messages[messages.length - 1];
      if (lastUserMessage.role === 'user') {
        try {
          // Query RAG system for relevant context
          const { context, sources } = await ragSystem.query(lastUserMessage.content, 3);

          if (context) {
            // Enhance system prompt with RAG context
            systemPrompt += `\n\n**Relevant Knowledge Base Context:**\n${context}\n\nUse the above context to provide accurate, specific answers. Cite the sources when relevant.`;
          }
        } catch (error) {
          console.error('RAG query error:', error);
          // Continue without RAG if it fails
        }
      }
    }

    const response = await sendMessage(messages, {
      systemPrompt,
      temperature: mode === 'validator' ? 0.7 : 0.5,
    });

    return NextResponse.json({
      response,
      success: true
    });
  } catch (error) {
    console.error('Chat API error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request format', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
