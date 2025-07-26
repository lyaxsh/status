'use client'

import { useEffect, useRef } from 'react'
import Timeline from './Timeline'

export default function TimelineContainer() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      // Refetch new updates periodically for real-time updates
      // This will be handled by the Timeline component
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Fade top */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />

      {/* Scrollable content */}
      <div
        ref={scrollRef}
        className="relative z-0 h-full overflow-y-auto pt-20 pb-20 px-4 snap-y snap-mandatory scroll-smooth"
        style={{ scrollBehavior: 'smooth' }}
      >
        <Timeline />
      </div>

      {/* Fade bottom */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
    </div>
  )
} 