'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { addSubject, addTopic, completeTopic, updateTopicNotes, addSubtopic, completeSubtopic } from '@/lib/actions/syllabus.actions'
import { toast } from 'sonner'
import { Plus, Check, CheckCircle2, Circle, FileText, CornerDownRight, ChevronDown, ChevronUp, BookOpen, ChevronRight } from 'lucide-react'

// 1. Add Subject Dialog
export function AddSubjectDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    try {
      await addSubject(name)
      toast.success("Subject added!")
      setOpen(false)
      setName('')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
          <Plus className="mr-2 w-4 h-4" /> Add Subject
        </Button>
      </DialogTrigger>
      <DialogContent className="dark:bg-slate-950 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Add New Subject</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <Input 
            placeholder="e.g. Maths, Reasoning, General Awareness..." 
            value={name} 
            onChange={e => setName(e.target.value)} 
            disabled={loading} 
            className="dark:bg-slate-900 dark:border-slate-800 dark:text-white"
          />
          <DialogFooter>
            <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white w-full">
              {loading ? "Adding..." : "Save Subject"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// 2. Add Topic Dialog
export function AddTopicDialog({ subjectId }: { subjectId: string }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    try {
      await addTopic(subjectId, name)
      toast.success("Topic added!")
      setOpen(false)
      setName('')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full mt-4 border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
          <Plus className="mr-2 w-4 h-4" /> Add New Topic
        </Button>
      </DialogTrigger>
      <DialogContent className="dark:bg-slate-950 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Add New Topic</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <Input 
            placeholder="e.g. Percentages, Indian History..." 
            value={name} 
            onChange={e => setName(e.target.value)} 
            disabled={loading} 
            className="dark:bg-slate-900 dark:border-slate-800 dark:text-white"
          />
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full bg-slate-900 dark:bg-white dark:text-slate-900">
              {loading ? "Adding..." : "Save Topic"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// 3. Mark Topic Done Button
export function MarkDoneButton({ topicId }: { topicId: string }) {
  const [loading, setLoading] = useState(false)

  const handleComplete = async () => {
    setLoading(true)
    try {
      await completeTopic(topicId)
      toast.success("Topic marked done! Revisions scheduled.")
    } catch (error: any) {
      toast.error(error.message)
      setLoading(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleComplete} 
      disabled={loading}
      className="hover:bg-green-50 hover:text-green-600 hover:border-green-200 dark:border-slate-700 dark:hover:bg-green-900/20 dark:hover:border-green-800 dark:hover:text-green-400 transition-colors"
    >
      {loading ? "Saving..." : <><Check className="mr-1 w-4 h-4" /> Mark Done</>}
    </Button>
  )
}

// 4. Topic Notes Dialog
export function NotesDialog({ topicId, initialNotes }: { topicId: string, initialNotes: string | null }) {
  const [open, setOpen] = useState(false)
  const [notes, setNotes] = useState(initialNotes || '')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      await updateTopicNotes(topicId, notes)
      toast.success("Notes saved!")
      setOpen(false)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20">
          <FileText className="w-4 h-4 mr-1.5" /> {initialNotes ? 'Edit Notes' : 'Add Notes'}
        </Button>
      </DialogTrigger>
      <DialogContent className="dark:bg-slate-950 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Study Notes</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Textarea 
            placeholder="Jot down important formulas, tricks, or references here..." 
            className="min-h-[200px] dark:bg-slate-900 dark:border-slate-800 dark:text-white focus-visible:ring-blue-500"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            {loading ? "Saving..." : "Save Notes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// 5. Add Subtopic Input Form
export function AddSubtopicDialog({ topicId }: { topicId: string }) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    try {
      await addSubtopic(topicId, name)
      toast.success("Subtopic added!")
      setName('')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleAdd} className="flex items-center gap-2 mt-3 ml-8 mb-4">
      <CornerDownRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
      <Input 
        size={1}
        className="h-8 text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-white focus-visible:ring-1 focus-visible:ring-blue-500" 
        placeholder="Add subtopic (e.g., Simplification)..." 
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={loading}
      />
      <Button type="submit" size="sm" variant="secondary" className="h-8 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700" disabled={loading || !name}>Add</Button>
    </form>
  )
}

// 6. Mark Subtopic Done Button
export function MarkSubtopicDoneButton({ subtopicId }: { subtopicId: string }) {
  const [loading, setLoading] = useState(false)

  const handleComplete = async () => {
    setLoading(true)
    try {
      await completeSubtopic(subtopicId)
    } catch (error: any) {
      toast.error(error.message)
      setLoading(false)
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleComplete} disabled={loading} className="h-7 text-xs text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
      {loading ? "..." : <><CheckCircle2 className="mr-1 w-3 h-3" /> Done</>}
    </Button>
  )
}

// 7. NEW: Collapsible Subject Card Component
export function SubjectCard({ subject }: { subject: any }) {
  // Default to false so they are closed by default (cleaner UI)
  const [isOpen, setIsOpen] = useState(false) 

  const completedCount = subject.topics?.filter((t: any) => t.status === 'Completed').length || 0;
  const totalCount = subject.topics?.length || 0;
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <Card className="shadow-sm border-slate-200 dark:border-slate-800 dark:bg-slate-950 overflow-hidden transition-all duration-200">
      
      {/* Clickable Header */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 hover:bg-indigo-50/50 dark:hover:bg-slate-900 cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl shadow-inner">
            <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{subject.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              {completedCount} of {totalCount} topics completed
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 mt-4 sm:mt-0">
          {/* Miniature Progress Bar */}
          <div className="flex items-center gap-3 flex-1 sm:flex-none">
            <div className="w-full sm:w-32 h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progress}%` }} 
              />
            </div>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 w-9">{progress}%</span>
          </div>
          
          {/* Animated Chevron */}
          <div className="p-1 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
            {isOpen ? (
              <ChevronUp className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content Area */}
      {isOpen && (
        <CardContent className="pt-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 animate-in slide-in-from-top-2 duration-200 fade-in">
          <div className="space-y-4">
            {subject.topics?.map((topic: any) => (
              <div key={topic.id} className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl hover:border-slate-300 dark:hover:border-slate-700 transition-colors bg-slate-50/50 dark:bg-slate-900/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                  
                  <div className="flex items-center gap-3">
                    {topic.status === 'Completed' ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 drop-shadow-sm" />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-300 dark:text-slate-600" />
                    )}
                    <span className={`font-semibold text-lg ${topic.status === 'Completed' ? "line-through text-slate-400 dark:text-slate-600" : "text-slate-800 dark:text-slate-200"}`}>
                      {topic.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto ml-8 sm:ml-0">
                    <NotesDialog topicId={topic.id} initialNotes={topic.notes} />
                    {topic.status !== 'Completed' && <MarkDoneButton topicId={topic.id} />}
                  </div>
                </div>

                <div className="space-y-1 mt-4 pl-2 border-l-2 border-slate-200 dark:border-slate-800 ml-2.5">
                  {topic.subtopics?.map((sub: any) => (
                    <div key={sub.id} className="flex items-center justify-between ml-6 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-colors">
                      <div className="flex items-center gap-2 text-sm">
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                        <span className={`font-medium ${sub.status === 'Completed' ? "line-through text-slate-400 dark:text-slate-600" : "text-slate-700 dark:text-slate-300"}`}>
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
            
            {totalCount === 0 && (
              <div className="text-center py-8">
                <BookOpen className="w-10 h-10 text-slate-200 dark:text-slate-800 mx-auto mb-3" />
                <p className="text-sm text-slate-500 dark:text-slate-400">No topics added to this subject yet.</p>
              </div>
            )}
            
            <AddTopicDialog subjectId={subject.id} />
          </div>
        </CardContent>
      )}
    </Card>
  )
}
