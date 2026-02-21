'use client'

import { useState, useEffect } from 'react'
import { Play, Pause, Square, Flame, Coffee, Timer as TimerIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { saveStudySession } from '@/lib/actions/timer.actions'
import { useTimer, TimerMode } from '@/hooks/use-timer'
import { toast } from 'sonner'

interface Subject {
  id: string
  name: string
}

export function StudyTimer({ subjects }: { subjects: Subject[] }) {
  const [selectedSubject, setSelectedSubject] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)
  
  // Bring in our custom hook!
  const { 
    displaySeconds, 
    elapsedStudySeconds, 
    isActive, 
    mode, 
    setIsActive, 
    switchMode, 
    reset 
  } = useTimer()

  // Listen for Pomodoro/Break completion
  useEffect(() => {
    if (displaySeconds === 0 && (mode === 'pomodoro' || mode === 'break') && !isActive) {
      if (mode === 'pomodoro' && elapsedStudySeconds > 0) {
        toast.success("Pomodoro complete! Time for a 5-minute break.", { icon: '🍅' })
        switchMode('break')
      } else if (mode === 'break') {
        toast.info("Break is over! Ready to focus again?", { icon: '☕' })
        switchMode('pomodoro')
      }
    }
  }, [displaySeconds, mode, isActive, elapsedStudySeconds, switchMode])

  const toggleTimer = () => {
    if (!selectedSubject && subjects.length > 0 && mode !== 'break') {
      toast.error("Please select a subject first!")
      return
    }
    setIsActive(!isActive)
  }

  const stopAndSaveTimer = async () => {
    setIsActive(false)
    const minutesToSave = Math.floor(elapsedStudySeconds / 60)
    
    if (minutesToSave < 1) {
      toast.error("Session too short to save (< 1 min). Keep going!")
      reset()
      return
    }

    setIsSaving(true)
    try {
      await saveStudySession(selectedSubject || null, minutesToSave)
      toast.success(`Awesome! Saved ${minutesToSave} minutes to your dashboard.`)
      reset() // Reset clock and accumulated time
    } catch (error) {
      toast.error("Failed to save session.")
    } finally {
      setIsSaving(false)
    }
  }

  // Format HH:MM:SS
  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0')
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0')
    const s = (totalSeconds % 60).toString().padStart(2, '0')
    return mode === 'stopwatch' && h !== '00' ? `${h}:${m}:${s}` : `${m}:${s}`
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-slate-950 text-white border-slate-800 shadow-xl">
      <CardContent className="flex flex-col items-center p-8 space-y-8">
        
        {/* Mode Switcher */}
        <Tabs defaultValue="stopwatch" className="w-full" onValueChange={(v) => switchMode(v as TimerMode)}>
          <TabsList className="grid w-full grid-cols-3 bg-slate-900 border border-slate-800 text-slate-400">
            <TabsTrigger value="stopwatch" disabled={isActive}><TimerIcon className="w-4 h-4 mr-2"/> Stopwatch</TabsTrigger>
            <TabsTrigger value="pomodoro" disabled={isActive}>🍅 Pomodoro</TabsTrigger>
            <TabsTrigger value="break" disabled={isActive}><Coffee className="w-4 h-4 mr-2"/> Break</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Subject Selector */}
        <div className="w-full space-y-2">
          <label className="text-sm text-slate-400 font-medium">What are we studying?</label>
          <Select value={selectedSubject} onValueChange={setSelectedSubject} disabled={isActive || mode === 'break'}>
            <SelectTrigger className="w-full bg-slate-900 border-slate-700 text-white">
              <SelectValue placeholder={mode === 'break' ? "Taking a break..." : "Select a subject..."} />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((sub) => (
                <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* The Clock */}
        <div className={`text-7xl font-mono font-bold tracking-tighter tabular-nums ${mode === 'break' ? 'text-emerald-400' : 'text-blue-500'}`}>
          {formatTime(displaySeconds)}
        </div>

        {/* Controls */}
        <div className="flex gap-4 w-full">
          <Button 
            onClick={toggleTimer} 
            className={`flex-1 ${isActive ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}
            size="lg"
            disabled={isSaving}
          >
            {isActive ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
            {isActive ? 'Pause' : 'Start'}
          </Button>
          
          <Button 
            onClick={stopAndSaveTimer} 
            variant="destructive" 
            size="lg"
            disabled={elapsedStudySeconds < 60 || isSaving}
          >
            <Square className="mr-2 h-5 w-5" /> 
            {isSaving ? "Saving..." : "Save Session"}
          </Button>
        </div>

        {/* Session Stats Info */}
        <div className="text-xs text-slate-400 flex items-center justify-between w-full">
          <span className="flex items-center">
            <Flame className="w-3 h-3 text-orange-500 mr-1" />
            Unsaved study time: {Math.floor(elapsedStudySeconds / 60)}m
          </span>
          {mode === 'pomodoro' && <span>Target: 25 mins</span>}
        </div>
      </CardContent>
    </Card>
  )
}