const API_BASE = "http://localhost:8080"

export interface Training {
  id: number
  date: string
  notes?: string
  exercises?: Exercise[]
}

export interface Exercise {
  id: number
  training_id: number
  name: string
  repeats: number
  weight: number
  time_sec?: number
}

export interface ApiError {
  error: string
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || "Something went wrong")
  }

  return data
}

// Auth
export async function register(email: string, username: string, password: string) {
  return fetchApi<{ message: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, username, password }),
  })
}

export async function login(username: string, password: string) {
  return fetchApi<{ message: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  })
}

export async function logout() {
  return fetchApi<{ message: string }>("/auth/logout", {
    method: "POST",
  })
}

// Trainings
export async function getTrainings() {
  return fetchApi<{ trainings: Training[] }>("/trainings")
}

export async function getTraining(id: number) {
  return fetchApi<{ training: Training }>(`/trainings/${id}`)
}

export async function createTraining(data: { date?: string; notes?: string }) {
  return fetchApi<{ message: string }>("/trainings", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function deleteTraining(id: number) {
  return fetchApi<{ message: string }>(`/trainings/${id}`, {
    method: "DELETE",
  })
}

export async function updateTraining(id: number, data: { date?: string; notes?: string }) {
  return fetchApi<{ message: string }>(`/trainings/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function copyTrainingToToday(sourceTrainingId: number): Promise<{ trainingId: number }> {
  const { trainings: existingTrainings } = await getTrainings()
  const existingIds = new Set(existingTrainings.map((t) => t.id))

  // Get the source training with exercises
  const { training: sourceTraining } = await getTraining(sourceTrainingId)

  // Create new training with today's date and "(Копия)" prefix
  const today = new Date().toISOString().split("T")[0]
  await createTraining({
    date: today,
    notes: sourceTraining.notes ? `(Копия) ${sourceTraining.notes}` : "(Копия)",
  })

  const { trainings: updatedTrainings } = await getTrainings()
  const newTraining = updatedTrainings.find((t) => !existingIds.has(t.id))

  if (!newTraining) {
    throw new Error("Не удалось найти созданную тренировку")
  }

  // Copy all exercises from source training
  if (sourceTraining.exercises && sourceTraining.exercises.length > 0) {
    for (const exercise of sourceTraining.exercises) {
      await createExercise({
        training_id: newTraining.id,
        name: exercise.name,
        repeats: exercise.repeats,
        weight: exercise.weight,
        time_sec: exercise.time_sec,
      })
    }
  }

  return { trainingId: newTraining.id }
}

// Exercises
export async function createExercise(data: {
  training_id: number
  name: string
  repeats: number
  weight: number
  time_sec?: number
}) {
  return fetchApi<{ message: string }>("/exercises", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateExercise(
  id: number,
  data: {
    training_id: number
    name: string
    repeats: number
    weight: number
    time_sec?: number
  },
) {
  return fetchApi<{ message: string }>(`/exercises/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function deleteExercise(id: number) {
  return fetchApi<{ message: string }>(`/exercises/${id}`, {
    method: "DELETE",
  })
}
