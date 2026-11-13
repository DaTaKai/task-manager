import { useState } from 'react'

export default function TaskForm({ onAdd }) {
  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    onAdd(text)
    setText('')
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        className="input"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Жаңа тапсырма…"
        aria-label="Жаңа тапсырма"
        maxLength={200}
        autoFocus
      />
      <button className="btn btn-primary" type="submit" disabled={!text.trim()}>
        Қосу
      </button>
    </form>
  )
}
