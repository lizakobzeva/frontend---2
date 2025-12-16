"use client"

import { useState, useEffect, useCallback } from "react"
import { type Training, getTraining, createExercise, updateExercise, deleteExercise, updateTraining } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ExerciseItem } from "@/components/exercise-item"
import { AddExerciseForm } from "@/components/add-exercise-form"
import { RestTimer } from "@/components/rest-timer"
import { ArrowLeft, Plus, CalendarDays, FileText, Loader2, Timer, Pencil, Check, X } from "lucide-react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { toast } from "sonner"

interface TrainingDetailProps {
  trainingId: number
  onBack: () => void
}

export function TrainingDetail({ trainingId, onBack }: TrainingDetailProps) {
  const [training, setTraining] = useState<Training | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showRestTimer, setShowRestTimer] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(60)
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [editedNotes, setEditedNotes] = useState("")
  const [savingNotes, setSavingNotes] = useState(false)
  const [isEditingDate, setIsEditingDate] = useState(false)
  const [editedDate, setEditedDate] = useState("")
  const [savingDate, setSavingDate] = useState(false)

  const loadTraining = useCallback(async () => {
    try {
      const data = await getTraining(trainingId)
      setTraining(data.training)
      setEditedNotes(data.training.notes || "")
      setEditedDate(data.training.date || "")
    } catch (error) {
      toast.error("Не удалось загрузить тренировку")
    } finally {
      setLoading(false)
    }
  }, [trainingId])

  useEffect(() => {
    loadTraining()
  }, [loadTraining])

  const handleAddExercise = async (data: {
    name: string
    repeats: number
    weight: number
    time_sec?: number
  }) => {
    try {
      await createExercise({ ...data, training_id: trainingId })
      toast.success("Упражнение добавлено")
      loadTraining()
      setShowAddForm(false)
    } catch (error) {
      toast.error("Не удалось добавить упражнение")
    }
  }

  const handleUpdateExercise = async (
    exerciseId: number,
    data: { name: string; repeats: number; weight: number; time_sec?: number },
  ) => {
    try {
      await updateExercise(exerciseId, { ...data, training_id: trainingId })
      toast.success("Упражнение обновлено")
      loadTraining()
    } catch (error) {
      toast.error("Не удалось обновить упражнение")
    }
  }

  const handleDeleteExercise = async (exerciseId: number) => {
    try {
      await deleteExercise(exerciseId)
      toast.success("Упражнение удалено")
      loadTraining()
    } catch (error) {
      toast.error("Не удалось удалить упражнение")
    }
  }

  const handleStartTimer = (seconds: number) => {
    setTimerSeconds(seconds)
    setShowRestTimer(true)
    toast.info(`Таймер отдыха: ${seconds} сек`)
  }

  const handleSaveNotes = async () => {
    if (!training) return
    setSavingNotes(true)
    try {
      await updateTraining(trainingId, { notes: editedNotes, date: training.date })
      setTraining({ ...training, notes: editedNotes })
      setIsEditingNotes(false)
      toast.success("Описание обновлено")
    } catch (error) {
      toast.error("Не удалось обновить описание")
    } finally {
      setSavingNotes(false)
    }
  }

  const handleCancelEditNotes = () => {
    setEditedNotes(training?.notes || "")
    setIsEditingNotes(false)
  }

  const handleSaveDate = async () => {
    if (!training) return
    setSavingDate(true)
    try {
      await updateTraining(trainingId, { notes: training.notes || "", date: editedDate })
      setTraining({ ...training, date: editedDate })
      setIsEditingDate(false)
      toast.success("Дата обновлена")
    } catch (error) {
      toast.error("Не удалось обновить дату")
    } finally {
      setSavingDate(false)
    }
  }

  const handleCancelEditDate = () => {
    setEditedDate(training?.date || "")
    setIsEditingDate(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!training) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Тренировка не найдена</p>
        <Button variant="outline" onClick={onBack} className="mt-4 bg-transparent">
          Вернуться
        </Button>
      </div>
    )
  }

  const formattedDate = training.date ? format(new Date(training.date), "d MMMM yyyy", { locale: ru }) : "Без даты"

  const totalRestTime = training.exercises?.reduce((acc, e) => acc + (e.time_sec || 0), 0) || 0
  const formatRestTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return mins > 0 ? `${mins} мин ${secs > 0 ? `${secs} сек` : ""}` : `${secs} сек`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          {isEditingDate ? (
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={editedDate}
                onChange={(e) => setEditedDate(e.target.value)}
                className="flex-1 bg-secondary border-border max-w-[200px]"
                autoFocus
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={handleSaveDate}
                disabled={savingDate}
                className="h-8 w-8 text-green-500 hover:text-green-400 hover:bg-green-500/10"
              >
                {savingDate ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleCancelEditDate}
                disabled={savingDate}
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingDate(true)}
              className="text-2xl font-bold flex items-center gap-2 hover:text-primary transition-colors group"
            >
              <CalendarDays className="h-5 w-5 text-primary" />
              {formattedDate}
              <Pencil className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
            </button>
          )}
          {isEditingNotes ? (
            <div className="flex items-center gap-2 mt-2">
              <Input
                value={editedNotes}
                onChange={(e) => setEditedNotes(e.target.value)}
                placeholder="Описание тренировки..."
                className="flex-1 bg-secondary border-border"
                autoFocus
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className="h-8 w-8 text-green-500 hover:text-green-400 hover:bg-green-500/10"
              >
                {savingNotes ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleCancelEditNotes}
                disabled={savingNotes}
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingNotes(true)}
              className="flex items-center gap-2 mt-1 text-muted-foreground hover:text-foreground transition-colors group"
            >
              <FileText className="h-4 w-4" />
              <span>{training.notes || "Добавить описание..."}</span>
              <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          )}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowRestTimer(!showRestTimer)}
          className={showRestTimer ? "bg-primary text-primary-foreground" : "bg-transparent"}
        >
          <Timer className="h-5 w-5" />
        </Button>
      </div>

      {showRestTimer && (
        <RestTimer
          key={timerSeconds}
          defaultSeconds={timerSeconds}
          onComplete={() => toast.success("Отдых окончен! Следующий подход!")}
        />
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Упражнения</h3>
          {!showAddForm && (
            <Button onClick={() => setShowAddForm(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Добавить
            </Button>
          )}
        </div>

        {showAddForm && <AddExerciseForm onAdd={handleAddExercise} onCancel={() => setShowAddForm(false)} />}

        {training.exercises && training.exercises.length > 0 ? (
          <div className="space-y-3">
            {training.exercises.map((exercise) => (
              <ExerciseItem
                key={exercise.id}
                exercise={exercise}
                onUpdate={(data) => handleUpdateExercise(exercise.id, data)}
                onDelete={() => handleDeleteExercise(exercise.id)}
                onStartTimer={handleStartTimer}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-secondary rounded-lg">
            <p className="text-muted-foreground">Нет упражнений</p>
            <p className="text-sm text-muted-foreground mt-1">Добавьте первое упражнение для этой тренировки</p>
          </div>
        )}
      </div>

      {training.exercises && training.exercises.length > 0 && (
        <div className="p-4 bg-card border border-border rounded-lg">
          <h4 className="font-medium mb-3">Сводка тренировки</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">{training.exercises.length}</p>
              <p className="text-sm text-muted-foreground">Упражнений</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">
                {training.exercises.reduce((acc, e) => acc + e.repeats, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Всего повторений</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">
                {totalRestTime > 0 ? formatRestTime(totalRestTime) : "—"}
              </p>
              <p className="text-sm text-muted-foreground">Общее время отдыха</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
