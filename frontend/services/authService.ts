import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithCredential,
} from '@firebase/auth'
import { auth } from '../config/firebase'
import axios from 'axios'

const API_URL = process.env.EXPO_PUBLIC_API_URL

const registerToBackend = async (
  uid: string,
  email: string,
  name: string
) => {
  try {
    await axios.post(
      `${API_URL}/api/auth/register`, 
      { uid, email, name }
    )
  } catch (error) {
    console.log('Backend register error:', error)
  }
}

export const signUpWithEmail = async (
  email: string,
  password: string,
  name: string
) => {
  const userCredential = 
    await createUserWithEmailAndPassword(
      auth, email, password
    )
  const user = userCredential.user
  const token = await user.getIdToken()
  await registerToBackend(user.uid, email, name)
  return { user, token }
}

export const signInWithEmail = async (
  email: string,
  password: string
) => {
  const userCredential = 
    await signInWithEmailAndPassword(
      auth, email, password
    )
  const user = userCredential.user
  const token = await user.getIdToken()

  // Fetch user data from backend (Fix 3)
  try {
    const response = await axios.get(
      `${API_URL}/api/auth/user/${user.uid}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    const userData = response.data.user
    return { 
      user, 
      token,
      name: userData.name || '',
      email: userData.email || user.email || '',
      photoURL: userData.photoURL || null
    }
  } catch (error) {
    console.log('Fetch user error:', error)
    return { 
      user, 
      token,
      name: user.displayName || '',
      email: user.email || ''
    }
  }
}

export const signInWithGoogleCredential = async (
  idToken: string
) => {
  const credential = 
    GoogleAuthProvider.credential(idToken)
  const userCredential = 
    await signInWithCredential(auth, credential)
  const user = userCredential.user
  const token = await user.getIdToken()
  await registerToBackend(
    user.uid,
    user.email || '',
    user.displayName || ''
  )
  return { user, token }
}

export const logOut = async () => {
  await signOut(auth)
}

export const updateUserName = async (
  token: string,
  name: string
): Promise<void> => {
  await axios.put(
    `${API_URL}/api/auth/update-name`,
    { name },
    {
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    }
  )
}

export const uploadProfilePhoto = async (
  token: string,
  imageUri: string
): Promise<string> => {
  try {
    const formData = new FormData()
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'profile.jpg',
    } as any)
    
    const uploadPreset = 'daisy_profiles'
    formData.append('upload_preset', uploadPreset)
    // formData.append('folder', `daisy-app/users/${token}/profile`)

    const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`

    console.log('Cloud name:', cloudName)
    console.log('Preset:', uploadPreset)
    console.log('Image URI:', imageUri)
    console.log('Upload URL:', uploadUrl)

    const response = await axios.post(
      uploadUrl,
      formData,
      {
        headers: { 
          'Content-Type': 'multipart/form-data' 
        }
      }
    )

    console.log('Response:', response.data)

    const photoURL = response.data.secure_url

    await axios.put(
      `${API_URL}/api/auth/update-photo`,
      { photoURL },
      {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      }
    )

    return photoURL
  } catch (error: any) {
    console.log('Upload error details:', error.response?.data || error.message)
    throw error
  }
}
