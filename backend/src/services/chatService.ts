import { searchContext } from './pineconeService';
import { getTalkToPastSystemPrompt } from '../config/systemPrompt';

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const MODELS = [
  'z-ai/glm-4-5-air:free',
  'nvidia/llama-3.1-nemotron-ultra-253b-v1:free',
  'deepseek/deepseek-v4-0324:free',
  'minimax/minimax-m2.5:free',
  'openai/gpt-oss-120b:free',
];

export const generateChatResponse = async (
  userId: string,
  personName: string,
  answers: Record<string, any>,
  messages: Message[],
  userMessage: string
): Promise<string> => {
  try {
    // Step 1: Search relevant context
    const contextResults = await searchContext(userId, userMessage, 5);

    console.log(
      'Context results found:', 
      contextResults.length
    )
    console.log(
      'Context:', 
      contextResults
    )

    // Step 2: Build context string
    const contextString = contextResults.length > 0
      ? `\nRELEVANT CONTEXT FROM USER'S DIARY AND ANSWERS:\n${contextResults.join('\n')}\n`
      : '';

    // Step 3: Get system prompt
    const systemPrompt = getTalkToPastSystemPrompt(personName, answers) + contextString;

    console.log(
      'System prompt length:', 
      systemPrompt.length
    )
    console.log(
      'Context string:', 
      contextString
    )

    // Step 4: Build messages (last 30 only)
    const chatMessages = [
      ...messages.slice(-30),
      { role: 'user', content: userMessage }
    ];

    // Step 5: Call models in a loop with fallback
    let lastError: any = null;
    for (const model of MODELS) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds

      try {
        console.log(`Trying model: ${model}`);
        const response = await fetch(
          `${OPENROUTER_BASE_URL}/chat/completions`,
          {
            method: 'POST',
            signal: controller.signal,
            headers: {
              'Authorization': `Bearer ${process.env.ANTHROPIC_API_KEY}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': 'https://daisy-app.com',
              'X-Title': 'Daisy App',
            },
            body: JSON.stringify({
              model,
              messages: [
                { 
                  role: 'system', 
                  content: systemPrompt 
                },
                ...chatMessages
              ],
              max_tokens: 200,
              temperature: 0.8,
            })
          }
        );

        clearTimeout(timeoutId);
        const data = (await response.json()) as any;
        console.log('Full API response:', JSON.stringify(data, null, 2));

        const content = data.choices?.[0]?.message?.content;
        if (!content) {
          console.error('No content in response:', data);
          // Try alternate response paths
          const altContent = 
            data.choices?.[0]?.text ||
            data.content?.[0]?.text ||
            null;

          if (altContent) return altContent;
          continue;
        }

        return content;
      } catch (err) {
        clearTimeout(timeoutId);
        console.error(`Failed with model ${model}:`, err);
        lastError = err;
        continue;
      }
    }

    throw lastError || new Error('All models failed');

  } catch (error) {
    console.error('Chat error:', error);
    throw error;
  }
};
