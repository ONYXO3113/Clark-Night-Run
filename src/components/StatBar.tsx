import React from 'react'

interface StatBarProps {
  label: string
  value: number
  max?: number
  color?: string
  showValue?: boolean
  compact?: boolean
}

export const StatBar: React.FC<StatBarProps> = ({
  label,
  value,
  max = 100,
  color = '#e94560',
  showValue = true,
  compact = false,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={`stat-bar ${compact ? 'compact' : ''}`}>
      <div className="stat-header">
        <span className="stat-label">{label}</span>
        {showValue && <span className="stat-value">{Math.round(value)}</span>}
      </div>
      <div className="stat-track">
        <div
          className="stat-fill"
          style={{
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: `0 0 10px ${color}44`,
          }}
        />
      </div>
    </div>
  )
}
