import React, { useState, useEffect } from 'react'

interface TypewriterTextProps {
  text: string
  speed?: number
  onComplete?: () => void
  className?: string
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 30,
  onComplete,
  className = '',
}) => {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    setDisplayedText('')
    setIsComplete(false)

    let index = 0
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1))
        index++
      } else {
        clearInterval(interval)
        setIsComplete(true)
        onComplete?.()
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed])

  return (
    <span className={`typewriter-text ${className} ${isComplete ? 'complete' : ''}`}>
      {displayedText}
      {!isComplete && <span className="cursor">|</span>}
    </span>
  )
}
