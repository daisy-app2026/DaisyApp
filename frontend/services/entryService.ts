import axios from 'axios';
import { getFreshToken } from '../utils/getToken';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export interface Entry {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: 'text' | 'audio' | 'image' | 'doodle';
  spaceId: string;
  spaceName: string;
  isCapsule: boolean;
  capsuleDuration: string | null;
  unlockDate: string | null;
  isEdited: boolean;
  editCount: number;
  createdAt: string;
  updatedAt: string;
}

export const createEntry = async (
  data: {
    title: string;
    content: string;
    type: string;
    spaceId: string;
    spaceName: string;
    isCapsule: boolean;
    capsuleDuration: string | null;
    unlockDate: string | null;
  }
): Promise<Entry> => {
  const token = await getFreshToken();
  const response = await axios.post(
    `${API_URL}/api/entries/create`,
    data,
    {
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    }
  );
  return response.data.entry;
};

export const getEntriesBySpace = async (
  spaceId: string
): Promise<Entry[]> => {
  const token = await getFreshToken();
  const response = await axios.get(
    `${API_URL}/api/entries/space/${spaceId}`,
    {
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    }
  );
  return response.data.entries;
};

export const getRecentEntries = async (): Promise<Entry[]> => {
  const token = await getFreshToken();
  const response = await axios.get(
    `${API_URL}/api/entries/recent`,
    {
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    }
  );
  return response.data.entries;
};

export const updateEntry = async (
  entryId: string,
  data: { title: string; content: string }
): Promise<Entry> => {
  const token = await getFreshToken();
  const response = await axios.put(
    `${API_URL}/api/entries/update/${entryId}`,
    data,
    {
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    }
  );
  return response.data.entry;
};

export const deleteEntry = async (
  entryId: string
): Promise<void> => {
  const token = await getFreshToken();
  await axios.delete(
    `${API_URL}/api/entries/delete/${entryId}`,
    {
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    }
  );
};

export const getEntryStats = async (): Promise<{ entries: number; capsules: number; streak: number }> => {
  const token = await getFreshToken();
  const response = await axios.get(
    `${API_URL}/api/entries/stats`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data.stats;
};

export const getUnlockedCapsules = async (): Promise<Entry[]> => {
  const token = await getFreshToken();
  const response = await axios.get(
    `${API_URL}/api/entries/unlocked-capsules`,
    {
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    }
  );
  return response.data.unlockedCapsules;
};

export const markNotificationShown = async (
  entryId: string
): Promise<void> => {
  const token = await getFreshToken();
  await axios.put(
    `${API_URL}/api/entries/mark-shown/${entryId}`,
    {},
    {
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    }
  );
};

export const getAllEntries = async (): Promise<Entry[]> => {
  const token = await getFreshToken();
  const response = await axios.get(
    `${API_URL}/api/entries/all`,
    {
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    }
  );
  return response.data.entries;
};
