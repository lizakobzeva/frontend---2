"use client"

import { useState, useEffect, useCallback } from "react"
import { type Training, getTrainings, deleteTraining, copyTrainingToToday } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { TrainingCard } from "@/components/training-card"
import { TrainingDetail } from "@/components/training-detail"
import { ProfileScreen } from "@/components/profile-screen"
import { CreateTrainingDialog } from "@/components/create-training-dialog"
import { Dumbbell, User, Loader2, CalendarPlus } from "lucide-react"
import { toast } from "sonner"

export function Dashboard() {
  const [trainings, setTrainings] = useState<Training[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTrainingId, setSelectedTrainingId] = useState<number | null>(null)
  const [showProfile, setShowProfile] = useState(false)
  const [copyingId, setCopyingId] = useState<number | null>(null)

  const loadTrainings = useCallback(async () => {
    try {
      const data = await getTrainings()
      const sortedTrainings = (data.trainings || []).sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })
      setTrainings(sortedTrainings)
    } catch (error) {
      toast.error("Не удалось загрузить тренировки")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTrainings()
  }, [loadTrainings])

  const handleDeleteTraining = async (id: number) => {
    try {
      await deleteTraining(id)
      toast.success("Тренировка удалена")
      loadTrainings()
    } catch (error) {
      toast.error("Не удалось удалить тренировку")
    }
  }

  const handleCopyTraining = async (id: number) => {
    setCopyingId(id)
    try {
      const { trainingId } = await copyTrainingToToday(id)
      toast.success("Тренировка скопирована на сегодня")
      await loadTrainings()
      setSelectedTrainingId(trainingId)
    } catch (error) {
      toast.error("Не удалось скопировать тренировку")
    } finally {
      setCopyingId(null)
    }
  }

  if (showProfile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto p-4">
          <ProfileScreen onBack={() => setShowProfile(false)} />
        </div>
      </div>
    )
  }

  if (selectedTrainingId !== null) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto p-4">
          <TrainingDetail
            trainingId={selectedTrainingId}
            onBack={() => {
              setSelectedTrainingId(null)
              loadTrainings()
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="max-w-2xl mx-auto p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Dumbbell className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold">FitTrack</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setShowProfile(true)} className="relative">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Тренировки</h2>
            <p className="text-muted-foreground">
              {trainings.length > 0 ? `${trainings.length} тренировок` : "Начните отслеживать свои тренировки"}
            </p>
          </div>
          <CreateTrainingDialog onCreated={loadTrainings} />
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : trainings.length > 0 ? (
          <div className="space-y-3">
            {trainings.map((training) => (
              <TrainingCard
                key={training.id}
                training={training}
                onSelect={() => setSelectedTrainingId(training.id)}
                onDelete={() => handleDeleteTraining(training.id)}
                onCopy={() => handleCopyTraining(training.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 space-y-4">
            <div className="p-4 rounded-full bg-secondary inline-block">
              <CalendarPlus className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Нет тренировок</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Создайте свою первую тренировку и начните отслеживать прогресс
              </p>
            </div>
            <CreateTrainingDialog onCreated={loadTrainings} />
          </div>
        )}
      </main>
    </div>
  )
}
