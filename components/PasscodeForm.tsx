'use client'

import { useState } from 'react'

interface PasscodeFormProps {
  onAuth: () => void
}

export default function PasscodeForm({ onAuth }: PasscodeFormProps) {
  const [passcode, setPasscode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!passcode.trim()) {
      setError('Please enter passcode')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ passcode: passcode.trim() })
      })

      if (response.ok) {
        onAuth()
      } else {
        const error = await response.json()
        setError(error.error || 'Invalid passcode')
      }
    } catch (error) {
      console.error('Auth error:', error)
      setError('Authentication failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      {/* Completely hidden dummy password field outside the form */}
      <input 
        type="password" 
        style={{ position: 'absolute', left: '-9999px', top: '-9999px' }} 
        value="Dummy123" 
        readOnly 
        autoComplete="username"
        tabIndex={-1}
      />
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-white mb-8 text-center">
          Admin Access
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter passcode"
              className="w-full p-4 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              disabled={isSubmitting}
              autoFocus
              autoComplete="off"
              data-form-type="other"
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting || !passcode.trim()}
            className="w-full bg-white text-black py-4 px-6 rounded-lg font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <span className="loading-dots">Authenticating</span>
            ) : (
              'Access'
            )}
          </button>
        </form>
        
        {error && (
          <div className="mt-4 p-3 rounded-lg text-center bg-red-900/50 text-red-200 border border-red-800">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}