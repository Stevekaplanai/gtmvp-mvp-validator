import { NextRequest, NextResponse } from 'next/server';
import { sendMessage, VALIDATOR_SYSTEM_PROMPT, KNOWLEDGE_SYSTEM_PROMPT } from '@/lib/claude/client';
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

    const systemPrompt = mode === 'validator'
      ? VALIDATOR_SYSTEM_PROMPT
      : KNOWLEDGE_SYSTEM_PROMPT;

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
        { error: 'Invalid request format', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
