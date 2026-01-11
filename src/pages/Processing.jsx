import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import './Processing.css'

const PROCESSING_STEPS = [
  { id: 1, message: 'Analyzing your trip details...', icon: '🗺️' },
  { id: 2, message: 'Gathering destination facts...', icon: '📚' },
  { id: 3, message: 'Creating personalized prompts...', icon: '✏️' },
  { id: 4, message: 'Designing activity pages...', icon: '🎨' },
  { id: 5, message: 'Generating your journal...', icon: '📖' },
]

function Processing() {
  const { journalId } = useParams()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [status, setStatus] = useState('processing')
  const [error, setError] = useState(null)

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/journal/status/${journalId}`)
        const data = await response.json()

        if (data.status === 'completed') {
          setStatus('completed')
          setTimeout(() => {
            navigate(`/download/${journalId}`)
          }, 1000)
        } else if (data.status === 'error') {
          setStatus('error')
          setError(data.error || 'An error occurred')
        } else {
          // Update step based on progress
          if (data.progress) {
            setCurrentStep(Math.min(5, Math.ceil(data.progress * 5)))
          }
        }
      } catch (err) {
        console.error('Error checking status:', err)
      }
    }

    // Poll for status
    const interval = setInterval(checkStatus, 2000)
    checkStatus() // Initial check

    // Simulate progress for demo
    const progressInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= 5) {
          clearInterval(progressInterval)
          return 5
        }
        return prev + 1
      })
    }, 3000)

    return () => {
      clearInterval(interval)
      clearInterval(progressInterval)
    }
  }, [journalId, navigate])

  return (
    <div className="processing-page">
      <div className="container-sm">
        <div className="processing-card">
          {status === 'processing' && (
            <>
              <div className="processing-animation">
                <div className="book-animation">
                  <div className="book-cover">
                    <span>📔</span>
                  </div>
                </div>
              </div>

              <h1>Creating Your Journal</h1>
              <p className="processing-subtitle">
                This usually takes about 30-60 seconds
              </p>

              <div className="processing-steps">
                {PROCESSING_STEPS.map((step) => (
                  <div
                    key={step.id}
                    className={`processing-step ${
                      currentStep > step.id ? 'completed' :
                      currentStep === step.id ? 'active' : ''
                    }`}
                  >
                    <span className="step-icon">
                      {currentStep > step.id ? '✓' : step.icon}
                    </span>
                    <span className="step-message">{step.message}</span>
                  </div>
                ))}
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${(currentStep / 5) * 100}%` }}
                />
              </div>
            </>
          )}

          {status === 'completed' && (
            <div className="status-complete">
              <span className="complete-icon">✨</span>
              <h2>Journal Ready!</h2>
              <p>Redirecting to download...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="status-error">
              <span className="error-icon">😢</span>
              <h2>Something went wrong</h2>
              <p>{error}</p>
              <Link to="/create" className="btn btn-primary mt-3">
                Try Again
              </Link>
            </div>
          )}
        </div>

        <div className="processing-tips">
          <h3>While you wait...</h3>
          <ul>
            <li>🖨️ Make sure your printer has enough paper (20-30 pages)</li>
            <li>📎 Consider getting a folder or binder for the journal</li>
            <li>✏️ Pack some colored pencils for the trip!</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Processing
