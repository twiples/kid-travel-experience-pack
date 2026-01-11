import { Link } from 'react-router-dom'
import './LandingPage.css'

const SAMPLE_DESTINATIONS = [
  { name: 'Tokyo', emoji: '🗼', country: 'Japan' },
  { name: 'Paris', emoji: '🗼', country: 'France' },
  { name: 'London', emoji: '🎡', country: 'UK' },
  { name: 'Orlando', emoji: '🏰', country: 'USA' },
  { name: 'Hawaii', emoji: '🌺', country: 'USA' },
]

const FEATURES = [
  {
    icon: '📖',
    title: 'Personalized Journals',
    description: 'Custom prompts tailored to your child\'s interests and your destinations'
  },
  {
    icon: '✏️',
    title: 'Age-Appropriate Content',
    description: 'Designed for kids ages 8-12 with engaging activities and reflection prompts'
  },
  {
    icon: '🗺️',
    title: 'Destination-Specific',
    description: 'Location-aware content with cultural facts, language tips, and local insights'
  },
  {
    icon: '🖨️',
    title: 'Print-Ready PDFs',
    description: 'Optimized for home printing with clear layouts and activity pages'
  },
]

function LandingPage() {
  return (
    <div className="landing">
      <header className="landing-header">
        <div className="container">
          <nav className="nav">
            <div className="logo">
              <span className="logo-icon">🎒</span>
              <span className="logo-text">KidsTravel Journal</span>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">
                Turn Family Trips into<br />
                <span className="highlight">Lasting Memories</span>
              </h1>
              <p className="hero-subtitle">
                Generate personalized, printable travel journals for your kids.
                Capture observations, reflections, and adventures with destination-specific
                prompts designed for ages 8-12.
              </p>
              <div className="hero-cta">
                <Link to="/create" className="btn btn-primary btn-large">
                  Create Your Journal
                  <span className="btn-arrow">→</span>
                </Link>
                <p className="cta-hint">Free • No account required • Ready in 2 minutes</p>
              </div>
            </div>
            <div className="hero-visual">
              <div className="journal-preview">
                <div className="preview-page">
                  <div className="preview-header">Day 1 - Tokyo</div>
                  <div className="preview-prompt">
                    What was your first impression when you arrived?
                    Describe the sounds, smells, and sights around you.
                  </div>
                  <div className="preview-lines">
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="container">
            <h2 className="section-title text-center">What You'll Get</h2>
            <div className="features-grid">
              {FEATURES.map((feature, index) => (
                <div key={index} className="feature-card">
                  <span className="feature-icon">{feature.icon}</span>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="destinations">
          <div className="container">
            <h2 className="section-title text-center">Popular Destinations</h2>
            <p className="section-subtitle text-center">
              We have curated content for these family-favorite destinations
            </p>
            <div className="destinations-grid">
              {SAMPLE_DESTINATIONS.map((dest, index) => (
                <div key={index} className="destination-card">
                  <span className="destination-emoji">{dest.emoji}</span>
                  <span className="destination-name">{dest.name}</span>
                  <span className="destination-country">{dest.country}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="journal-sections">
          <div className="container">
            <h2 className="section-title text-center">What's Inside</h2>
            <div className="sections-grid">
              <div className="section-card">
                <div className="section-number">1</div>
                <h3>Pre-Trip Prep</h3>
                <p>Maps, fun facts, cultural highlights, and "Did you know?" trivia about your destinations</p>
              </div>
              <div className="section-card">
                <div className="section-number">2</div>
                <h3>In-Flight Activities</h3>
                <p>Word searches, crosswords, travel bingo, and creative activities themed to your trip</p>
              </div>
              <div className="section-card">
                <div className="section-number">3</div>
                <h3>Daily Journal Pages</h3>
                <p>Location-specific prompts, reflection questions, sketching space, and mood trackers</p>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container">
            <div className="cta-card">
              <h2>Ready to Create Memories?</h2>
              <p>Your personalized travel journal is just a few clicks away</p>
              <Link to="/create" className="btn btn-primary btn-large">
                Get Started
                <span className="btn-arrow">→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <p className="footer-text">
            🎒 KidsTravel Journal Generator • Made with love for adventurous families
          </p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
