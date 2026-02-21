'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// 1. Add a new Subject (e.g., "Maths")
export async function addSubject(name: string) {
  const supabase = await createClient() // Notice the await!
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase.from('subjects').insert({
    name,
    user_id: user.id,
  })

  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/syllabus')
  return { success: true }
}

// 2. Add a new Topic to a Subject (e.g., "Percentage")
export async function addTopic(subjectId: string, name: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase.from('topics').insert({
    name,
    subject_id: subjectId,
    user_id: user.id,
    status: 'Not Started'
  })

  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/syllabus')
  return { success: true }
}

// 3. Mark a Topic Complete & Auto-Schedule Revisions
export async function completeTopic(topicId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Mark complete
  await supabase.from('topics').update({ 
    status: 'Completed', 
    completed_at: new Date().toISOString() 
  }).eq('id', topicId)

  // Smart Spaced Repetition Logic (1, 3, 7, 15 days)
  const intervals = [1, 3, 7, 15] 
  const revisions = intervals.map(days => {
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + days)
    return {
      topic_id: topicId,
      user_id: user.id,
      due_date: dueDate.toISOString().split('T')[0],
      is_completed: false
    }
  })

  await supabase.from('revisions').insert(revisions)
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/syllabus')
  return { success: true }
}

// 4. Add a Subtopic
export async function addSubtopic(topicId: string, name: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase.from('subtopics').insert({
    name,
    topic_id: topicId,
    user_id: user.id,
    status: 'Not Started'
  })

  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/syllabus')
  return { success: true }
}

// 5. Update Topic Notes
export async function updateTopicNotes(topicId: string, notes: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('topics').update({ notes }).eq('id', topicId)
  
  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/syllabus')
  return { success: true }
}

// 6. Mark Subtopic Complete
export async function completeSubtopic(subtopicId: string) {
  const supabase = await createClient()
  await supabase.from('subtopics').update({ 
    status: 'Completed', 
    completed_at: new Date().toISOString() 
  }).eq('id', subtopicId)
  
  revalidatePath('/dashboard/syllabus')
  return { success: true }
}