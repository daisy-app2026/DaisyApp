import axios from 'axios'

const API_URL = process.env.EXPO_PUBLIC_API_URL

export const fetchSpaces = async (
  token: string
) => {
  const response = await axios.get(
    `${API_URL}/api/spaces`,
    {
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    }
  )
  return response.data.spaces
}

export const addCustomSpace = async (
  token: string,
  name: string,
  icon: string,
  iconBg: string,
  iconBgLight: string
) => {
  const response = await axios.post(
    `${API_URL}/api/spaces/add`,
    { name, icon, iconBg, iconBgLight },
    {
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    }
  )
  return response.data.space
}

export const removeSpace = async (
  token: string,
  spaceId: string,
  isDefault: boolean
) => {
  await axios.delete(
    `${API_URL}/api/spaces/delete`,
    {
      headers: { 
        Authorization: `Bearer ${token}` 
      },
      data: { spaceId, isDefault }
    }
  )
}
