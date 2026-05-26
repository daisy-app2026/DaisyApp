import axios from 'axios';
import { getFreshToken } from '../utils/getToken';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export interface TalkToCrushSession {
  id: string;
  userId: string;
  crushName: string;
  answers: Record<string, any>;
  messages: TalkToCrushMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface TalkToCrushMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

export const testConnection = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/health`
    )
    console.log('Connection OK:', 
      response.data)
    return true
  } catch (error) {
    console.log('Connection FAILED:', error)
    return false
  }
}

// Create new session
export const createTalkToCrushSession = async (
  crushName: string,
  answers: Record<string, any>
): Promise<TalkToCrushSession> => {
  console.log('Creating session...');
  console.log('API URL:', API_URL);
  console.log('crushName:', crushName);
  console.log('answers:', answers);
  const token = await getFreshToken();
  const response = await axios.post(
    `${API_URL}/api/talk-to-crush/sessions`,
    { crushName, answers },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data.session;
};

// Get all sessions
export const getTalkToCrushSessions = async (): Promise<TalkToCrushSession[]> => {
  const token = await getFreshToken();
  const response = await axios.get(
    `${API_URL}/api/talk-to-crush/sessions`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data.sessions;
};

// Get single session
export const getTalkToCrushSession = async (
  sessionId: string
): Promise<TalkToCrushSession> => {
  const token = await getFreshToken();
  const response = await axios.get(
    `${API_URL}/api/talk-to-crush/sessions/${sessionId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data.session;
};

// Send message
export const sendTalkToCrushMessage = async (
  sessionId: string,
  message: string
): Promise<{
  userMessage: TalkToCrushMessage;
  aiMessage: TalkToCrushMessage;
}> => {
  const token = await getFreshToken();
  const response = await axios.post(
    `${API_URL}/api/talk-to-crush/sessions/${sessionId}/message`,
    { message },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return {
    userMessage: response.data.userMessage,
    aiMessage: response.data.aiMessage
  };
};

// Delete session
export const deleteTalkToCrushSession = async (
  sessionId: string
): Promise<void> => {
  const token = await getFreshToken();
  await axios.delete(
    `${API_URL}/api/talk-to-crush/sessions/${sessionId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};
