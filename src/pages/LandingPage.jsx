import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import BackpackIcon from '../components/BackpackIcon'
import { ToucanIcon, MonsteraLeaf, ButterflyIcon } from '../components/TropicalDecorations'
import './LandingPage.css'

const FEATURES = [
  {
    icon: '📖',
    title: 'Personalized Journals',
    description: 'Custom prompts tailored to your child\'s interests and destinations',
    gradient: 'gradient-1'
  },
  {
    icon: '✨',
    title: 'Age-Appropriate',
    description: 'Designed for kids ages 8-12 with engaging activities and reflection prompts',
    gradient: 'gradient-2'
  },
  {
    icon: '🗺️',
    title: 'Destination-Specific',
    description: 'Location-aware content with cultural facts, language tips, and local insights',
    gradient: 'gradient-3'
  },
  {
    icon: '🖨️',
    title: 'Print-Ready PDFs',
    description: 'Optimized for home printing with beautiful layouts and activity pages',
    gradient: 'gradient-4'
  },
]

const SECTIONS_CONTENT = [
  {
    number: '01',
    title: 'Pre-Trip Prep',
    description: 'Maps, fun facts, cultural highlights, and "Did you know?" trivia about your destinations',
    visual: '🗺️'
  },
  {
    number: '02',
    title: 'Travel Time Activities',
    description: 'Fun games, puzzles, and creative activities to keep kids engaged during flights, car rides, and waits',
    visual: '✈️'
  },
  {
    number: '03',
    title: 'Daily Journal Pages',
    description: 'Location-specific prompts, reflection questions, sketching space, and mood trackers',
    visual: '📝'
  },
]

const DESTINATIONS = [
  { name: 'Tokyo', country: 'Japan', image: '🗼' },
  { name: 'Paris', country: 'France', image: '🗼' },
  { name: 'London', country: 'UK', image: '🎡' },
  { name: 'Orlando', country: 'USA', image: '🏰' },
  { name: 'Hawaii', country: 'USA', image: '🌺' },
]

function LandingPage() {
  const heroRef = useRef(null)
  const sectionsRef = useRef([])

  useEffect(() => {
    // Scroll reveal observer
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    }

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    // Observe all reveal elements
    document.querySelectorAll('.reveal').forEach(el => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="landing">
      {/* Navigation - Glass morphism */}
      <nav className="nav-glass">
        <div className="container nav-container">
          <Link to="/" className="logo">
            <BackpackIcon size={28} className="logo-icon" />
            <span className="logo-text">KidsTravel</span>
          </Link>
          <Link to="/create" className="nav-cta">
            Create Journal
            <span className="nav-cta-arrow">→</span>
          </Link>
        </div>
      </nav>

      {/* Hero - Full bleed */}
      <section className="hero-section" ref={heroRef}>
        <div className="hero-background">
          <div className="hero-shape hero-shape-1"></div>
          <div className="hero-shape hero-shape-2"></div>
          <div className="hero-shape hero-shape-3"></div>
        </div>

        <div className="container hero-content">
          <div className="hero-text">
            <span className="hero-label animate-fade-in-up">Travel Journals for Kids</span>
            <h1 className="hero-title animate-fade-in-up stagger-2">
              Turn Family Trips into
              <span className="hero-highlight"> Lasting Memories</span>
            </h1>
            <p className="hero-pain-point animate-fade-in-up stagger-3">
              Imagine reading your child's own words about this trip 20 years from now —
              the funny things they noticed, the questions they asked, the world exactly
              as they saw it at this age.
            </p>
            <p className="hero-description animate-fade-in-up stagger-4">
              A travel journal made for kids to capture their adventure through drawings,
              games, and their own storytelling — a keepsake your whole family will treasure forever.
            </p>
            <div className="hero-actions animate-fade-in-up stagger-5">
              <Link to="/create" className="btn btn-accent btn-large">
                Create Your Journal
                <span className="btn-arrow">→</span>
              </Link>
              <span className="hero-hint">Free • No account required • Ready in 2 minutes</span>
            </div>
          </div>

          <div className="hero-visual animate-fade-in-up stagger-6">
            <div className="journal-mockup">
              <div className="mockup-page mockup-page-back"></div>
              <div className="mockup-page mockup-page-middle"></div>
              <div className="mockup-page mockup-page-front">
                <div className="mockup-header">
                  <span className="mockup-day">Day 1</span>
                  <span className="mockup-location">Costa Rica</span>
                </div>
                <div className="mockup-prompt">
                  "What surprised you most today? How did it make you feel?"
                </div>
                <div className="mockup-lines">
                  <div className="mockup-line"></div>
                  <div className="mockup-line"></div>
                  <div className="mockup-line"></div>
                </div>
                <div className="mockup-doodle">✏️</div>
                {/* Tropical decorations on the journal */}
                <ToucanIcon size={32} className="mockup-decor mockup-toucan" />
                <MonsteraLeaf size={40} className="mockup-decor mockup-monstera" />
                <ButterflyIcon size={20} className="mockup-decor mockup-butterfly" />
              </div>
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">Features</span>
            <h2 className="section-title">Everything Your Child Needs</h2>
            <p className="section-subtitle">
              Thoughtfully designed journals that make travel memorable
            </p>
          </div>

          <div className="features-grid">
            {FEATURES.map((feature, index) => (
              <div
                key={index}
                className={`feature-card reveal ${feature.gradient}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="feature-icon-wrapper">
                  <span className="feature-icon">{feature.icon}</span>
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Inside - Editorial Layout */}
      <section className="inside-section">
        <div className="inside-background"></div>
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">What's Inside</span>
            <h2 className="section-title">Three Sections of Fun</h2>
          </div>

          <div className="inside-grid">
            {SECTIONS_CONTENT.map((section, index) => (
              <div key={index} className="inside-card reveal" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="inside-number">{section.number}</div>
                <div className="inside-content">
                  <div className="inside-visual">{section.visual}</div>
                  <h3 className="inside-title">{section.title}</h3>
                  <p className="inside-description">{section.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Showcase */}
      <section className="destinations-section">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">Destinations</span>
            <h2 className="section-title">Curated for Popular Spots</h2>
            <p className="section-subtitle">
              Location-specific content for family-favorite destinations worldwide
            </p>
          </div>

          <div className="destinations-showcase reveal">
            {DESTINATIONS.map((dest, index) => (
              <Link
                key={index}
                to={`/create?destination=${encodeURIComponent(dest.name)}&country=${encodeURIComponent(dest.country)}`}
                className="destination-pill"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <span className="destination-image">{dest.image}</span>
                <div className="destination-info">
                  <span className="destination-name">{dest.name}</span>
                  <span className="destination-country">{dest.country}</span>
                </div>
              </Link>
            ))}
          </div>

          <p className="destinations-note reveal">
            Don't see your destination? No problem — we generate custom content for any location!
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta-section">
        <div className="cta-background">
          <div className="cta-shape cta-shape-1"></div>
          <div className="cta-shape cta-shape-2"></div>
        </div>
        <div className="container">
          <div className="cta-content reveal">
            <span className="cta-label">Get Started</span>
            <h2 className="cta-title">Ready to Create Memories?</h2>
            <p className="cta-description">
              Your personalized travel journal is just a few clicks away
            </p>
            <Link to="/create" className="btn btn-primary btn-large cta-button">
              Start Creating
              <span className="btn-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-container">
          <div className="footer-brand">
            <BackpackIcon size={24} className="footer-logo" />
            <span className="footer-name">KidsTravel Journal</span>
          </div>
          <p className="footer-tagline">Made with love for adventurous families</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
