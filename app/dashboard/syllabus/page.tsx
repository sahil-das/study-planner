import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Circle, BookOpen, ChevronRight } from 'lucide-react'
import { AddSubjectDialog, AddTopicDialog, MarkDoneButton, NotesDialog, AddSubtopicDialog, MarkSubtopicDoneButton } from '@/components/dashboard/syllabus-components'

export default async function SyllabusPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: subjects } = await supabase.from('subjects').select('*, topics(*, subtopics(*))').eq('user_id', user?.id || '').order('name')

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Syllabus Tracker</h1>
          <p className="text-muted-foreground">Manage subjects, topics, subtopics, and study notes.</p>
        </div>
        <AddSubjectDialog />
      </div>

      <div className="grid gap-6">
        {subjects?.map((subject) => {
          const completedCount = subject.topics?.filter((t: any) => t.status === 'Completed').length || 0;
          const totalCount = subject.topics?.length || 0;
          
          return (
            <Card key={subject.id} className="shadow-sm border-slate-200 dark:border-slate-800 dark:bg-slate-950">
              <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 py-4">
                <CardTitle className="text-lg flex justify-between items-center">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                    <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    {subject.name}
                  </div>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                    {completedCount} / {totalCount} Topics Done
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {subject.topics?.map((topic: any) => (
                    <div key={topic.id} className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-slate-300 dark:hover:border-slate-600 transition-colors bg-white dark:bg-slate-950 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {topic.status === 'Completed' ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <Circle className="h-5 w-5 text-slate-300 dark:text-slate-600" />}
                          <span className={`font-semibold text-lg ${topic.status === 'Completed' ? "line-through text-slate-400 dark:text-slate-500" : "text-slate-800 dark:text-slate-100"}`}>
                            {topic.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <NotesDialog topicId={topic.id} initialNotes={topic.notes} />
                          {topic.status !== 'Completed' && <MarkDoneButton topicId={topic.id} />}
                        </div>
                      </div>

                      <div className="space-y-2 mt-3 pl-2 border-l-2 border-slate-100 dark:border-slate-800 ml-2">
                        {topic.subtopics?.map((sub: any) => (
                          <div key={sub.id} className="flex items-center justify-between ml-6 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2 text-sm">
                              <ChevronRight className="w-3 h-3 text-slate-400" />
                              <span className={sub.status === 'Completed' ? "line-through text-slate-400" : "text-slate-700 dark:text-slate-300"}>
                                {sub.name}
                              </span>
                            </div>
                            {sub.status !== 'Completed' && <MarkSubtopicDoneButton subtopicId={sub.id} />}
                          </div>
                        ))}
                        {topic.status !== 'Completed' && <AddSubtopicDialog topicId={topic.id} />}
                      </div>
                    </div>
                  ))}
                  
                  {totalCount === 0 && <p className="text-sm text-muted-foreground text-center py-4">No topics added yet.</p>}
                  <AddTopicDialog subjectId={subject.id} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}