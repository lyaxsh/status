'use client'

import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Image from 'next/image'

interface Update {
  id: number
  text: string
  imageUrl?: string | null
  color?: string | null
  createdAt: string
}

interface TimelineResponse {
  updates: Update[]
  hasMore: boolean
  page: number
  totalCount: number
}

export default function Timeline() {
  const [updates, setUpdates] = useState<Update[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null);
  const firstDotRef = useRef<HTMLDivElement>(null);
  const lastDotRef = useRef<HTMLDivElement>(null);
  const [lineStyle, setLineStyle] = useState<{ top: number; height: number }>({ top: 0, height: 0 });

  const fetchUpdates = async (pageNum: number) => {
    try {
      const response = await fetch(`/api/updates?page=${pageNum}&limit=10`)
      if (!response.ok) {
        setHasMore(false)
        setLoading(false)
        return
      }
      const data: TimelineResponse = await response.json()
      if (!data.updates || !Array.isArray(data.updates)) {
        setHasMore(false)
        setLoading(false)
        return
      }
      if (pageNum === 1) {
        setUpdates(data.updates)
      } else {
        setUpdates(prev => [...prev, ...data.updates])
      }
      setHasMore(data.hasMore)
      setLoading(false)
    } catch {
      setHasMore(false)
      setLoading(false)
    }
  }

  const fetchMoreUpdates = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchUpdates(nextPage)
  }

  useEffect(() => {
    fetchUpdates(1)
    const interval = setInterval(() => {
      fetchUpdates(1)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useLayoutEffect(() => {
    if (!containerRef.current || !firstDotRef.current || !lastDotRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const firstDotRect = firstDotRef.current.getBoundingClientRect();
    const lastDotRect = lastDotRef.current.getBoundingClientRect();
    const dotRadius = firstDotRect.height / 2;
    const top = firstDotRect.top - containerRect.top + dotRadius;
    const bottom = lastDotRect.top - containerRect.top + dotRadius;
    setLineStyle({ top, height: bottom - top });
    // No cleanup needed
    return undefined;
  }, [updates]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-lg loading-dots">Loading</div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden flex items-center justify-center">
      <div className="relative w-full max-w-[700px] h-[80vh] overflow-hidden">
          {/* Fade Overlays */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black via-black/80 to-transparent z-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black via-black/80 to-transparent z-20 pointer-events-none" />

          {/* Scrollable Timeline Container */}
          <div 
            className="relative h-full w-full overflow-y-auto px-8 py-6 scroll-smooth"
            id="scrollable-timeline"
            style={{ willChange: 'transform', scrollBehavior: 'smooth' }}
            ref={containerRef}
          >
            {/* Pixel-perfect vertical line */}
            {updates.length > 1 && (
              <div
                className="absolute w-px bg-gray-600 z-0 left-[51px]"
                style={{ top: lineStyle.top, height: lineStyle.height }}
              />
            )}

            <InfiniteScroll
              dataLength={updates.length}
              next={fetchMoreUpdates}
              hasMore={hasMore}
              loader={
                <div className="text-center py-4">
                  <div className="text-gray-400 loading-dots font-sans">Loading more</div>
                </div>
              }
              endMessage={
                <div className="text-center py-8">
                  <div className="text-gray-500 text-sm font-sans">You&apos;ve reached the beginning</div>
                </div>
              }
            >
              {/* Timeline Items */}
              <div className="space-y-6 relative z-10 w-full">
                {updates.map((update, idx) => (
                  <div key={update.id} className="relative flex items-center">
                    {/* Dot positioned to align with the line */}
                    <div className="relative z-20 w-10 flex justify-center flex-shrink-0"
                      ref={idx === 0 ? firstDotRef : idx === updates.length - 1 ? lastDotRef : undefined}
                    >
                      <div 
                        className="w-2.5 h-2.5 rounded-full border-2 border-black shadow-sm relative z-30"
                        style={{ backgroundColor: update.color || '#3B82F6' }}
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 w-full ml-4">
                      <p className="text-white text-base leading-relaxed mb-1 font-sans">{update.text}</p>
                      {update.imageUrl && (
                        <div className="mb-2">
                          <Image
                            src={update.imageUrl}
                            alt="Update image"
                            width={500}
                            height={300}
                            className="rounded-lg max-w-full h-auto"
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                      )}
                      <span className="text-xs text-gray-400 italic font-sans">{formatDate(update.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </InfiniteScroll>
          </div>
        </div>

      <style jsx>{`
        /* Custom scrollbar styling */
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #18181b;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #38bdf8;
          border-radius: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #0ea5e9;
        }
      `}</style>
    </div>
  )
}
