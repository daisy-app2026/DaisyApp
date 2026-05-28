import { Response } from 'express';
import { db } from '../config/firebase';
import { AuthRequest } from '../middleware/verifyToken';
import { indexSessionAnswers, searchContext } from '../services/pineconeService';
import { getTalkToCrushSystemPrompt } from '../config/crushSystemPrompt';

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

const MODELS = [
  'z-ai/glm-4-5-air:free',
  'nvidia/llama-3.1-nemotron-ultra-253b-v1:free',
  'deepseek/deepseek-v4-0324:free',
  'minimax/minimax-m2.5:free',
  'openai/gpt-oss-120b:free',
];

interface SessionMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Helper to generate crush chat response
const generateCrushResponse = async (
  userId: string,
  crushName: string,
  answers: Record<string, any>,
  messages: ChatMessage[],
  userMessage: string
): Promise<string> => {
  const contextResults = await searchContext(userId, userMessage, 5);
  const contextString = contextResults.length > 0
    ? `\nRELEVANT CONTEXT FROM USER'S DIARY AND ANSWERS:\n${contextResults.join('\n')}\n`
    : '';

  const systemPrompt = getTalkToCrushSystemPrompt(crushName, answers) + contextString;

  const chatMessages = [
    ...messages.slice(-30),
    { role: 'user', content: userMessage } as ChatMessage
  ];

  let lastError: Error | null = null;
  for (const model of MODELS) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      console.log(`Trying model (Crush): ${model}`);
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
              { role: 'system', content: systemPrompt } as ChatMessage,
              ...chatMessages
            ],
            max_tokens: 200,
            temperature: 0.8,
          })
        }
      );

      clearTimeout(timeoutId);
      const data = await response.json() as {
        choices?: {
          message?: { content?: string };
          text?: string;
        }[];
        content?: { text?: string }[];
      };
      console.log('Full API response (Crush):', JSON.stringify(data, null, 2));

      const content = data.choices?.[0]?.message?.content;
      if (!content) {
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
      lastError = err instanceof Error ? err : new Error(String(err));
      continue;
    }
  }

  throw lastError || new Error('All models failed');
};

// Create new session
export const createSession = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  console.log('=== CREATE CRUSH SESSION ===')
  console.log('Headers:', req.headers)
  console.log('Body:', req.body)
  console.log('UserId:', req.userId)
  
  try {
    const userId = req.userId!
    const { crushName, answers } = req.body;

    if (!crushName) {
      res.status(400).json({ 
        error: 'Crush name required' 
      });
      return;
    }

    const sessionRef = db
      .collection('talkToCrushSessions')
      .doc();

    const session = {
      id: sessionRef.id,
      userId,
      crushName,
      answers: answers || {},
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await sessionRef.set(session);

    // Index all 3 sections in Pinecone as type 'crush_answer'
    indexSessionAnswers(
      userId,
      sessionRef.id,
      crushName,
      answers || {},
      'crush_answer'
    ).catch(err => 
      console.error('Pinecone err:', err)
    );

    res.status(200).json({
      success: true,
      session
    });
  } catch (error: any) {
    console.error('FULL ERROR:', error)
    console.error('Message:', error.message)
    console.error('Stack:', error.stack)
    res.status(500).json({
      error: error.message || 'Server error'
    })
  }
};

// Get all sessions for user
export const getSessions = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const snapshot = await db
      .collection('talkToCrushSessions')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const sessions = snapshot.docs.map(doc => doc.data());

    res.status(200).json({
      success: true,
      sessions
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Server error';
    res.status(500).json({ 
      error: errMsg 
    });
  }
};

// Get single session
export const getSession = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const sessionId = req.params.sessionId as string;

    const sessionDoc = await db
      .collection('talkToCrushSessions')
      .doc(sessionId)
      .get();

    if (!sessionDoc.exists) {
      res.status(404).json({ 
        error: 'Session not found' 
      });
      return;
    }

    const session = sessionDoc.data()!;

    if (session.userId !== userId) {
      res.status(403).json({ 
        error: 'Unauthorized' 
      });
      return;
    }

    res.status(200).json({
      success: true,
      session
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error' 
    });
  }
};

// Send message and get AI response
export const sendMessage = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const sessionId = req.params.sessionId as string;
    const { message } = req.body;

    if (!message?.trim()) {
      res.status(400).json({ 
        error: 'Message required' 
      });
      return;
    }

    if (message.length > 1000) {
      res.status(400).json({
        error: 'Message too long!'
      });
      return;
    }

    const sessionRef = db
      .collection('talkToCrushSessions')
      .doc(sessionId);
    
    const sessionDoc = await sessionRef.get();

    if (!sessionDoc.exists) {
      res.status(404).json({ 
        error: 'Session not found' 
      });
      return;
    }

    const session = sessionDoc.data()!;

    if (session.userId !== userId) {
      res.status(403).json({ 
        error: 'Unauthorized' 
      });
      return;
    }

    // Build message history for AI
    const messageHistory = ((session.messages || []) as SessionMessage[]).map(
      (m: SessionMessage) => ({
        role: m.isUser ? 'user' as const : 'assistant' as const,
        content: m.text
      })
    );

    // Generate AI response
    const aiResponse = await generateCrushResponse(
      userId,
      session.crushName,
      session.answers,
      messageHistory,
      message
    );

    const userMsg = {
      id: `msg_${Date.now()}_user`,
      text: message,
      isUser: true,
      timestamp: new Date().toISOString()
    };

    const aiMsg = {
      id: `msg_${Date.now() + 1}_ai`,
      text: aiResponse,
      isUser: false,
      timestamp: new Date().toISOString()
    };

    await sessionRef.update({
      messages: [
        ...(session.messages || []),
        userMsg,
        aiMsg
      ],
      updatedAt: new Date().toISOString()
    });

    res.status(200).json({
      success: true,
      userMessage: userMsg,
      aiMessage: aiMsg
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ 
      error: 'Server error' 
    });
  }
};

// Delete session
export const deleteSession = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const sessionId = req.params.sessionId as string;

    const sessionRef = db
      .collection('talkToCrushSessions')
      .doc(sessionId);

    const doc = await sessionRef.get();

    if (!doc.exists) {
      res.status(404).json({ 
        error: 'Session not found' 
      });
      return;
    }

    if (doc.data()?.userId !== userId) {
      res.status(403).json({ 
        error: 'Unauthorized' 
      });
      return;
    }

    await sessionRef.delete();

    res.status(200).json({ 
      success: true 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error' 
    });
  }
};
