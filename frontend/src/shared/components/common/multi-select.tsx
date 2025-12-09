import { useState, useRef, useEffect } from 'react'
import { cn } from '@/shared/utils/cn'

interface MultiSelectProps {
  options: string[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  className?: string
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder,
  className,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const toggleOption = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option))
    } else {
      onChange([...value, option])
    }
  }

  const removeOption = (option: string) => {
    onChange(value.filter((v) => v !== option))
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'min-h-[42px] w-full rounded-md border border-gray-300 bg-white px-3 py-2',
          'cursor-pointer transition-colors',
          'focus:border-primary-500 focus:ring-primary-500 hover:border-gray-400 focus:ring-1 focus:outline-none',
          isOpen && 'border-primary-500 ring-primary-500 ring-1'
        )}
      >
        {value.length === 0 ? (
          <span className="text-gray-400">{placeholder || 'Select options...'}</span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {value.map((option) => (
              <span
                key={option}
                className="bg-primary-100 text-primary-700 inline-flex items-center gap-1 rounded px-2 py-0.5 text-sm"
              >
                {option}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeOption(option)
                  }}
                  className="text-primary-600 hover:text-primary-800 transition-colors"
                >
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => toggleOption(option)}
              className={cn(
                'flex cursor-pointer items-center gap-2 px-3 py-2 transition-colors hover:bg-gray-100',
                value.includes(option) && 'bg-primary-50 hover:bg-primary-100'
              )}
            >
              <input
                type="checkbox"
                checked={value.includes(option)}
                onChange={(e) => {
                  e.stopPropagation()
                  toggleOption(option)
                }}
                className="text-primary-600 focus:ring-primary-500 h-4 w-4 rounded border-gray-300"
              />
              <span
                className={cn('text-sm', value.includes(option) && 'text-primary-700 font-medium')}
              >
                {option}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
