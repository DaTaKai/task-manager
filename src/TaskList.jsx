import TaskItem from './TaskItem.jsx'

export default function TaskList({ tasks, loading, hasAnyTasks, pendingIds, onToggle, onUpdate, onDelete }) {
  if (loading) {
    return (
      <ul className="task-list" aria-busy="true">
        {[0, 1, 2].map((i) => (
          <li key={i} className="task skeleton" />
        ))}
      </ul>
    )
  }

  if (tasks.length === 0) {
    return (
      <p className="empty">
        {hasAnyTasks ? 'Сүзгіге сәйкес тапсырма табылмады.' : 'Әзірге тапсырма жоқ. Алғашқысын қосыңыз!'}
      </p>
    )
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          pending={pendingIds.has(task.id)}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}
