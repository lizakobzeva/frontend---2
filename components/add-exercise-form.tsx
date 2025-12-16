"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, X } from "lucide-react"

interface AddExerciseFormProps {
  onAdd: (data: { name: string; repeats: number; weight: number; time_sec?: number }) => Promise<void>
  onCancel: () => void
}

export function AddExerciseForm({ onAdd, onCancel }: AddExerciseFormProps) {
  const [name, setName] = useState("")
  const [repeats, setRepeats] = useState("")
  const [weight, setWeight] = useState("")
  const [timeSec, setTimeSec] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !repeats || !weight) return
    setLoading(true)
    try {
      await onAdd({
        name,
        repeats: Number.parseInt(repeats),
        weight: Number.parseFloat(weight),
        time_sec: timeSec ? Number.parseInt(timeSec) : undefined,
      })
      setName("")
      setRepeats("")
      setWeight("")
      setTimeSec("")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-card border border-border rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Новое упражнение</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2">
        <Label htmlFor="exercise-name">Название</Label>
        <Input
          id="exercise-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Например: Жим лёжа"
          required
          className="bg-secondary"
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-2">
          <Label htmlFor="exercise-repeats">Повторения</Label>
          <Input
            id="exercise-repeats"
            type="number"
            value={repeats}
            onChange={(e) => setRepeats(e.target.value)}
            placeholder="10"
            required
            className="bg-secondary"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="exercise-weight">Вес (кг)</Label>
          <Input
            id="exercise-weight"
            type="number"
            step="0.5"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="50"
            required
            className="bg-secondary"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="exercise-time">Время (сек)</Label>
          <Input
            id="exercise-time"
            type="number"
            value={timeSec}
            onChange={(e) => setTimeSec(e.target.value)}
            placeholder="—"
            className="bg-secondary"
          />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        <Plus className="h-4 w-4 mr-2" />
        Добавить упражнение
      </Button>
    </form>
  )
}
