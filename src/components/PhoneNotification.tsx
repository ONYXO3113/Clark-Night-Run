import React, { useState, useEffect } from 'react'

interface PhoneNotificationProps {
  message: string
  sender?: string
  color?: string
  onDismiss?: () => void
}

export const PhoneNotification: React.FC<PhoneNotificationProps> = ({
  message,
  sender = 'TÉLÉPHONE',
  color = '#7b68ee',
  onDismiss,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleClick = () => {
    setIsExpanded(!isExpanded)
  }

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  if (!isVisible) return null

  return (
    <div className={`phone-notification ${isExpanded ? 'expanded' : ''}`} onClick={handleClick}>
      <div className="phone-header">
        <div className="phone-sender" style={{ color }}>
          {sender}
        </div>
        <button className="phone-close" onClick={(e) => { e.stopPropagation(); handleDismiss() }}>
          ×
        </button>
      </div>
      <div className="phone-message">
        {isExpanded ? message : message.slice(0, 50) + (message.length > 50 ? '...' : '')}
      </div>
      {isExpanded && (
        <div className="phone-actions">
          <button className="phone-action-btn" onClick={(e) => { e.stopPropagation(); handleDismiss() }}>
            OK
          </button>
        </div>
      )}
    </div>
  )
}
