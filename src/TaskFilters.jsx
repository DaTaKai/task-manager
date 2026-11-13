const STATUSES = [
  { value: 'all', label: 'Барлығы' },
  { value: 'active', label: 'Белсенді' },
  { value: 'done', label: 'Орындалған' },
]

const SORTS = [
  { value: 'newest', label: 'Алдымен жаңалары' },
  { value: 'oldest', label: 'Алдымен ескілері' },
  { value: 'alpha', label: 'Әліпби бойынша' },
]

export default function TaskFilters({ filters, onChange, counts }) {
  const set = (patch) => onChange({ ...filters, ...patch })

  return (
    <div className="filters">
      <input
        className="input"
        type="search"
        value={filters.query}
        onChange={(e) => set({ query: e.target.value })}
        placeholder="Іздеу…"
        aria-label="Тапсырмаларды іздеу"
      />

      <div className="filters-row">
        <div className="segmented" role="group" aria-label="Статус бойынша сүзу">
          {STATUSES.map((s) => (
            <button
              key={s.value}
              type="button"
              className={filters.status === s.value ? 'segment active' : 'segment'}
              aria-pressed={filters.status === s.value}
              onClick={() => set({ status: s.value })}
            >
              {s.label}
              <span className="count">{counts[s.value]}</span>
            </button>
          ))}
        </div>

        <select
          className="select"
          value={filters.sort}
          onChange={(e) => set({ sort: e.target.value })}
          aria-label="Сұрыптау"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
