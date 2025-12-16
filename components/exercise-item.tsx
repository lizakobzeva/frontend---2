"use client"

import { useState } from "react"
import type { Exercise } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Edit2, Check, X, Clock, Weight, RotateCcw, Timer } from "lucide-react"

interface ExerciseItemProps {
  exercise: Exercise
  onUpdate: (data: { name: string; repeats: number; weight: number; time_sec?: number }) => Promise<void>
  onDelete: () => void
  onStartTimer?: (seconds: number) => void
}

export function ExerciseItem({ exercise, onUpdate, onDelete, onStartTimer }: ExerciseItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(exercise.name)
  const [repeats, setRepeats] = useState(exercise.repeats.toString())
  const [weight, setWeight] = useState(exercise.weight.toString())
  const [timeSec, setTimeSec] = useState(exercise.time_sec?.toString() || "")
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      await onUpdate({
        name,
        repeats: Number.parseInt(repeats) || 0,
        weight: Number.parseFloat(weight) || 0,
        time_sec: timeSec ? Number.parseInt(timeSec) : undefined,
      })
      setIsEditing(false)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setName(exercise.name)
    setRepeats(exercise.repeats.toString())
    setWeight(exercise.weight.toString())
    setTimeSec(exercise.time_sec?.toString() || "")
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="p-4 bg-secondary rounded-lg space-y-3">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Название упражнения"
          className="bg-background"
        />
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-xs text-muted-foreground">Повторения</label>
            <Input
              type="number"
              value={repeats}
              onChange={(e) => setRepeats(e.target.value)}
              className="bg-background"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Вес (кг)</label>
            <Input
              type="number"
              step="0.5"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="bg-background"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Время (сек)</label>
            <Input
              type="number"
              value={timeSec}
              onChange={(e) => setTimeSec(e.target.value)}
              placeholder="—"
              className="bg-background"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} disabled={loading}>
            <Check className="h-4 w-4 mr-1" />
            Сохранить
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-1" />
            Отмена
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 bg-secondary rounded-lg flex items-center justify-between group">
      <div className="flex-1">
        <h4 className="font-medium">{exercise.name}</h4>
        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <RotateCcw className="h-3 w-3" />
            {exercise.repeats} повт.
          </span>
          <span className="flex items-center gap-1">
            <Weight className="h-3 w-3" />
            {exercise.weight} кг
          </span>
          {exercise.time_sec && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {exercise.time_sec} сек
            </span>
          )}
        </div>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onStartTimer && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary hover:text-primary"
            onClick={() => onStartTimer(exercise.time_sec || 60)}
            title={`Таймер отдыха (${exercise.time_sec || 60} сек)`}
          >
            <Timer className="h-4 w-4" />
          </Button>
        )}
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditing(true)}>
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
