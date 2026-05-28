import { Response } from 'express';
import { db } from '../config/firebase';
import { AuthRequest } from '../middleware/verifyToken';
import { indexSessionAnswers } from '../services/pineconeService';
import { generateChatResponse } from '../services/chatService';

// Create new session
export const createSession = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const { personName, answers } = req.body;

    if (!personName) {
      res.status(400).json({ 
        error: 'Person name required' 
      });
      return;
    }

    const sessionRef = db
      .collection('talkToPastSessions')
      .doc();

    const session = {
      id: sessionRef.id,
      userId,
      personName,
      answers: answers || {},
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await sessionRef.set(session);

    // Index all 4 sections in Pinecone
    // Background - don't await!
    indexSessionAnswers(
      userId,
      sessionRef.id,
      personName,
      answers || {}
    ).catch(err => 
      console.error('Pinecone err:', err)
    );

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

// Get all sessions for user
export const getSessions = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!
    console.log(
      'Getting sessions for userId:', 
      userId
    )

    const snapshot = await db
      .collection('talkToPastSessions')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get()

    console.log(
      'Found sessions:', 
      snapshot.docs.length
    )

    const sessions = snapshot.docs
      .map(doc => doc.data())

    res.status(200).json({
      success: true,
      sessions
    })
  } catch (error: any) {
    console.error(
      'getSessions FULL ERROR:', 
      error
    )
    console.error(
      'Error message:', 
      error.message
    )
    console.error(
      'Error code:', 
      error.code
    )
    res.status(500).json({ 
      error: error.message || 'Server error' 
    })
  }
}

// Get single session
export const getSession = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const sessionId = req.params.sessionId as string;

    const sessionDoc = await db
      .collection('talkToPastSessions')
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
      .collection('talkToPastSessions')
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
    const messageHistory = (session.messages || []).map(
      (m: { isUser: boolean; text: string }) => ({
        role: m.isUser ? 'user' as const : 'assistant' as const,
        content: m.text
      })
    );

    // Generate AI response
    const aiResponse = await generateChatResponse(
      userId,
      session.personName,
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

    // Save both to Firestore
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
    const userId = req.userId!
    const sessionId = req.params.sessionId as string

    const sessionRef = db
      .collection('talkToPastSessions')
      .doc(sessionId)

    const doc = await sessionRef.get()

    if (!doc.exists) {
      res.status(404).json({ 
        error: 'Session not found' 
      })
      return
    }

    if (doc.data()?.userId !== userId) {
      res.status(403).json({ 
        error: 'Unauthorized' 
      })
      return
    }

    await sessionRef.delete()

    res.status(200).json({ 
      success: true 
    })
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error' 
    })
  }
}
