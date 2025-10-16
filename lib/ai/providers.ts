import { OpenAI } from 'openai';
import { db } from '../db/drizzle';
import { teams } from '../db/schema';
import { eq } from 'drizzle-orm';

/**
 * Chat completion parameters
 */
export interface ChatCompletionParams {
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean; // Request JSON response format
}

/**
 * Chat completion response
 */
export interface ChatCompletionResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * AI Provider Interface
 */
export interface AIProvider {
  readonly name: string;

  /**
   * Send a chat completion request
   */
  chat(params: ChatCompletionParams): Promise<ChatCompletionResponse>;

  /**
   * Test connection to the AI provider
   */
  testConnection(): Promise<{ success: boolean; error?: string; latency?: number }>;
}

/**
 * Grok Provider (xAI) - Cloud-based AI
 */
export class GrokProvider implements AIProvider {
  readonly name = 'Grok 4 Fast';
  private client: OpenAI;
  private model: string;

  constructor(apiKey?: string) {
    this.client = new OpenAI({
      apiKey: apiKey || process.env.XAI_API_KEY, // User's API key takes priority
      baseURL: 'https://api.x.ai/v1',
    });
    this.model = process.env.XAI_MODEL || 'grok-4-fast-non-reasoning';
  }

  async chat(params: ChatCompletionParams): Promise<ChatCompletionResponse> {
    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'user',
            content: params.prompt,
          },
        ],
        temperature: params.temperature ?? 0.3,
        max_tokens: params.maxTokens,
        response_format: params.jsonMode ? { type: 'json_object' } : undefined,
      });

      return {
        content: completion.choices[0].message.content || '',
        usage: {
          promptTokens: completion.usage?.prompt_tokens || 0,
          completionTokens: completion.usage?.completion_tokens || 0,
          totalTokens: completion.usage?.total_tokens || 0,
        },
      };
    } catch (error: any) {
      console.error('[GrokProvider] Error:', error);
      throw new Error(`Grok API error: ${error.message}`);
    }
  }

  async testConnection(): Promise<{ success: boolean; error?: string; latency?: number }> {
    const startTime = Date.now();
    try {
      await this.chat({
        prompt: 'Test connection. Respond with: OK',
        temperature: 0,
        maxTokens: 10,
      });
      const latency = Date.now() - startTime;
      return { success: true, latency };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

/**
 * Get AI Provider for a team
 * Fetches team settings from database and returns Grok provider with user's API key
 *
 * IMPORTANT: Requires user's xAI API key to be configured in team settings.
 * If no key is found, throws an error directing user to settings page.
 */
export async function getAIProvider(teamId: number): Promise<AIProvider> {
  try {
    // Get team settings from database
    const [team] = await db
      .select()
      .from(teams)
      .where(eq(teams.id, teamId))
      .limit(1);

    if (!team) {
      throw new Error('Team not found. Please contact support.');
    }

    // Check if team has xAI API key configured
    if (!team.xaiApiKey) {
      // No API key configured - user must add their own key
      throw new Error(
        '⚠️ API key xAI nie jest skonfigurowany. ' +
        'Przejdź do Settings i dodaj swój klucz API aby korzystać z aplikacji. ' +
        'Pobierz bezpłatnie z: https://x.ai/api'
      );
    }

    console.log(`[AI Provider] Using Grok with user's API key for team ${teamId}`);
    return new GrokProvider(team.xaiApiKey);
  } catch (error) {
    console.error('[AI Provider] Error:', error);
    throw error; // Propagate error to caller
  }
}

/**
 * Create AI Provider without database lookup (for testing)
 */
export function createAIProvider(xaiApiKey?: string): AIProvider {
  return new GrokProvider(xaiApiKey);
}
