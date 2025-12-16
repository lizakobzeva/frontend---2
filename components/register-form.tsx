"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth-provider"
import { toast } from "sonner"
import { Loader2, UserPlus } from "lucide-react"

interface RegisterFormProps {
  onSwitchToLogin: () => void
  onSuccess: () => void
}

export function RegisterForm({ onSwitchToLogin, onSuccess }: RegisterFormProps) {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(email, username, password)
      toast.success("Регистрация успешна! Теперь войдите в аккаунт.")
      onSuccess()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ошибка регистрации")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          required
          className="bg-secondary border-border"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-username">Имя пользователя</Label>
        <Input
          id="reg-username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
          required
          className="bg-secondary border-border"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-password">Пароль</Label>
        <Input
          id="reg-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="bg-secondary border-border"
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <UserPlus className="h-4 w-4 mr-2" />
            Зарегистрироваться
          </>
        )}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Уже есть аккаунт?{" "}
        <button type="button" onClick={onSwitchToLogin} className="text-primary hover:underline">
          Войти
        </button>
      </p>
    </form>
  )
}
