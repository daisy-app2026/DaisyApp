import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const HARMFUL_KEYWORDS = [
  'kill', 'suicide', 'self harm',
  'hurt myself', 'end my life',
  'cut myself', 'overdose',
  'bomb', 'weapon', 'explosive',
  'hack', 'illegal',
];

const containsHarmful = (
  text: string
): boolean => {
  const lower = text.toLowerCase();
  return HARMFUL_KEYWORDS.some(
    word => lower.includes(word)
  );
};

export const generateChatResponse = async (
  messages: any[],
  systemPrompt: string
): Promise<string> => {
  try {
    // Get last user message
    const lastUserMsg = messages
      .filter(m => m.role === 'user')
      .pop()?.content || '';

    const isCrush = systemPrompt.includes('bestie') || systemPrompt.includes('crush');

    if (containsHarmful(lastUserMsg)) {
      return isCrush
        ? "That's not my vibe bestie! Let's keep this space positive. What else is going on? 😊"
        : "That's not something I can explore here. I'm always here to support your healing journey — what else is on your heart?";
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        ...messages
      ],
      max_tokens: 250,
      temperature: 0.85,
    });

    const content = response.choices[0]?.message?.content?.trim() || '';

    if (content) {
      const moderation = await openai.moderations.create({
        input: content,
      });

      if (moderation.results[0]?.flagged) {
        console.log('OpenAI Moderation: response flagged as harmful.');
        return isCrush
          ? "That's not my vibe bestie! Let's keep this space positive. What else is going on? 😊"
          : "That's not something I can explore here. I'm always here to support your healing journey — what else is on your heart?";
      }
    }

    return content;
  } catch (error) {
    console.error('OpenAI chat error:', error);
    throw new Error('Failed to generate response');
  }
};
