"use client"

import type { Training } from "@/lib/api"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, ChevronRight, Trash2, FileText, Copy, Clock, CalendarCheck, History } from "lucide-react"
import { format, isToday, isFuture, isPast } from "date-fns"
import { ru } from "date-fns/locale"

interface TrainingCardProps {
  training: Training
  onSelect: () => void
  onDelete: () => void
  onCopy: () => void
}

function getDateStatus(dateStr: string) {
  const date = new Date(dateStr)
  if (isToday(date)) return "today"
  if (isFuture(date)) return "future"
  if (isPast(date)) return "past"
  return "unknown"
}

export function TrainingCard({ training, onSelect, onDelete, onCopy }: TrainingCardProps) {
  const formattedDate = training.date ? format(new Date(training.date), "d MMMM yyyy", { locale: ru }) : "Без даты"

  const dateStatus = training.date ? getDateStatus(training.date) : "unknown"

  const statusStyles = {
    today: {
      border: "border-primary",
      badge: "bg-primary text-primary-foreground",
      badgeText: "Сегодня",
      icon: CalendarCheck,
    },
    future: {
      border: "border-blue-500/50",
      badge: "bg-blue-500/20 text-blue-400",
      badgeText: "Запланировано",
      icon: Clock,
    },
    past: {
      border: "border-border",
      badge: "bg-muted text-muted-foreground",
      badgeText: "Завершено",
      icon: History,
    },
    unknown: {
      border: "border-border",
      badge: "bg-muted text-muted-foreground",
      badgeText: "",
      icon: CalendarDays,
    },
  }

  const style = statusStyles[dateStatus]
  const StatusIcon = style.icon

  return (
    <Card
      className={`bg-card ${style.border} hover:border-primary/50 transition-colors group cursor-pointer`}
      onClick={onSelect}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 ${dateStatus === "today" ? "text-primary" : dateStatus === "future" ? "text-blue-400" : "text-muted-foreground"}`}
            >
              <StatusIcon className="h-4 w-4" />
              <span className="font-medium">{formattedDate}</span>
            </div>
            {style.badgeText && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${style.badge}`}>{style.badgeText}</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary"
              onClick={(e) => {
                e.stopPropagation()
                onCopy()
              }}
              title="Копировать на сегодня"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            {training.notes ? (
              <>
                <FileText className="h-4 w-4" />
                <span className="text-sm line-clamp-1">{training.notes}</span>
              </>
            ) : (
              <span className="text-sm italic">Нет заметок</span>
            )}
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </CardContent>
    </Card>
  )
}
