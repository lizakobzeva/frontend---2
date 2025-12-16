"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginForm } from "@/components/login-form"
import { RegisterForm } from "@/components/register-form"
import { Dumbbell } from "lucide-react"

export function AuthScreen() {
  const [mode, setMode] = useState<"login" | "register">("login")

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10">
              <Dumbbell className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">FitTrack</h1>
          </div>
          <p className="text-muted-foreground">Отслеживайте прогресс своих тренировок</p>
        </div>
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>{mode === "login" ? "Вход" : "Регистрация"}</CardTitle>
            <CardDescription>{mode === "login" ? "Войдите в свой аккаунт" : "Создайте новый аккаунт"}</CardDescription>
          </CardHeader>
          <CardContent>
            {mode === "login" ? (
              <LoginForm onSwitchToRegister={() => setMode("register")} />
            ) : (
              <RegisterForm onSwitchToLogin={() => setMode("login")} onSuccess={() => setMode("login")} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
