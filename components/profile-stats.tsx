"use client"

import { useMemo } from "react"
import type { Training } from "@/lib/api"
import { Flame, TrendingUp, Calendar, Dumbbell, Award, Target, Zap } from "lucide-react"
import { startOfWeek, endOfWeek, isWithinInterval, parseISO, differenceInDays } from "date-fns"

interface ProfileStatsProps {
  trainings: Training[]
}

export function ProfileStats({ trainings }: ProfileStatsProps) {
  const stats = useMemo(() => {
    const now = new Date()
    const weekStart = startOfWeek(now, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 })

    // This week's trainings
    const thisWeekTrainings = trainings.filter((t) => {
      if (!t.date) return false
      const date = parseISO(t.date)
      return isWithinInterval(date, { start: weekStart, end: weekEnd })
    })

    // Total exercises
    const totalExercises = trainings.reduce((acc, t) => acc + (t.exercises?.length || 0), 0)

    // Total reps
    const totalReps = trainings.reduce((acc, t) => acc + (t.exercises?.reduce((a, e) => a + e.repeats, 0) || 0), 0)

    // Total volume (kg)
    const totalVolume = trainings.reduce(
      (acc, t) => acc + (t.exercises?.reduce((a, e) => a + e.weight * e.repeats, 0) || 0),
      0,
    )

    // Calculate streak
    let streak = 0
    const sortedDates = trainings
      .filter((t) => t.date)
      .map((t) => parseISO(t.date!))
      .sort((a, b) => b.getTime() - a.getTime())

    if (sortedDates.length > 0) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      let lastDate = today
      for (const date of sortedDates) {
        const diff = differenceInDays(lastDate, date)
        if (diff <= 1) {
          streak++
          lastDate = date
        } else {
          break
        }
      }
    }

    // Most popular exercise
    const exerciseCounts: Record<string, number> = {}
    trainings.forEach((t) => {
      t.exercises?.forEach((e) => {
        exerciseCounts[e.name] = (exerciseCounts[e.name] || 0) + 1
      })
    })
    const favoriteExercise = Object.entries(exerciseCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "—"

    // Max weight lifted
    const maxWeight = trainings.reduce((max, t) => Math.max(max, ...(t.exercises?.map((e) => e.weight) || [0])), 0)

    return {
      totalTrainings: trainings.length,
      thisWeekTrainings: thisWeekTrainings.length,
      totalExercises,
      totalReps,
      totalVolume,
      streak,
      favoriteExercise,
      maxWeight,
    }
  }, [trainings])

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-card border border-border rounded-xl">
          <div className="flex items-center gap-2 text-orange-500 mb-2">
            <Flame className="h-5 w-5" />
            <span className="text-sm font-medium">Серия</span>
          </div>
          <p className="text-3xl font-bold">{stats.streak}</p>
          <p className="text-xs text-muted-foreground">дней подряд</p>
        </div>

        <div className="p-4 bg-card border border-border rounded-xl">
          <div className="flex items-center gap-2 text-green-500 mb-2">
            <Calendar className="h-5 w-5" />
            <span className="text-sm font-medium">Эта неделя</span>
          </div>
          <p className="text-3xl font-bold">{stats.thisWeekTrainings}</p>
          <p className="text-xs text-muted-foreground">тренировок</p>
        </div>

        <div className="p-4 bg-card border border-border rounded-xl">
          <div className="flex items-center gap-2 text-blue-500 mb-2">
            <Dumbbell className="h-5 w-5" />
            <span className="text-sm font-medium">Всего</span>
          </div>
          <p className="text-3xl font-bold">{stats.totalTrainings}</p>
          <p className="text-xs text-muted-foreground">тренировок</p>
        </div>

        <div className="p-4 bg-card border border-border rounded-xl">
          <div className="flex items-center gap-2 text-purple-500 mb-2">
            <TrendingUp className="h-5 w-5" />
            <span className="text-sm font-medium">Объём</span>
          </div>
          <p className="text-3xl font-bold">{(stats.totalVolume / 1000).toFixed(1)}</p>
          <p className="text-xs text-muted-foreground">тонн поднято</p>
        </div>
      </div>

      {/* Achievement Cards */}
      <div className="space-y-3">
        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Достижения</h4>

        <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl flex items-center gap-4">
          <div className="p-3 rounded-full bg-yellow-500/20">
            <Award className="h-6 w-6 text-yellow-500" />
          </div>
          <div>
            <p className="font-semibold">Любимое упражнение</p>
            <p className="text-sm text-muted-foreground">{stats.favoriteExercise}</p>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-xl flex items-center gap-4">
          <div className="p-3 rounded-full bg-red-500/20">
            <Zap className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <p className="font-semibold">Максимальный вес</p>
            <p className="text-sm text-muted-foreground">{stats.maxWeight} кг</p>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl flex items-center gap-4">
          <div className="p-3 rounded-full bg-cyan-500/20">
            <Target className="h-6 w-6 text-cyan-500" />
          </div>
          <div>
            <p className="font-semibold">Всего повторений</p>
            <p className="text-sm text-muted-foreground">{stats.totalReps.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="space-y-3">
        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Цель на неделю</h4>
        <div className="p-4 bg-card border border-border rounded-xl space-y-3">
          <div className="flex justify-between text-sm">
            <span>Тренировок</span>
            <span className="font-medium">{stats.thisWeekTrainings} / 5</span>
          </div>
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-orange-400 transition-all"
              style={{ width: `${Math.min((stats.thisWeekTrainings / 5) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {stats.thisWeekTrainings >= 5
              ? "Цель достигнута! Отличная работа!"
              : `Ещё ${5 - stats.thisWeekTrainings} тренировок до цели`}
          </p>
        </div>
      </div>
    </div>
  )
}
