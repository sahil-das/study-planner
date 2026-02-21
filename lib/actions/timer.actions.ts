'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveStudySession(subjectId: string | null, durationMinutes: number) {
  const supabase = await createClient() // Next.js 15 async client
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error("Unauthorized")

  // 1. Save the study session
  const { error } = await supabase.from('study_sessions').insert({
    user_id: user.id,
    subject_id: subjectId || null,
    duration_minutes: durationMinutes
  })

  if (error) throw new Error(error.message)

  // 2. Streak Logic: If this session pushes them over 60 mins today, increment streak
  // (Simplified for now: if this single session is >= 60, boost streak)
  if (durationMinutes >= 60) {
     const { data: userData } = await supabase
        .from('users')
        .select('current_streak, longest_streak')
        .eq('id', user.id)
        .single()
        
     const newStreak = (userData?.current_streak || 0) + 1
     const newLongest = Math.max(newStreak, userData?.longest_streak || 0)

     await supabase.from('users')
        .update({ current_streak: newStreak, longest_streak: newLongest })
        .eq('id', user.id)
  }

  revalidatePath('/dashboard')
  return { success: true }
}