'use client'

import { useEffect, useRef } from 'react'

interface ActivityRingsProps {
  productivityScore: number // 0-100
  healthScore: number // 0-100
  steps: number
  calories: number
  distance: number // in meters
}

export default function ActivityRings({
  productivityScore,
  healthScore,
  steps,
  calories,
  distance
}: ActivityRingsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Function to render the canvas
    const render = () => {
      // Detect dark mode
      const isDarkMode = document.documentElement.classList.contains('dark')

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Calculate percentages for health metrics (with goals)
      const stepsGoal = 10000
      const caloriesGoal = 2000
      const distanceGoal = 5000 // 5km in meters

      const stepsPercent = Math.min((steps / stepsGoal) * 100, 100)
      const caloriesPercent = Math.min((calories / caloriesGoal) * 100, 100)
      const distancePercent = Math.min((distance / distanceGoal) * 100, 100)

      // Calculate average overall score
      const overallScore = (productivityScore + healthScore) / 2

      // Draw rings from outer to inner: Red, Green, Blue
      drawRing(ctx, centerX, centerY, 160, 18, stepsPercent, '#FF3B30') // Red - Steps (outermost)
      drawRing(ctx, centerX, centerY, 130, 16, caloriesPercent, '#34C759') // Green - Calories (middle)
      drawRing(ctx, centerX, centerY, 105, 16, overallScore, '#3b82f6') // Blue - Overall (innermost)

      // Draw center smiley with dynamic smile
      drawSmiley(ctx, centerX, centerY, productivityScore, healthScore, isDarkMode)
    }

    // Initial render
    render()

    // Set up MutationObserver to watch for class changes on html element
    const observer = new MutationObserver(() => {
      render()
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    // Cleanup observer on unmount
    return () => {
      observer.disconnect()
    }
  }, [productivityScore, healthScore, steps, calories, distance])

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="max-w-full"
      />
    </div>
  )
}

// Draw a single ring
function drawRing(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  lineWidth: number,
  percentage: number,
  color: string
) {
  // Background ring (gray)
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
  ctx.strokeStyle = 'rgba(128, 128, 128, 0.15)'
  ctx.lineWidth = lineWidth
  ctx.lineCap = 'round'
  ctx.stroke()

  // Progress ring
  if (percentage > 0) {
    const startAngle = -Math.PI / 2 // Start at top
    const endAngle = startAngle + (2 * Math.PI * percentage) / 100

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, startAngle, endAngle)
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'
    ctx.stroke()
  }
}

// Draw a cute, expressive eye
function drawEye(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string
) {
  const isDark = color === '#fff'

  // Draw white of the eye (sclera) - larger for cuter look
  ctx.beginPath()
  ctx.arc(x, y, 9, 0, 2 * Math.PI)
  ctx.fillStyle = isDark ? '#1a1a1a' : '#ffffff'
  ctx.fill()
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.stroke()

  // Draw iris (larger, colored)
  ctx.beginPath()
  ctx.arc(x, y + 1, 6, 0, 2 * Math.PI)
  // Use a gradient for depth
  const gradient = ctx.createRadialGradient(x - 1, y, 2, x, y + 1, 6)
  if (isDark) {
    gradient.addColorStop(0, '#4a9eff')
    gradient.addColorStop(1, '#2d7dd2')
  } else {
    gradient.addColorStop(0, '#5eaaff')
    gradient.addColorStop(1, '#3b82f6')
  }
  ctx.fillStyle = gradient
  ctx.fill()

  // Draw pupil (black, slightly off-center for character)
  ctx.beginPath()
  ctx.arc(x, y + 1, 3, 0, 2 * Math.PI)
  ctx.fillStyle = '#000'
  ctx.fill()

  // Draw large highlight (top-left sparkle)
  ctx.beginPath()
  ctx.arc(x - 2, y - 1, 2.5, 0, 2 * Math.PI)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
  ctx.fill()

  // Draw smaller highlight (bottom-right accent)
  ctx.beginPath()
  ctx.arc(x + 2, y + 2, 1, 0, 2 * Math.PI)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
  ctx.fill()

  // Add eyelash effect (optional cute detail)
  ctx.strokeStyle = color
  ctx.lineWidth = 1.5
  ctx.lineCap = 'round'

  // Top right lash
  ctx.beginPath()
  ctx.moveTo(x + 6, y - 6)
  ctx.lineTo(x + 8, y - 8)
  ctx.stroke()

  // Top center lash
  ctx.beginPath()
  ctx.moveTo(x + 2, y - 8)
  ctx.lineTo(x + 2, y - 10)
  ctx.stroke()
}

