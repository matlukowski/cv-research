import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createAIProvider } from '@/lib/ai/providers';

/**
 * POST /api/team/ai-settings/test
 * Test connection to Grok AI provider
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { xaiApiKey } = body;

    // Create Grok provider instance
    const provider = createAIProvider(xaiApiKey);

    console.log(`[AI Test] Testing connection to ${provider.name}...`);

    // Test connection
    const result = await provider.testConnection();

    if (result.success) {
      return NextResponse.json({
        success: true,
        provider: provider.name,
        latency: result.latency,
        message: `Połączenie z ${provider.name} udane!`,
      });
    } else {
      return NextResponse.json({
        success: false,
        provider: provider.name,
        error: result.error,
        message: `Nie można połączyć z ${provider.name}`,
      });
    }
  } catch (error: any) {
    console.error('[AI Test API] Error testing connection:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to test AI connection',
      },
      { status: 500 }
    );
  }
}
