import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './DemoShowcase.css'

const DEMO_DATA = {
  destination: 'Verona',
  country: 'Italy',
  childName: 'Sophia',
  childAge: 9,
  tripDays: 8,
  tripDates: 'July 21-28, 2025',
  highlights: [
    'Opera at the Arena under candlelight',
    'Making pasta with Nonna',
    'Climbing 368 steps up Torre dei Lamberti',
    'Visiting Juliet\'s balcony',
    'Boat ride on Lake Garda'
  ],
  stats: {
    pagesCompleted: 12,
    wordsLearned: 8,
    gelatoCount: 14,
    rating: 5
  }
}

const JOURNEY_STEPS = [
  {
    step: 1,
    title: 'Original Journal',
    description: 'Personalized PDF generated before the trip',
    icon: '📄',
    file: '/samples/verona-sample.pdf',
    filename: 'verona-original-journal.pdf',
    color: '#457B9D'
  },
  {
    step: 2,
    title: 'Completed Journal',
    description: 'Journal filled with Sophia\'s entries during the trip',
    icon: '✏️',
    file: '/demo/verona/completed-journal.pdf',
    filename: 'sophia-verona-completed.pdf',
    color: '#2A9D8F'
  }
]

const MEMORY_PRODUCTS = [
  {
    title: 'Memory Video',
    description: '1:24 animated video with Ken Burns effect and music',
    icon: '🎬',
    file: '/demo/verona/memory-video-preview.pdf',
    filename: 'sophia-verona-memory-video.pdf',
    badge: 'Preview',
    color: '#E63946'
  },
  {
    title: 'Holiday Card',
    description: 'Shareable card for family and friends',
    icon: '💌',
    file: '/demo/verona/holiday-card.pdf',
    filename: 'sophia-verona-holiday-card.pdf',
    badge: '7x5"',
    color: '#F4A261'
  },
  {
    title: 'School Slides',
    description: '10-slide presentation for show-and-tell',
    icon: '📊',
    file: '/demo/verona/school-slides.pdf',
    filename: 'sophia-verona-school-presentation.pdf',
    badge: '10 slides',
    color: '#2A9D8F'
  },
  {
    title: 'Social Clip',
    description: 'Vertical video poster for Instagram/TikTok',
    icon: '📱',
    file: '/demo/verona/social-clip-poster.pdf',
    filename: 'sophia-verona-social-clip.pdf',
    badge: '9:16',
    color: '#9B5DE5'
  }
]

