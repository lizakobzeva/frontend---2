"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createTraining } from "@/lib/api"
import { toast } from "sonner"
import { Plus, Loader2 } from "lucide-react"

interface CreateTrainingDialogProps {
  onCreated: () => void
}

export function CreateTrainingDialog({ onCreated }: CreateTrainingDialogProps) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createTraining({
        date: date || undefined,
        notes: notes || undefined,
      })
      toast.success("Тренировка создана")
      setOpen(false)
      setDate("")
      setNotes("")
      onCreated()
    } catch (error) {
      toast.error("Не удалось создать тренировку")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Новая тренировка
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card">
        <DialogHeader>
          <DialogTitle>Создать тренировку</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="training-date">Дата</Label>
            <Input
              id="training-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-secondary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="training-notes">Заметки</Label>
            <Textarea
              id="training-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Добавьте заметки к тренировке..."
              className="bg-secondary"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Создать"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Отмена
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
