'use client'
import { useState, useEffect } from 'react';
import TimelineContainer from '@/components/TimelineContainer';
import PasscodeForm from '@/components/PasscodeForm';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if already authenticated via cookie
    fetch('/api/auth', { method: 'GET' })
      .then(response => {
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  const handleAuth = () => {
    setIsAuthenticated(true);
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg loading-dots">Loading</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <PasscodeForm onAuth={handleAuth} />;
  }

  return <TimelineContainer />;
}