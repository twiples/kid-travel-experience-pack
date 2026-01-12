import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import BackpackIcon from '../components/BackpackIcon'
import './Memories.css'

const MEMORY_PRODUCTS = [
  {
    id: 'video',
    title: 'Memory Video',
    description: 'An animated video showcasing your journal pages with music',
    icon: '🎬',
    duration: '30-60 seconds',
    format: 'MP4'
  },
  {
    id: 'cards',
    title: 'Holiday Cards',
    description: 'Beautiful cards featuring your favorite journal moments',
    icon: '💌',
    templates: '4 designs',
    format: 'PDF/PNG'
  },
  {
    id: 'slides',
    title: 'School Presentation',
    description: 'A slide deck perfect for sharing at school',
    icon: '📊',
    slides: '8-12 slides',
    format: 'PDF'
  },
  {
    id: 'social',
    title: 'Social Clips',
    description: 'Short clips sized for Instagram and TikTok',
    icon: '📱',
    duration: '15-30 seconds',
    format: 'MP4'
  }
]

function Memories() {
  const { journalId } = useParams()
  const [journalInfo, setJournalInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [uploadedPhotos, setUploadedPhotos] = useState([])
  const [uploading, setUploading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [products, setProducts] = useState(null)
  const [manualId, setManualId] = useState('')
  const fileInputRef = useRef(null)

  // Fetch journal info if we have an ID
  useEffect(() => {
    if (journalId) {
      fetchJournalInfo(journalId)
    } else {
      setLoading(false)
    }
  }, [journalId])

  const fetchJournalInfo = async (id) => {
    try {
      const response = await fetch(`/api/journal/info/${id}`)
      if (response.ok) {
        const data = await response.json()
        setJournalInfo(data)
      } else {
        setError('Journal not found. Please check your ID.')
      }
    } catch (err) {
      setError('Unable to load journal information.')
    } finally {
      setLoading(false)
    }
  }

  const handleManualIdSubmit = (e) => {
    e.preventDefault()
    if (manualId.trim()) {
      window.location.href = `/memories/${manualId.trim()}`
    }
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    handleFiles(files)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFiles = (files) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    const newPhotos = imageFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file),
      pageType: 'daily'
    }))
    setUploadedPhotos(prev => [...prev, ...newPhotos])
  }

  const removePhoto = (id) => {
    setUploadedPhotos(prev => {
      const photo = prev.find(p => p.id === id)
      if (photo) {
        URL.revokeObjectURL(photo.preview)
      }
      return prev.filter(p => p.id !== id)
    })
  }

  const updatePhotoType = (id, pageType) => {
    setUploadedPhotos(prev =>
      prev.map(p => p.id === id ? { ...p, pageType } : p)
    )
  }

  const handleUpload = async () => {
    if (uploadedPhotos.length === 0) return

    setUploading(true)
    try {
      const formData = new FormData()
      uploadedPhotos.forEach((photo, index) => {
        formData.append('photos', photo.file)
        formData.append(`pageTypes[${index}]`, photo.pageType)
      })

      const response = await fetch(`/api/memories/${journalId}/upload`, {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        setProcessing(true)
        generateMemories()
      } else {
        setError('Upload failed. Please try again.')
      }
    } catch (err) {
      setError('Upload failed. Please check your connection.')
    } finally {
      setUploading(false)
    }
  }

  const generateMemories = async () => {
    try {
      const response = await fetch(`/api/memories/${journalId}/generate`, {
        method: 'POST'
      })

      if (response.ok) {
        const data = await response.json()
        setProducts(data.products)
        setProcessing(false)
      }
    } catch (err) {
      // Simulate success for prototype
      setTimeout(() => {
        setProducts({
          video: { url: '#', ready: true },
          cards: { url: '#', ready: true, templates: 4 },
          slides: { url: '#', ready: true },
          social: { url: '#', ready: true }
        })
        setProcessing(false)
      }, 3000)
    }
  }

  // No journal ID - show entry form
  if (!journalId) {
    return (
      <div className="memories-page">
        <nav className="memories-nav">
          <div className="container nav-container">
            <Link to="/" className="logo">
              <BackpackIcon size={28} className="logo-icon" />
              <span className="logo-text">KidsTravel</span>
            </Link>
          </div>
        </nav>

        <div className="memories-hero">
          <div className="container">
            <h1 className="memories-title">Complete Your Journey</h1>
            <p className="memories-subtitle">
              Transform your completed journal into lasting memories
            </p>

            <div className="id-entry-card">
              <div className="id-entry-icon">📷</div>
              <h2>Enter Your Journal ID</h2>
              <p>Find your ID on the last page of your printed journal, or scan the QR code</p>
              <form onSubmit={handleManualIdSubmit} className="id-entry-form">
                <input
                  type="text"
                  placeholder="e.g., a1b2c3d4"
                  value={manualId}
                  onChange={(e) => setManualId(e.target.value)}
                  className="id-input"
                />
                <button type="submit" className="btn btn-primary">
                  Continue
                </button>
              </form>
            </div>

            <div className="memory-products-preview">
              <h3>What You'll Create</h3>
              <div className="products-grid">
                {MEMORY_PRODUCTS.map(product => (
                  <div key={product.id} className="product-preview-card">
                    <span className="product-icon">{product.icon}</span>
                    <h4>{product.title}</h4>
                    <p>{product.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="memories-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your journal...</p>
        </div>
      </div>
    )
  }

  // Products ready - show gallery
  if (products) {
    return (
      <div className="memories-page">
        <nav className="memories-nav">
          <div className="container nav-container">
            <Link to="/" className="logo">
              <BackpackIcon size={28} className="logo-icon" />
              <span className="logo-text">KidsTravel</span>
            </Link>
          </div>
        </nav>

        <div className="memories-gallery">
          <div className="container">
            <div className="gallery-header">
              <div className="success-badge">✨ Memories Created!</div>
              <h1>{journalInfo?.childName}'s Trip Memories</h1>
              <p>Your {journalInfo?.destination} adventure is ready to share</p>
            </div>

            <div className="products-download-grid">
              {MEMORY_PRODUCTS.map(product => (
                <div key={product.id} className="product-download-card">
                  <div className="product-header">
                    <span className="product-icon-large">{product.icon}</span>
                    <div>
                      <h3>{product.title}</h3>
                      <p className="product-format">{product.format}</p>
                    </div>
                  </div>
                  <p className="product-desc">{product.description}</p>
                  <button className="btn btn-primary btn-block">
                    Download {product.title}
                  </button>
                </div>
              ))}
            </div>

            <div className="share-section">
              <h3>Share Your Memories</h3>
              <div className="share-buttons">
                <button className="share-btn">📧 Email</button>
                <button className="share-btn">📱 Text</button>
                <button className="share-btn">🔗 Copy Link</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Processing state
  if (processing) {
    return (
      <div className="memories-page">
        <div className="processing-state">
          <div className="processing-animation">
            <div className="processing-icon">🎨</div>
            <div className="processing-ring"></div>
          </div>
          <h2>Creating Your Memories</h2>
          <p>We're turning your journal into something amazing...</p>
          <div className="processing-steps">
            <div className="step active">📷 Processing photos</div>
            <div className="step">🎬 Creating video</div>
            <div className="step">💌 Designing cards</div>
            <div className="step">📊 Building slides</div>
          </div>
        </div>
      </div>
    )
  }

  // Upload interface
  return (
    <div className="memories-page">
      <nav className="memories-nav">
        <div className="container nav-container">
          <Link to="/" className="logo">
            <BackpackIcon size={28} className="logo-icon" />
            <span className="logo-text">KidsTravel</span>
          </Link>
        </div>
      </nav>

      <div className="memories-upload">
        <div className="container">
          {journalInfo && (
            <div className="journal-info-banner">
              <span className="journal-destination">{journalInfo.destination}</span>
              <span className="journal-child">{journalInfo.childName}'s Journal</span>
              <span className="journal-days">{journalInfo.tripDays} Days</span>
            </div>
          )}

          <div className="upload-header">
            <h1>Upload Your Completed Journal</h1>
            <p>Take photos of each page and upload them here</p>
          </div>

          {error && (
            <div className="error-banner">
              {error}
              <button onClick={() => setError(null)}>✕</button>
            </div>
          )}

          <div
            className="upload-zone"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="file-input"
            />
            <div className="upload-zone-content">
              <div className="upload-icon">📸</div>
              <h3>Drop photos here or click to browse</h3>
              <p>Upload photos of your completed journal pages</p>
              <p className="upload-hint">Tip: Take clear, well-lit photos of each page</p>
            </div>
          </div>

          {uploadedPhotos.length > 0 && (
            <>
              <div className="photos-grid">
                {uploadedPhotos.map((photo, index) => (
                  <div key={photo.id} className="photo-card">
                    <img src={photo.preview} alt={`Page ${index + 1}`} />
                    <div className="photo-overlay">
                      <span className="photo-number">Page {index + 1}</span>
                      <button
                        className="photo-remove"
                        onClick={(e) => {
                          e.stopPropagation()
                          removePhoto(photo.id)
                        }}
                      >
                        ✕
                      </button>
                    </div>
                    <select
                      value={photo.pageType}
                      onChange={(e) => updatePhotoType(photo.id, e.target.value)}
                      className="photo-type-select"
                    >
                      <option value="cover">Cover</option>
                      <option value="daily">Daily Entry</option>
                      <option value="activity">Activity</option>
                      <option value="reflection">Reflection</option>
                    </select>
                  </div>
                ))}
              </div>

              <div className="upload-actions">
                <p className="photo-count">{uploadedPhotos.length} photos ready</p>
                <button
                  className="btn btn-primary btn-large"
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Create Memories ✨'}
                </button>
              </div>
            </>
          )}

          <div className="tips-section">
            <h3>Tips for Best Results</h3>
            <div className="tips-grid">
              <div className="tip">
                <span className="tip-icon">💡</span>
                <p>Use good lighting - natural light works best</p>
              </div>
              <div className="tip">
                <span className="tip-icon">📐</span>
                <p>Keep the camera straight above the page</p>
              </div>
              <div className="tip">
                <span className="tip-icon">✨</span>
                <p>Include drawings and decorated pages</p>
              </div>
              <div className="tip">
                <span className="tip-icon">📝</span>
                <p>Make sure writing is visible and clear</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Memories
