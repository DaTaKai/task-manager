import { useEffect, useRef, useState } from 'react'

const formatDate = (ts) =>
  new Date(ts).toLocaleString('kk-KZ', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })

export default function TaskItem({ task, pending, onToggle, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(task.text)
  const inputRef = useRef(null)

  useEffect(() => {
    if (editing) inputRef.current?.select()
  }, [editing])

  const startEdit = () => {
    setDraft(task.text)
    setEditing(true)
  }

  const save = () => {
    const next = draft.trim()
    if (next && next !== task.text) onUpdate(task.id, next)
    setEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') save()
    if (e.key === 'Escape') setEditing(false)
  }

  const className = ['task', task.done && 'done', pending && 'pending'].filter(Boolean).join(' ')

  return (
    <li className={className}>
      <input
        className="checkbox"
        type="checkbox"
        checked={task.done}
        onChange={() => onToggle(task.id)}
        aria-label={task.done ? 'Орындалмаған деп белгілеу' : 'Орындалған деп белгілеу'}
      />

      <div className="task-body">
        {editing ? (
          <input
            ref={inputRef}
            className="input input-inline"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={save}
            maxLength={200}
            aria-label="Тапсырма мәтінін өзгерту"
          />
        ) : (
          <span className="task-text" onDoubleClick={startEdit} title="Өзгерту үшін екі рет басыңыз">
            {task.text}
          </span>
        )}
        <span className="task-meta">{pending ? 'Сақталуда…' : formatDate(task.createdAt)}</span>
      </div>

      {!editing && (
        <div className="task-actions">
          <button className="btn btn-ghost" type="button" onClick={startEdit}>
            Өзгерту
          </button>
          <button className="btn btn-ghost btn-danger" type="button" onClick={() => onDelete(task.id)}>
            Өшіру
          </button>
        </div>
      )}
    </li>
  )
}
