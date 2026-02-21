import { useState, useEffect } from 'react'

export type TimerMode = 'stopwatch' | 'pomodoro' | 'break'

export function useTimer() {
  const [mode, setMode] = useState<TimerMode>('stopwatch')
  const [displaySeconds, setDisplaySeconds] = useState(0) // What the clock shows
  const [elapsedStudySeconds, setElapsedStudySeconds] = useState(0) // What we save to the DB
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isActive) {
      interval = setInterval(() => {
        // 1. Update the visible clock
        setDisplaySeconds((prev) => {
          if (mode === 'stopwatch') return prev + 1
          
          if (prev <= 1) {
            setIsActive(false) // Stop timer when countdown hits 0
            return 0
          }
          return prev - 1
        })

        // 2. Secretly track total study time (ignore breaks)
        if (mode === 'stopwatch' || mode === 'pomodoro') {
          setElapsedStudySeconds((prev) => prev + 1)
        }
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isActive, mode])

  const switchMode = (newMode: TimerMode) => {
    setIsActive(false)
    setMode(newMode)
    if (newMode === 'stopwatch') setDisplaySeconds(0)
    if (newMode === 'pomodoro') setDisplaySeconds(25 * 60)
    if (newMode === 'break') setDisplaySeconds(5 * 60)
  }

  const reset = () => {
    setIsActive(false)
    setElapsedStudySeconds(0)
    switchMode(mode) // Resets to the current mode's default time
  }

  return {
    displaySeconds,
    elapsedStudySeconds,
    isActive,
    mode,
    setIsActive,
    switchMode,
    reset
  }
}