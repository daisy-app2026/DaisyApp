import axios from 'axios';
import { getFreshToken } from '../utils/getToken';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export interface TalkToPastSession {
  id: string;
  userId: string;
  personName: string;
  answers: Record<string, any>;
  messages: TalkToPastMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface TalkToPastMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

// Create new session
export const createTalkToPastSession = async (
  personName: string,
  answers: Record<string, any>
): Promise<TalkToPastSession> => {
  const token = await getFreshToken();
  const response = await axios.post(
    `${API_URL}/api/talk-to-past/sessions`,
    { personName, answers },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data.session;
};

// Get all sessions
export const getTalkToPastSessions = async (): Promise<TalkToPastSession[]> => {
  const token = await getFreshToken();
  const response = await axios.get(
    `${API_URL}/api/talk-to-past/sessions`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data.sessions;
};

// Get single session
export const getTalkToPastSession = async (
  sessionId: string
): Promise<TalkToPastSession> => {
  const token = await getFreshToken();
  const response = await axios.get(
    `${API_URL}/api/talk-to-past/sessions/${sessionId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data.session;
};

// Send message
export const sendTalkToPastMessage = async (
  sessionId: string,
  message: string
): Promise<{
  userMessage: TalkToPastMessage;
  aiMessage: TalkToPastMessage;
}> => {
  const token = await getFreshToken();
  const response = await axios.post(
    `${API_URL}/api/talk-to-past/sessions/${sessionId}/message`,
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
export const deleteTalkToPastSession = async (
  sessionId: string
): Promise<void> => {
  const token = await getFreshToken();
  await axios.delete(
    `${API_URL}/api/talk-to-past/sessions/${sessionId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};
