import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const generateChatResponse = async (
  messages: any[],
  systemPrompt: string
): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        ...messages
      ],
      max_tokens: 150,
      temperature: 0.85,
    });

    return response.choices[0]?.message?.content?.trim() || '';
  } catch (error) {
    console.error('OpenAI chat error:', error);
    throw new Error('Failed to generate response');
  }
};
