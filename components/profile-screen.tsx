"use client"

import { useState, useEffect, useCallback } from "react"
import { type Training, getTrainings } from "@/lib/api"
import { useAuth } from "@/components/auth-provider"
import { ProfileStats } from "@/components/profile-stats"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User, Loader2, LogOut } from "lucide-react"
import { toast } from "sonner"

interface ProfileScreenProps {
  onBack: () => void
}

export function ProfileScreen({ onBack }: ProfileScreenProps) {
  const [trainings, setTrainings] = useState<Training[]>([])
  const [loading, setLoading] = useState(true)
  const { logout, username } = useAuth()

  const loadTrainings = useCallback(async () => {
    try {
      const data = await getTrainings()
      setTrainings(data.trainings || [])
    } catch (error) {
      toast.error("Не удалось загрузить данные")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTrainings()
  }, [loadTrainings])

  const handleLogout = async () => {
    try {
      await logout()
      toast.success("Вы вышли из аккаунта")
    } catch (error) {
      toast.error("Ошибка при выходе")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">Профиль</h2>
          <p className="text-muted-foreground text-sm">Ваша статистика и достижения</p>
        </div>
      </div>

      {/* Avatar Section */}
      <div className="flex flex-col items-center py-6 space-y-3">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center">
          <User className="h-12 w-12 text-white" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold">{username || "Пользователь"}</h3>
          <p className="text-sm text-muted-foreground">Продолжай в том же духе!</p>
        </div>
      </div>

      {/* Stats */}
      <ProfileStats trainings={trainings} />

      {/* Logout Button */}
      <Button variant="outline" className="w-full bg-transparent" onClick={handleLogout}>
        <LogOut className="h-4 w-4 mr-2" />
        Выйти из аккаунта
      </Button>
    </div>
  )
}
