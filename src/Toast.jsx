import { useEffect } from 'react'

export default function Toast({ error, onClose, duration = 4000 }) {
  useEffect(() => {
    if (!error) return
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [error, onClose, duration])

  if (!error) return null

  return (
    <div className="toast" role="alert">
      <span className="toast-icon" aria-hidden="true">!</span>
      <span className="toast-message">{error.message}</span>
      <button className="toast-close" type="button" onClick={onClose} aria-label="Жабу">
        ×
      </button>
    </div>
  )
}
