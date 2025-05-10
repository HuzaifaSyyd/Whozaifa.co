"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
  alpha: number
  connections: number[]
}

export default function AdvancedAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles: Particle[] = useRef([]).current
  const mousePosition = useRef({ x: 0, y: 0 })
  const animationFrameId = useRef<number>()
  const hue = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full screen
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY }
    }

    // Initialize particles
    const initParticles = () => {
      particles.length = 0
      const particleCount = Math.min(Math.floor(window.innerWidth * 0.05), 100)

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 1.5,
          speedY: (Math.random() - 0.5) * 1.5,
          color: `hsl(${Math.random() * 60 + 250}, 100%, 50%)`,
          alpha: Math.random() * 0.5 + 0.5,
          connections: [],
        })
      }
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update hue for color cycling
      hue.current = (hue.current + 0.5) % 360

      // Draw wave lines
      drawWaveLines(ctx, canvas)

      // Update and draw particles
      updateParticles(ctx, canvas)

      // Draw connections between particles
      drawConnections(ctx)

      animationFrameId.current = requestAnimationFrame(animate)
    }

    const drawWaveLines = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      const time = Date.now() * 0.001

      // Draw multiple wave lines
      for (let i = 0; i < 3; i++) {
        ctx.beginPath()
        ctx.moveTo(0, canvas.height / 2)

        const amplitude = 50 + Math.sin(time * 0.5) * 20
        const frequency = 0.01 + Math.sin(time * 0.2) * 0.005
        const speed = time * (0.5 + i * 0.2)

        for (let x = 0; x < canvas.width; x += 5) {
          const y =
            canvas.height / 2 +
            Math.sin(x * frequency + speed) * amplitude * Math.sin(time * 0.3) +
            Math.sin(x * frequency * 2 + speed * 1.5) * amplitude * 0.5

          ctx.lineTo(x, y)
        }

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
        gradient.addColorStop(0, `hsla(${(hue.current + i * 30) % 360}, 100%, 70%, 0.1)`)
        gradient.addColorStop(0.5, `hsla(${(hue.current + 120 + i * 30) % 360}, 100%, 70%, 0.2)`)
        gradient.addColorStop(1, `hsla(${(hue.current + 240 + i * 30) % 360}, 100%, 70%, 0.1)`)

        ctx.strokeStyle = gradient
        ctx.lineWidth = 2
        ctx.stroke()
      }
    }

    const updateParticles = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Update position
        p.x += p.speedX
        p.y += p.speedY

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fill()
        ctx.globalAlpha = 1

        // Add glow effect
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2)
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4)
        gradient.addColorStop(0, `hsla(${hue.current}, 100%, 70%, 0.3)`)
        gradient.addColorStop(1, `hsla(${hue.current}, 100%, 70%, 0)`)
        ctx.fillStyle = gradient
        ctx.fill()

        // Find connections to other particles
        p.connections = []
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            p.connections.push(j)
          }
        }
      }
    }

    const drawConnections = (ctx: CanvasRenderingContext2D) => {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        for (const j of p.connections) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          // Draw connection line with gradient
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p2.x, p2.y)

          const opacity = 1 - distance / 150
          ctx.strokeStyle = `hsla(${hue.current}, 100%, 70%, ${opacity * 0.5})`
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }

      // Draw connection to mouse if close enough
      for (const p of particles) {
        const dx = p.x - mousePosition.current.x
        const dy = p.y - mousePosition.current.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 200) {
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(mousePosition.current.x, mousePosition.current.y)

          const opacity = 1 - distance / 200
          ctx.strokeStyle = `hsla(${hue.current}, 100%, 90%, ${opacity * 0.7})`
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }
    }

    // Initialize
    window.addEventListener("resize", handleResize)
    window.addEventListener("mousemove", handleMouseMove)
    handleResize()
    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [particles])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" style={{ pointerEvents: "none" }} />
}