function DemoShowcase() {
  const [activePreview, setActivePreview] = useState(null)

  const handleDownload = (file, filename) => {
    const link = document.createElement('a')
    link.href = file
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="demo-showcase">
      {/* Hero Section */}
      <section className="demo-hero">
        <div className="demo-hero-content">
          <span className="demo-badge">Complete Demo</span>
          <h1>Sophia's Verona Adventure</h1>
          <p className="demo-subtitle">
            See the complete journey from printed journal to digital memories
          </p>
          <div className="demo-meta">
            <span>🏛️ {DEMO_DATA.destination}, {DEMO_DATA.country}</span>
            <span>👧 {DEMO_DATA.childName}, age {DEMO_DATA.childAge}</span>
            <span>📅 {DEMO_DATA.tripDays} days</span>
          </div>
        </div>
        <div className="demo-hero-visual">
          <div className="demo-destination-icon">🏛️</div>
        </div>
      </section>

      {/* Journey Steps */}
      <section className="demo-section">
        <h2>The Journey</h2>
        <p className="section-description">From blank journal to completed memories</p>

        <div className="journey-flow">
          {JOURNEY_STEPS.map((item, index) => (
            <div key={item.step} className="journey-item">
              <div className="journey-card" style={{ borderColor: item.color }}>
                <div className="journey-step" style={{ backgroundColor: item.color }}>
                  Step {item.step}
                </div>
                <div className="journey-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <button
                  className="download-btn"
                  onClick={() => handleDownload(item.file, item.filename)}
                  style={{ backgroundColor: item.color }}
                >
                  Download PDF
                </button>
              </div>
              {index < JOURNEY_STEPS.length - 1 && (
                <div className="journey-arrow">→</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Trip Highlights */}
      <section className="demo-section highlights-section">
        <h2>Trip Highlights</h2>
        <div className="highlights-grid">
          <div className="highlights-list">
            {DEMO_DATA.highlights.map((highlight, index) => (
              <div key={index} className="highlight-item">
                <span className="highlight-check">✓</span>
                {highlight}
              </div>
            ))}
          </div>
          <div className="stats-card">
            <h3>Sophia's Stats</h3>
            <div className="stat-item">
              <span className="stat-icon">📝</span>
              <span className="stat-value">{DEMO_DATA.stats.pagesCompleted}</span>
              <span className="stat-label">pages completed</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🗣️</span>
              <span className="stat-value">{DEMO_DATA.stats.wordsLearned}</span>
              <span className="stat-label">Italian words learned</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🍦</span>
              <span className="stat-value">{DEMO_DATA.stats.gelatoCount}</span>
              <span className="stat-label">gelatos eaten!</span>
            </div>
            <div className="stat-item rating">
              <span className="stat-icon">⭐</span>
              <span className="stat-value">{'⭐'.repeat(DEMO_DATA.stats.rating)}</span>
              <span className="stat-label">trip rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Memory Products */}
      <section className="demo-section products-section">
        <h2>Memory Products</h2>
        <p className="section-description">
          Generated from the completed journal pages
        </p>

        <div className="products-grid">
          {MEMORY_PRODUCTS.map((product) => (
            <div key={product.title} className="product-card">
              <div className="product-header" style={{ backgroundColor: product.color }}>
                <span className="product-icon">{product.icon}</span>
                {product.badge && <span className="product-badge">{product.badge}</span>}
              </div>
              <div className="product-content">
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <div className="product-actions">
                  <button
                    className="preview-btn"
                    onClick={() => setActivePreview(product.file)}
                  >
                    Preview
                  </button>
                  <button
                    className="download-btn small"
                    onClick={() => handleDownload(product.file, product.filename)}
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sample Entries */}
      <section className="demo-section entries-section">
        <h2>Sample Journal Entries</h2>
        <p className="section-description">A peek inside Sophia's completed journal</p>

        <div className="entries-carousel">
          <div className="entry-card">
            <div className="entry-header">
              <span className="entry-day">Day 1</span>
              <span className="entry-mood">Mood: Excited!</span>
            </div>
            <h4>Arriving in Verona!</h4>
            <p className="entry-text">
              "Today we flew to Italy!!! The plane ride was SO long but I watched 2 movies.
              When we landed in Verona, everything looked so old and pretty..."
            </p>
            <div className="entry-footer">
              <span>🇮🇹 New word: Ciao (chow) - means hello AND goodbye!</span>
            </div>
          </div>

          <div className="entry-card">
            <div className="entry-header">
              <span className="entry-day">Day 6</span>
              <span className="entry-mood">Mood: Amazed</span>
            </div>
            <h4>Opera Night</h4>
            <p className="entry-text">
              "Tonight we went to the opera at the Arena!! When it got dark, everyone lit
              candles and it looked like magic. There were elephants and horses ON STAGE!"
            </p>
            <div className="entry-footer">
              <span>🎭 New word: Brava! - what you shout when a lady singer is good</span>
            </div>
          </div>

          <div className="entry-card">
            <div className="entry-header">
              <span className="entry-day">Day 8</span>
              <span className="entry-mood">Mood: Sad but grateful</span>
            </div>
            <h4>Goodbye Verona</h4>
            <p className="entry-text">
              "I dont want to leave!! This was the best vacation ever. We had one last gelato
              and sat by the river. Grazie Verona! Arrivederci!"
            </p>
            <div className="entry-footer">
              <span>👋 New word: Arrivederci - goodbye (see you again)</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="demo-cta">
        <h2>Create Your Own Adventure</h2>
        <p>Start your family's travel memory journey today</p>
        <div className="cta-buttons">
          <Link to="/create" className="cta-primary">
            Create Your Journal
          </Link>
          <Link to="/" className="cta-secondary">
            Learn More
          </Link>
        </div>
      </section>

      {/* Preview Modal */}
      {activePreview && (
        <div className="preview-modal" onClick={() => setActivePreview(null)}>
          <div className="preview-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setActivePreview(null)}>×</button>
            <iframe src={activePreview} title="Preview" />
          </div>
        </div>
      )}
    </div>
  )
}

export default DemoShowcase
