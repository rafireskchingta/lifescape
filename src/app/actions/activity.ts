'use server'

import { createClient } from '@/lib/supabase/server'
import { getDifficultyXp } from '@/lib/levelSystem'
import { revalidatePath } from 'next/cache'

export async function addActivity(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;
  const difficulty = formData.get('difficulty') as string;

  if (!title || !category || !difficulty) {
    throw new Error('Missing required fields');
  }

  const { error } = await supabase
    .from('activities')
    .insert({
      user_id: user.id,
      title,
      description,
      category,
      difficulty,
    });

  if (error) {
    console.error('Error adding activity:', error);
    throw new Error('Failed to add activity');
  }

  revalidatePath('/activities');
  revalidatePath('/dashboard');
  
  return { success: true };
}

export async function completeActivity(activityId: string, category: string, difficulty: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }

  const xpReward = getDifficultyXp(difficulty);

  // Use the RPC created in our SQL schema
  const { error } = await supabase.rpc('complete_activity_and_add_xp', {
    p_activity_id: activityId,
    p_user_id: user.id,
    p_category: category,
    p_xp_reward: xpReward
  });

  if (error) {
    console.error('Error completing activity:', error);
    throw new Error('Failed to complete activity');
  }

  revalidatePath('/activities');
  revalidatePath('/dashboard');
  revalidatePath('/statistics');

  return { success: true, earnedXp: xpReward };
}

export async function deleteActivity(activityId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase
    .from('activities')
    .delete()
    .eq('id', activityId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting activity:', error);
    throw new Error('Failed to delete activity');
  }

  revalidatePath('/activities');
  
  return { success: true };
}
