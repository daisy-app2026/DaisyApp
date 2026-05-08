import axios from 'axios'

const API_URL = process.env.EXPO_PUBLIC_API_URL

export interface Entry {
  id: string
  userId: string
  title: string
  content: string
  type: 'text' | 'audio' | 'image' | 'doodle'
  spaceId: string
  spaceName: string
  isCapsule: boolean
  capsuleDuration: string | null
  unlockDate: string | null
  isEdited: boolean
  editCount: number
  createdAt: string
  updatedAt: string
}

export const createEntry = async (
  token: string,
  data: {
    title: string
    content: string
    type: string
    spaceId: string
    spaceName: string
    isCapsule: boolean
    capsuleDuration: string | null
    unlockDate: string | null
  }
): Promise<Entry> => {
  const response = await axios.post(
    `${API_URL}/api/entries/create`,
    data,
    {
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    }
  )
  return response.data.entry
}

export const getEntriesBySpace = async (
  token: string,
  spaceId: string
): Promise<Entry[]> => {
  const response = await axios.get(
    `${API_URL}/api/entries/space/${spaceId}`,
    {
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    }
  )
  return response.data.entries
}

export const getRecentEntries = async (
  token: string
): Promise<Entry[]> => {
  const response = await axios.get(
    `${API_URL}/api/entries/recent`,
    {
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    }
  )
  return response.data.entries
}

export const updateEntry = async (
  token: string,
  entryId: string,
  data: { title: string; content: string }
): Promise<Entry> => {
  const response = await axios.put(
    `${API_URL}/api/entries/update/${entryId}`,
    data,
    {
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    }
  )
  return response.data.entry
}

export const deleteEntry = async (
  token: string,
  entryId: string
): Promise<void> => {
  await axios.delete(
    `${API_URL}/api/entries/delete/${entryId}`,
    {
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    }
  )
}

export const getEntryStats = async (
  token: string
): Promise<{ entries: number; capsules: number; streak: number }> => {
  const response = await axios.get(
    `${API_URL}/api/entries/stats`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  return response.data.stats
}

export const getUnlockedCapsules = async (
  token: string
): Promise<Entry[]> => {
  const response = await axios.get(
    `${API_URL}/api/entries/unlocked-capsules`,
    {
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    }
  )
  return response.data.unlockedCapsules
}

export const markNotificationShown = async (
  token: string,
  entryId: string
): Promise<void> => {
  await axios.put(
    `${API_URL}/api/entries/mark-shown/${entryId}`,
    {},
    {
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    }
  )
}

export const getAllEntries = async (
  token: string
): Promise<Entry[]> => {
  const response = await axios.get(
    `${API_URL}/api/entries/all`,
    {
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    }
  )
  return response.data.entries
}
