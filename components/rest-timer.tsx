"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react"

interface RestTimerProps {
  defaultSeconds?: number
  onComplete?: () => void
}

export function RestTimer({ defaultSeconds = 90, onComplete }: RestTimerProps) {
  const [seconds, setSeconds] = useState(defaultSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const playSound = useCallback(() => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {})
    }
  }, [soundEnabled])

  useEffect(() => {
    // Create audio element for completion sound
    audioRef.current = new Audio(
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleQcAW6ra4pRPBglwuOrbjU8HCnKy5+aKTQ0Li6zr5Y1TFROPpejkj1wdF5Ck5uGRZCUcmJ/g3ZFsMSKfm9vYkXQ4J6WW1dKQe0ArtZHNzI6DSDCzicXFi4tSN7eExb2JkF0/uX++t4iYZkfAfLawh6BwUcN4r6uHqnpa",
    )
    audioRef.current.volume = 0.5

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  useEffect(() => {
    if (isRunning && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            playSound()
            onComplete?.()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, seconds, playSound, onComplete])

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60)
    const remainingSecs = secs % 60
    return `${mins}:${remainingSecs.toString().padStart(2, "0")}`
  }

  const reset = () => {
    setIsRunning(false)
    setSeconds(defaultSeconds)
  }

  const adjustTime = (amount: number) => {
    if (!isRunning) {
      setSeconds((prev) => Math.max(0, prev + amount))
    }
  }

  const progress = ((defaultSeconds - seconds) / defaultSeconds) * 100

  return (
    <div className="p-4 bg-card border border-border rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm">Таймер отдыха</h4>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSoundEnabled(!soundEnabled)}>
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>
      </div>

      <div className="relative">
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => adjustTime(-15)}
          disabled={isRunning || seconds < 15}
          className="bg-transparent"
        >
          -15
        </Button>
        <div className="text-4xl font-mono font-bold text-primary min-w-[100px] text-center">{formatTime(seconds)}</div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => adjustTime(15)}
          disabled={isRunning}
          className="bg-transparent"
        >
          +15
        </Button>
      </div>

      <div className="flex gap-2 justify-center">
        <Button
          variant={isRunning ? "outline" : "default"}
          size="sm"
          onClick={() => setIsRunning(!isRunning)}
          className={isRunning ? "bg-transparent" : ""}
        >
          {isRunning ? (
            <>
              <Pause className="h-4 w-4 mr-2" />
              Пауза
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Старт
            </>
          )}
        </Button>
        <Button variant="outline" size="sm" onClick={reset} className="bg-transparent">
          <RotateCcw className="h-4 w-4 mr-2" />
          Сброс
        </Button>
      </div>

      <div className="flex justify-center gap-2">
        {[30, 60, 90, 120].map((time) => (
          <Button
            key={time}
            variant="ghost"
            size="sm"
            className="text-xs h-7"
            onClick={() => {
              setIsRunning(false)
              setSeconds(time)
            }}
          >
            {time}с
          </Button>
        ))}
      </div>
    </div>
  )
}
