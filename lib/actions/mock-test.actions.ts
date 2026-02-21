'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addMockTest(data: {
  score: number
  total_marks: number
  accuracy_percentage: number
  time_taken_minutes: number
}) {
  const supabase = await createClient() // Next.js 15 safe!
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase.from('mock_tests').insert({
    user_id: user.id,
    score: data.score,
    total_marks: data.total_marks,
    accuracy_percentage: data.accuracy_percentage,
    time_taken_minutes: data.time_taken_minutes,
    test_date: new Date().toISOString().split('T')[0]
  })

  if (error) throw new Error(error.message)
  
  revalidatePath('/dashboard/mock-tests')
  revalidatePath('/dashboard')
  return { success: true }
}