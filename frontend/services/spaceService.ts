import axios from 'axios';
import { getFreshToken } from '../utils/getToken';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const fetchSpaces = async () => {
  const token = await getFreshToken();
  const response = await axios.get(
    `${API_URL}/api/spaces`,
    {
      headers: { 
        Authorization: `Bearer ${token}` 
      },
      timeout: 30000
    }
  );
  return response.data.spaces;
};

export const addCustomSpace = async (
  name: string,
  icon: string,
  iconBg: string,
  iconBgLight: string
) => {
  const token = await getFreshToken();
  const response = await axios.post(
    `${API_URL}/api/spaces/add`,
    { name, icon, iconBg, iconBgLight },
    {
      headers: { 
        Authorization: `Bearer ${token}` 
      },
      timeout: 30000
    }
  );
  return response.data.space;
};

export const removeSpace = async (
  spaceId: string,
  isDefault: boolean
) => {
  const token = await getFreshToken();
  await axios.delete(
    `${API_URL}/api/spaces/delete`,
    {
      headers: { 
        Authorization: `Bearer ${token}` 
      },
      data: { spaceId, isDefault },
      timeout: 30000
    }
  );
};
