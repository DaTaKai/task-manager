import { useMemo, useState } from 'react'
import { useTasks } from './useTasks.js'
import TaskForm from './TaskForm.jsx'
import TaskFilters from './TaskFilters.jsx'
import TaskList from './TaskList.jsx'
import Toast from './Toast.jsx'

const SORTERS = {
  newest: (a, b) => b.createdAt - a.createdAt,
  oldest: (a, b) => a.createdAt - b.createdAt,
  alpha: (a, b) => a.text.localeCompare(b.text, 'kk'),
}

export default function App() {
  const { tasks, loading, error, pendingIds, addTask, updateTask, toggleTask, deleteTask, clearError } =
    useTasks()
  const [filters, setFilters] = useState({ query: '', status: 'all', sort: 'newest' })

  const counts = useMemo(() => {
    const done = tasks.filter((t) => t.done).length
    return { all: tasks.length, active: tasks.length - done, done }
  }, [tasks])

  const visibleTasks = useMemo(() => {
    const query = filters.query.trim().toLowerCase()
    return tasks
      .filter((t) => {
        if (filters.status === 'active' && t.done) return false
        if (filters.status === 'done' && !t.done) return false
        return !query || t.text.toLowerCase().includes(query)
      })
      .sort(SORTERS[filters.sort])
  }, [tasks, filters])

  const progress = counts.all ? Math.round((counts.done / counts.all) * 100) : 0

  return (
    <main className="app">
      <header className="header">
        <div>
          <h1>Тапсырмалар</h1>
          <p className="subtitle">
            {counts.all ? `${counts.done} / ${counts.all} орындалды` : 'Күніңізді жоспарлаңыз'}
          </p>
        </div>
        <span className="progress-value">{progress}%</span>
      </header>
      <div className="progress" aria-hidden="true">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>

      <TaskForm onAdd={addTask} />
      <TaskFilters filters={filters} onChange={setFilters} counts={counts} />
      <TaskList
        tasks={visibleTasks}
        loading={loading}
        hasAnyTasks={tasks.length > 0}
        pendingIds={pendingIds}
        onToggle={toggleTask}
        onUpdate={updateTask}
        onDelete={deleteTask}
      />

      <Toast error={error} onClose={clearError} />
    </main>
  )
}
