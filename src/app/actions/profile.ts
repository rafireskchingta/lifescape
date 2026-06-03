'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()
  
  if (!authData.user) {
    throw new Error('Not authenticated')
  }

  const username = formData.get('username') as string
  const bio = formData.get('bio') as string | null
  const avatarFile = formData.get('avatar') as File | null

  let avatarUrl = undefined

  // Upload image if provided
  if (avatarFile && avatarFile.size > 0) {
    // Generate a unique filename: user_id + timestamp + extension
    const fileExt = avatarFile.name.split('.').pop()
    const fileName = `${authData.user.id}-${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, avatarFile, { upsert: true })

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError)
      throw new Error('Failed to upload image')
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)
      
    avatarUrl = publicUrl
  }

  // Build updates object
  const updates: any = {}
  if (username && username.trim() !== '') {
    updates.username = username.trim()
  }
  if (bio !== null) {
    updates.bio = bio.trim()
  }
  if (avatarUrl) {
    updates.avatar_url = avatarUrl
  }

  // Update profile database if there are changes
  if (Object.keys(updates).length > 0) {
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: authData.user.id, ...updates })

    if (error) {
      console.error('Error updating profile:', error)
      throw new Error(error.message || 'Failed to update profile')
    }
  }

  revalidatePath('/', 'layout') // Refresh all pages so new avatar appears everywhere
}
