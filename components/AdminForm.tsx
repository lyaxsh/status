'use client'

import { useState, useEffect } from 'react'

function getRandomColor() {
  // Nice palette, or use random hex
  const palette = [
    '#3B82F6', // blue
    '#F59E42', // orange
    '#10B981', // green
    '#F43F5E', // pink/red
    '#6366F1', // indigo
    '#FBBF24', // yellow
    '#8B5CF6', // purple
    '#06B6D4', // cyan
    '#84CC16', // lime
    '#E11D48', // rose
  ];
  return palette[Math.floor(Math.random() * palette.length)];
}

export default function AdminForm() {
  const [text, setText] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [color, setColor] = useState(getRandomColor())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    setColor(getRandomColor());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!text.trim()) {
      setMessage('Please enter some text')
      return
    }

    setIsSubmitting(true)
    setMessage('')

    try {
      const response = await fetch('/api/add-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          imageUrl: imageUrl.trim() || null,
          color: color
        })
      })

      if (response.ok) {
        setText('')
        setImageUrl('')
        setColor(getRandomColor()) // Reset to new random color
        setMessage('Update posted successfully!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        const error = await response.json()
        setMessage(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error posting update:', error)
      setMessage('Failed to post update')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-8 text-center">
          Post Update
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's happening?"
              className="w-full p-4 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent resize-none"
              rows={4}
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Image URL (optional)"
              className="w-full p-4 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Dot Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-12 rounded-lg border border-gray-700 cursor-pointer"
                disabled={isSubmitting}
              />
              <span className="text-gray-400 text-sm">
                {color}
              </span>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting || !text.trim()}
            className="w-full bg-white text-black py-4 px-6 rounded-lg font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <span className="loading-dots">Posting</span>
            ) : (
              'Post Update'
            )}
          </button>
        </form>
        
        {message && (
          <div className={`mt-4 p-3 rounded-lg text-center ${
            message.includes('Error') 
              ? 'bg-red-900/50 text-red-200 border border-red-800' 
              : 'bg-green-900/50 text-green-200 border border-green-800'
          }`}>
            {message}
          </div>
        )}
        
        <div className="mt-8 text-center">
          <a 
            href="/" 
            className="text-gray-400 hover:text-white transition-colors"
          >
            View Timeline →
          </a>
        </div>
      </div>
    </div>
  )
}