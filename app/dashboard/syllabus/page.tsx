import { createClient } from '@/lib/supabase/server'
import { AddSubjectDialog, SubjectCard } from '@/components/dashboard/syllabus-components'

export default async function SyllabusPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: subjects } = await supabase
    .from('subjects')
    .select('*, topics(*, subtopics(*))')
    .eq('user_id', user?.id || '')
    .order('name')

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Syllabus Tracker</h1>
          <p className="text-muted-foreground mt-1">Manage subjects, topics, and study notes all in one place.</p>
        </div>
        <AddSubjectDialog />
      </div>

      {/* Subjects List */}
      <div className="grid gap-4 mt-6">
        {subjects?.map((subject) => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}

        {(!subjects || subjects.length === 0) && (
          <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">Your syllabus is empty</h3>
            <p className="text-muted-foreground mb-6">Click the button above to add your first subject (e.g., Mathematics).</p>
          </div>
        )}
      </div>
    </div>
  )
}
