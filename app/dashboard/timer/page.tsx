import { createClient } from '@/lib/supabase/server'
import { StudyTimer } from '@/components/timer/StudyTimer'

export default async function TimerPage() {
  const supabase = await createClient() // Next.js 15 async client
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch subjects so the user can select what they are studying
  const { data: subjects } = await supabase
    .from('subjects')
    .select('id, name')
    .eq('user_id', user?.id || '')
    .order('name')

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Focus Timer</h1>
        <p className="text-muted-foreground">Track your study sessions. The longer you focus, the higher your streak.</p>
      </div>
      
      <div className="mt-10">
        <StudyTimer subjects={subjects || []} />
      </div>
    </div>
  )
}