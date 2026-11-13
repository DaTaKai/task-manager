import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'task-manager:tasks'
const FAIL_RATE = 0.12 // "сервер" қатесінің ықтималдығы

// --- localStorage ("сервердегі" дерекқор рөлінде) ---
const readStorage = () => {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

const writeStorage = (tasks) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    /* storage қолжетімсіз болса — үнсіз өткіземіз */
  }
}

// --- Серверлік сұрауды имитациялау: кідіріс + кездейсоқ қате ---
const fakeRequest = (failRate = FAIL_RATE) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < failRate) reject(new Error('Сервер жауап бермеді'))
      else resolve()
    }, 300 + Math.random() * 500)
  })

const createId = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`

export function useTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pendingIds, setPendingIds] = useState(() => new Set())

  // Бастапқы жүктеу
  useEffect(() => {
    let cancelled = false
    fakeRequest(0).then(() => {
      if (cancelled) return
      setTasks(readStorage())
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const setPending = (id, on) =>
    setPendingIds((prev) => {
      const next = new Set(prev)
      if (on) next.add(id)
      else next.delete(id)
      return next
    })

  // Оптимистік жаңарту: UI бірден өзгереді, қате болса — кері қайтарылады
  const mutate = useCallback(async (id, apply, revert, failMessage) => {
    setTasks(apply)
    setPending(id, true)
    try {
      await fakeRequest()
      writeStorage(apply(readStorage()))
    } catch (e) {
      setTasks(revert)
      setError({ id: Date.now(), message: `${failMessage}. ${e.message}, қайталап көріңіз.` })
    } finally {
      setPending(id, false)
    }
  }, [])

  const addTask = useCallback(
    (text) => {
      const title = text.trim()
      if (!title) return
      const task = { id: createId(), text: title, done: false, createdAt: Date.now() }
      mutate(
        task.id,
        (list) => [task, ...list],
        (list) => list.filter((t) => t.id !== task.id),
        'Тапсырма қосылмады',
      )
    },
    [mutate],
  )

  const patchTask = useCallback(
    (id, patch, failMessage) => {
      const original = tasks.find((t) => t.id === id)
      if (!original) return
      mutate(
        id,
        (list) => list.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        (list) => list.map((t) => (t.id === id ? original : t)),
        failMessage,
      )
    },
    [tasks, mutate],
  )

  const updateTask = useCallback(
    (id, text) => {
      const title = text.trim()
      if (title) patchTask(id, { text: title }, 'Өзгеріс сақталмады')
    },
    [patchTask],
  )

  const toggleTask = useCallback(
    (id) => {
      const task = tasks.find((t) => t.id === id)
      if (task) patchTask(id, { done: !task.done }, 'Статус өзгермеді')
    },
    [tasks, patchTask],
  )

  const deleteTask = useCallback(
    (id) => {
      const index = tasks.findIndex((t) => t.id === id)
      if (index === -1) return
      const original = tasks[index]
      mutate(
        id,
        (list) => list.filter((t) => t.id !== id),
        (list) => {
          if (list.some((t) => t.id === id)) return list
          const next = [...list]
          next.splice(Math.min(index, next.length), 0, original)
          return next
        },
        'Тапсырма өшірілмеді',
      )
    },
    [tasks, mutate],
  )

  const clearError = useCallback(() => setError(null), [])

  return {
    tasks,
    loading,
    error,
    pendingIds,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    clearError,
  }
}
