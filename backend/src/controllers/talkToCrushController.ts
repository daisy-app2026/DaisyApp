import { Response } from 'express';
import { db } from '../config/firebase';
import { AuthRequest } from '../middleware/verifyToken';
import { indexSessionAnswers, searchContext } from '../services/pineconeService';
import { pineconeIndex } from '../config/pinecone';
import { getTalkToCrushSystemPrompt } from '../config/crushSystemPrompt';
import { generateChatResponse } from '../services/chatService';

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

    const sessionsSnapshot = await db
      .collection('talkToCrushSessions')
      .where('userId', '==', userId)
      .get();

    const activeCount = sessionsSnapshot.docs.filter(
      (doc) => !doc.data().isDeleted && !doc.data().deleted
    ).length;

    if (activeCount >= 2) {
      res.status(403).json({
        error: 'Chat limit reached'
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

    const today = new Date().toISOString().split('T')[0];
    const messages = (session.messages || []) as SessionMessage[];
    const todayUserMessages = messages.filter((msg: SessionMessage) => {
      if (!msg.isUser) return false;
      const msgDate = new Date(msg.timestamp).toISOString().split('T')[0];
      return msgDate === today;
    });

    if (todayUserMessages.length >= 5) {
      res.status(403).json({
        error: 'DAILY_LIMIT_REACHED',
        message: 'Daily limit of 5 messages reached'
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

    // Get context from Pinecone
    const contextResults = await searchContext(userId, message);

    const contextString = 
      contextResults.length > 0
        ? '\n\nRELEVANT CONTEXT:\n' + contextResults.join('\n')
        : '';

    // Build system prompt with all crush answers properly passed
    const systemPrompt =
      getTalkToCrushSystemPrompt(
        session.crushName,
        session.answers || {}
      ) + contextString;

    // Generate AI response
    const aiResponse = await generateChatResponse(
      messageHistory,
      systemPrompt
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

    // Delete Pinecone vectors
    // for this session!
    try {
      await pineconeIndex.deleteMany({
        filter: {
          sessionId: {
            $eq: sessionId
          }
        }
      })
      console.log(
        'Pinecone vectors deleted!'
      )
    } catch (pineconeError) {
      console.log(
        'Pinecone delete error:',
        pineconeError
      )
      // Continue even if
      // Pinecone fails!
    }

    await sessionRef.delete();

    console.log(
      'Session deleted:', sessionId
    )

    res.status(200).json({ 
      success: true 
    });
  } catch (error) {
    console.error(
      'Delete session error:', error
    )
    res.status(500).json({ 
      error: 'Server error' 
    });
  }
};