// Draw smiley with dynamic two-curve smile (no ring around it)
function drawSmiley(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  productivityScore: number,
  healthScore: number,
  isDarkMode: boolean
) {
  // Draw eyes - more realistic eye shape
  const eyeColor = isDarkMode ? '#fff' : '#000'

  // Left eye
  drawEye(ctx, centerX - 18, centerY - 30, eyeColor)

  // Right eye
  drawEye(ctx, centerX + 18, centerY - 30, eyeColor)

  // Draw dynamic smile with two separate colored curves
  // LEFT curve (blue) - controlled by HEALTH score
  // RIGHT curve (green) - controlled by PRODUCTIVITY score
  // Both curves originate from center and curve outward

  const smileRadius = 90 // Maximum curve depth at 100%
  const mouthCenterY = centerY + 60 // Y position at center
  const curveWidth = 52 // Horizontal width of each curve

  ctx.lineWidth = 10
  ctx.lineCap = 'round'

  // LEFT CURVE - HEALTH (Blue)
  // Goes from center (origin) outward/upward to left
  const leftCurveAmount = healthScore / 100 // 0 to 1
  const leftStartX = centerX // Center (origin)
  const leftStartY = mouthCenterY // Center bottom
  const leftEndX = centerX - curveWidth // Left end
  const leftEndY = mouthCenterY - (smileRadius * leftCurveAmount) // Rises based on score

  ctx.beginPath()
  ctx.strokeStyle = isDarkMode ? '#fff' : '#000' // White in dark mode, black in light mode
  ctx.moveTo(leftStartX, leftStartY)

  if (leftCurveAmount > 0) {
    // Smooth exponential curve upward to the left
    ctx.quadraticCurveTo(
      leftStartX - curveWidth / 2, // Control point X (midpoint)
      leftStartY, // Control point Y (stays low for exponential feel)
      leftEndX, // End at left
      leftEndY // End height based on score
    )
  } else {
    // Flat line when score is 0
    ctx.lineTo(leftEndX, leftStartY)
  }

  ctx.stroke()

  // RIGHT CURVE - PRODUCTIVITY (Green)
  // Goes from center (origin) outward/upward to right
  const rightCurveAmount = productivityScore / 100 // 0 to 1
  const rightStartX = centerX // Center (origin)
  const rightStartY = mouthCenterY // Center bottom
  const rightEndX = centerX + curveWidth // Right end
  const rightEndY = mouthCenterY - (smileRadius * rightCurveAmount) // Rises based on score

  ctx.beginPath()
  ctx.strokeStyle = isDarkMode ? '#fff' : '#000' // White in dark mode, black in light mode
  ctx.moveTo(rightStartX, rightStartY)

  if (rightCurveAmount > 0) {
    // Smooth exponential curve upward to the right
    ctx.quadraticCurveTo(
      rightStartX + curveWidth / 2, // Control point X (midpoint)
      rightStartY, // Control point Y (stays low for exponential feel)
      rightEndX, // End at right
      rightEndY // End height based on score
    )
  } else {
    // Flat line when score is 0
    ctx.lineTo(rightEndX, rightStartY)
  }

  ctx.stroke()
}
