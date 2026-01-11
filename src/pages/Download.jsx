import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import './Download.css'

function Download() {
  const { journalId } = useParams()
  const [journalInfo, setJournalInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJournalInfo = async () => {
      try {
        const response = await fetch(`/api/journal/info/${journalId}`)
        const data = await response.json()
        setJournalInfo(data)
      } catch (err) {
        console.error('Error fetching journal info:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchJournalInfo()
  }, [journalId])

  const handleDownload = () => {
    window.location.href = `/api/journal/download/${journalId}`
  }

  if (loading) {
    return (
      <div className="download-page">
        <div className="container-sm text-center">
          <div className="spinner"></div>
          <p className="mt-3">Loading journal info...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="download-page">
      <div className="container-sm">
        <div className="success-header">
          <span className="success-icon">🎉</span>
          <h1>Your Journal is Ready!</h1>
          <p>
            {journalInfo?.childName}'s travel journal for{' '}
            {journalInfo?.destination} is complete
          </p>
        </div>

        <div className="download-card">
          <div className="journal-preview-img">
            <div className="preview-cover">
              <span className="cover-emoji">📔</span>
              <h3>{journalInfo?.childName}'s</h3>
              <h2>Travel Journal</h2>
              <p>{journalInfo?.destination}</p>
            </div>
          </div>

          <div className="download-info">
            <div className="info-row">
              <span className="info-label">Pages:</span>
              <span className="info-value">{journalInfo?.pageCount || '~25'} pages</span>
            </div>
            <div className="info-row">
              <span className="info-label">Trip Duration:</span>
              <span className="info-value">{journalInfo?.tripDays || '7'} days</span>
            </div>
            <div className="info-row">
              <span className="info-label">File Size:</span>
              <span className="info-value">{journalInfo?.fileSize || '~5 MB'}</span>
            </div>
          </div>

          <button className="btn btn-primary btn-large download-btn" onClick={handleDownload}>
            📥 Download PDF
          </button>

          <p className="download-note">
            Your journal will be available for 24 hours
          </p>
        </div>

        <div className="printing-guide">
          <h2>🖨️ Printing Guide</h2>
          <div className="guide-steps">
            <div className="guide-step">
              <span className="guide-number">1</span>
              <div>
                <h4>Open the PDF</h4>
                <p>Use Adobe Reader or your browser's built-in PDF viewer</p>
              </div>
            </div>
            <div className="guide-step">
              <span className="guide-number">2</span>
              <div>
                <h4>Print Settings</h4>
                <p>Select "Fit to page" and "Print on both sides" (flip on short edge)</p>
              </div>
            </div>
            <div className="guide-step">
              <span className="guide-number">3</span>
              <div>
                <h4>Paper</h4>
                <p>Use standard letter size (8.5" x 11") paper. Cardstock for cover is optional!</p>
              </div>
            </div>
            <div className="guide-step">
              <span className="guide-number">4</span>
              <div>
                <h4>Bind It</h4>
                <p>Staple along the left edge, or use a 3-hole punch with a binder</p>
              </div>
            </div>
          </div>
        </div>

        <div className="packing-list">
          <h2>🎒 Don't Forget to Pack</h2>
          <ul>
            <li>✏️ Pencils and colored pencils</li>
            <li>🖊️ A good pen for writing</li>
            <li>📎 Paper clips for loose items</li>
            <li>🎨 Small set of markers (optional)</li>
            <li>📷 Camera for capturing moments to remember</li>
          </ul>
        </div>

        <div className="cta-footer">
          <h3>Have a wonderful trip!</h3>
          <p>We hope this journal helps create lasting memories</p>
          <Link to="/" className="btn btn-secondary">
            Create Another Journal
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Download
