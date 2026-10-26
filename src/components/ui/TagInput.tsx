import { useId, useState, type KeyboardEvent } from 'react'

interface TagInputProps {
  label: string
  value: string[]
  onChange: (value: string[]) => void
  suggestions?: string[] // existing values, offered as autocomplete
  placeholder?: string
  error?: string
  hint?: string
}

// A text box that turns entries into removable chips.
// Enter or comma adds one; Backspace on an empty box removes the last one.
export default function TagInput({ label, value, onChange, suggestions = [], placeholder, error, hint }: TagInputProps) {
  const id = useId()
  const listId = `${id}-suggestions`
  const [draft, setDraft] = useState('')

  // Adds every non-empty entry in `raw` (comma-separated), skipping duplicates
  function add(raw: string) {
    const next = [...value]
    for (const part of raw.split(',')) {
      const item = part.trim()
      // Case-insensitive duplicate check, like the backend's findByNameIgnoreCase
      if (item && !next.some((v) => v.toLowerCase() === item.toLowerCase())) {
        next.push(item)
      }
    }
    if (next.length !== value.length) onChange(next)
    setDraft('')
  }

  // Typing or pasting "React, Docker, Go" turns everything before the last comma
  // into chips and keeps the rest as the draft.
  function handleChange(text: string) {
    const lastComma = text.lastIndexOf(',')
    if (lastComma === -1) {
      setDraft(text)
      return
    }
    add(text.slice(0, lastComma))
    setDraft(text.slice(lastComma + 1).trimStart())
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault() // stop Enter from submitting the form
      add(draft)
    } else if (e.key === 'Backspace' && draft === '' && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div
        className={`flex flex-wrap items-center gap-1.5 rounded-lg border bg-surface px-2 py-1.5 focus-within:border-transparent focus-within:outline-2 focus-within:outline-accent ${
          error ? 'border-danger' : 'border-line'
        }`}
      >
        {value.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-1 rounded-full bg-accent-soft py-0.5 pr-1 pl-2.5 text-xs font-medium text-accent-fg"
          >
            {item}
            <button
              type="button"
              onClick={() => onChange(value.filter((v) => v !== item))}
              className="grid size-4 cursor-pointer place-items-center rounded-full hover:bg-accent/20"
              aria-label={`Remove ${item}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          id={id}
          list={suggestions.length ? listId : undefined}
          value={draft}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => add(draft)} // don't lose a typed-but-not-added entry
          placeholder={value.length === 0 ? placeholder : ''}
          className="min-w-32 flex-1 bg-transparent px-1 py-0.5 text-sm outline-none placeholder:text-muted/70"
        />
        {suggestions.length > 0 && (
          <datalist id={listId}>
            {suggestions
              .filter((s) => !value.includes(s))
              .map((s) => (
                <option key={s} value={s} />
              ))}
          </datalist>
        )}
      </div>
      {error ? (
        <p className="text-xs text-danger">{error}</p>
      ) : (
        <p className="text-xs text-muted">{hint ?? 'Press Enter or comma to add.'}</p>
      )}
    </div>
  )
}
