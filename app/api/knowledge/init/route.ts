import { NextRequest, NextResponse } from 'next/server';
import { ragSystem } from '@/lib/rag/rag-system';

// Initialize the RAG knowledge base
export async function POST(request: NextRequest) {
  try {
    await ragSystem.initialize();

    const stats = await ragSystem.getStats();

    return NextResponse.json({
      success: true,
      message: 'Knowledge base initialized successfully',
      stats,
    });
  } catch (error) {
    console.error('Knowledge base initialization error:', error);

    return NextResponse.json(
      { error: 'Failed to initialize knowledge base' },
      { status: 500 }
    );
  }
}

// Get knowledge base stats
export async function GET(request: NextRequest) {
  try {
    const stats = await ragSystem.getStats();

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Knowledge base stats error:', error);

    return NextResponse.json(
      { error: 'Failed to get knowledge base stats' },
      { status: 500 }
    );
  }
}
