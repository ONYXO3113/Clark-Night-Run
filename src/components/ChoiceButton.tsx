import React, { useState } from 'react'
import { Choice } from '../types'
import { playClick } from '../game/audio'

interface ChoiceButtonProps {
  choice: Choice
  onClick: () => void
  index: number
  disabled?: boolean
}

const tagConfig: Record<string, { icon: string; color: string; bg: string }> = {
  'RISQUÉ': { icon: '⚡', color: '#e94560', bg: 'rgba(233, 69, 96, 0.1)' },
  'INTELLIGENT': { icon: '🧠', color: '#4ecdc4', bg: 'rgba(78, 205, 196, 0.1)' },
  'DISCRET': { icon: '👁', color: '#7b68ee', bg: 'rgba(123, 104, 238, 0.1)' },
  'DANGEREUX': { icon: '💥', color: '#ff6b35', bg: 'rgba(255, 107, 53, 0.1)' },
  'FORCE BRUTE': { icon: '🔨', color: '#ffcc00', bg: 'rgba(255, 204, 0, 0.1)' },
}

export const ChoiceButton: React.FC<ChoiceButtonProps> = ({ choice, onClick, index, disabled }) => {
  const [isHovered, setIsHovered] = useState(false)
  const tag = choice.tag ? tagConfig[choice.tag] : null

  return (
    <button
      className={`choice-button ${isHovered ? 'hovered' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={() => { playClick(); onClick() }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled}
      style={{
        animationDelay: `${index * 0.1}s`,
      }}
    >
      <div className="choice-content">
        {tag && (
          <div className="choice-tag" style={{ color: tag.color, background: tag.bg }}>
            <span className="tag-icon">{tag.icon}</span>
            <span className="tag-text">{choice.tag}</span>
          </div>
        )}
        <span className="choice-text">{choice.text}</span>
      </div>
      <div className="choice-glow" />
    </button>
  )
}
