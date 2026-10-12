import React, { useEffect, useRef } from 'react'

interface RainEffectProps {
  intensity?: number
  className?: string
}

export const RainEffect: React.FC<RainEffectProps> = ({ intensity = 50, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const drops: { x: number; y: number; length: number; speed: number; opacity: number }[] = []

    for (let i = 0; i < intensity; i++) {
      drops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 20 + 10,
        speed: Math.random() * 10 + 5,
        opacity: Math.random() * 0.3 + 0.1,
      })
    }

    let animationId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.lineWidth = 1

      for (const drop of drops) {
        ctx.beginPath()
        ctx.moveTo(drop.x, drop.y)
        ctx.lineTo(drop.x - 2, drop.y + drop.length)
        ctx.globalAlpha = drop.opacity
        ctx.stroke()

        drop.y += drop.speed
        drop.x -= 1

        if (drop.y > canvas.height) {
          drop.y = -drop.length
          drop.x = Math.random() * canvas.width
        }
      }

      ctx.globalAlpha = 1
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [intensity])

  return (
    <canvas
      ref={canvasRef}
      className={`rain-effect ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    />
  )
}
