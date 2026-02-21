'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea' // <-- Added missing import
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { addSubject, addTopic, completeTopic, updateTopicNotes, addSubtopic, completeSubtopic } from '@/lib/actions/syllabus.actions'
import { toast } from 'sonner'
import { Plus, Check, CheckCircle2, Circle, FileText, CornerDownRight } from 'lucide-react' // <-- Added missing icons

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
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="mr-2 w-4 h-4" /> Add Subject
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Subject</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <Input 
            placeholder="e.g. Maths, Reasoning, General Awareness..." 
            value={name} 
            onChange={e => setName(e.target.value)} 
            disabled={loading} 
          />
          <DialogFooter>
            <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
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
        <Button variant="ghost" size="sm" className="w-full mt-2 border border-dashed text-slate-500 hover:text-slate-700">
          <Plus className="mr-2 w-4 h-4" /> Add Topic
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Topic</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <Input 
            placeholder="e.g. Percentages, Indian History..." 
            value={name} 
            onChange={e => setName(e.target.value)} 
            disabled={loading} 
          />
          <DialogFooter>
            <Button type="submit" disabled={loading}>
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
      className="hover:bg-green-50 hover:text-green-600 hover:border-green-200"
    >
      {loading ? "Saving..." : <><Check className="mr-1 w-3 h-3" /> Mark Topic Done</>}
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
        <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
          <FileText className="w-4 h-4 mr-1" /> {initialNotes ? 'Edit Notes' : 'Add Notes'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Study Notes</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Textarea 
            placeholder="Jot down important formulas, tricks, or references here..." 
            className="min-h-[200px]"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={loading} className="w-full">
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
    <form onSubmit={handleAdd} className="flex items-center gap-2 mt-2 ml-8 mb-4">
      <CornerDownRight className="w-4 h-4 text-slate-300" />
      <Input 
        size={1}
        className="h-8 text-sm bg-slate-50 border-slate-200" 
        placeholder="Add subtopic (e.g., Simplification)..." 
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={loading}
      />
      <Button type="submit" size="sm" variant="secondary" className="h-8" disabled={loading || !name}>Add</Button>
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
    <Button variant="ghost" size="sm" onClick={handleComplete} disabled={loading} className="h-7 text-xs hover:text-green-600">
      {loading ? "..." : <><CheckCircle2 className="mr-1 w-3 h-3" /> Done</>}
    </Button>
  )
}