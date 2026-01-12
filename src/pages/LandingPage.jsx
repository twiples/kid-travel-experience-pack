import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import BackpackIcon from '../components/BackpackIcon'
import {
  ToucanIcon,
  MonsteraLeaf,
  ButterflyIcon,
  HummingbirdIcon,
  FlowerIcon,
  PalmTree,
  TokyoIcon,
  ParisIcon,
  LondonIcon,
  OrlandoIcon,
  BeachIcon,
  CloudIcon,
  SparkleIcon,
  AirplaneIcon,
  CompassIcon
} from '../components/TropicalDecorations'
import './LandingPage.css'

// Destination icons mapping
const DESTINATION_ICONS = {
  'Osaka': TokyoIcon,      // Japan icon
  'Lyon': ParisIcon,       // France icon
  'Moorea': BeachIcon,     // French Polynesia icon
  'Bangkok': TokyoIcon,    // Thailand icon (Asian style)
  'Verona': ParisIcon,     // Italy icon (European style)
}

const JOURNEY_STEPS = [
  {
    icon: '🗺️',
    title: 'Create & Print',
    description: 'Personalize your journal and print at home',
  },
  {
    icon: '✈️',
    title: 'Travel & Fill',
    description: 'Kids complete the journal during your trip',
  },
  {
    icon: '📸',
    title: 'Upload Pages',
    description: 'Scan the QR code and upload completed pages',
  },
  {
    icon: '🎬',
    title: 'Share Memories',
    description: 'Get videos, cards, and slides to treasure forever',
  },
]

const FEATURES = [
  {
    icon: '📖',
    title: 'Printed Journal',
    description: 'Beautiful PDF with prompts, activities, and daily pages tailored to your kid and destination',
    gradient: 'gradient-1'
  },
  {
    icon: '🎬',
    title: 'Memory Video',
    description: 'Animated video of completed pages with music — perfect for sharing',
    gradient: 'gradient-2'
  },
  {
    icon: '💌',
    title: 'Holiday Cards',
    description: 'Turn journal highlights into shareable cards for family and friends',
    gradient: 'gradient-3'
  },
  {
    icon: '📊',
    title: 'School Slides',
    description: 'Presentation deck for show-and-tell that kids will love presenting',
    gradient: 'gradient-4'
  },
]

const PRINTED_JOURNAL_SECTIONS = [
  {
    number: '01',
    title: 'Pre-Trip Prep',
    description: 'Maps, fun facts, cultural highlights, and trivia about your destination',
    visual: '🗺️'
  },
  {
    number: '02',
    title: 'Travel Activities',
    description: 'Games, puzzles, and creative activities for flights and car rides',
    visual: '✈️'
  },
  {
    number: '03',
    title: 'Daily Journal',
    description: 'Prompts, sketching space, mood trackers, and reflection questions',
    visual: '📝'
  },
]

const DIGITAL_OUTPUTS = [
  {
    icon: '🎬',
    title: 'Memory Video',
    description: '30-60 second animated video with music',
  },
  {
    icon: '💌',
    title: 'Holiday Cards',
    description: '4 beautiful card templates to share',
  },
  {
    icon: '📊',
    title: 'School Presentation',
    description: '8-12 slides for show-and-tell',
  },
  {
    icon: '📱',
    title: 'Social Clips',
    description: 'Short clips for Instagram & TikTok',
  },
]

const DESTINATIONS = [
  { name: 'Osaka', country: 'Japan', image: '🏯' },
  { name: 'Lyon', country: 'France', image: '🦁' },
  { name: 'Moorea', country: 'French Polynesia', image: '🏝️' },
  { name: 'Bangkok', country: 'Thailand', image: '🛕' },
  { name: 'Verona', country: 'Italy', image: '🏛️' },
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
          {/* Floating decorative elements */}
          <CloudIcon size={120} className="hero-decor hero-cloud-1" />
          <CloudIcon size={100} className="hero-decor hero-cloud-2" />
          <AirplaneIcon size={40} className="hero-decor hero-airplane" />
          <SparkleIcon size={20} className="hero-decor hero-sparkle-1" />
          <SparkleIcon size={16} className="hero-decor hero-sparkle-2" />
          <SparkleIcon size={24} className="hero-decor hero-sparkle-3" />
          <ButterflyIcon size={28} className="hero-decor hero-butterfly-float" />
          <FlowerIcon size={24} className="hero-decor hero-flower-1" />
          <HummingbirdIcon size={32} className="hero-decor hero-hummingbird" />
        </div>

        <div className="container hero-content">
          <div className="hero-text">
            <span className="hero-label animate-fade-in-up">Print • Complete • Share</span>
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
              games, and their own storytelling. After your trip, upload the completed pages
              and we'll transform them into shareable videos, holiday cards, and keepsakes
              your whole family will treasure forever.
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
        <div className="features-decorations">
          <SparkleIcon size={18} className="features-decor features-sparkle-1" />
          <SparkleIcon size={14} className="features-decor features-sparkle-2" />
          <CompassIcon size={36} className="features-decor features-compass" />
          <PalmTree size={50} className="features-decor features-palm" />
        </div>
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">What You Get</span>
            <h2 className="section-title">One Trip, Four Keepsakes</h2>
            <p className="section-subtitle">
              A printed journal for the trip, plus digital memories to share forever
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

      {/* How It Works - Journey Timeline */}
      <section className="journey-section">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">How It Works</span>
            <h2 className="section-title">Your Complete Memory Journey</h2>
            <p className="section-subtitle">
              From printed journal to shareable digital memories in 4 simple steps
            </p>
          </div>

          <div className="journey-timeline reveal">
            <svg className="journey-path" viewBox="0 0 800 80" preserveAspectRatio="none">
              <path
                className="journey-path-bg"
                d="M 30 40 L 770 40"
                fill="none"
                strokeWidth="4"
              />
              <path
                className="journey-path-line"
                d="M 30 40 L 770 40"
                fill="none"
                strokeWidth="4"
              />
            </svg>

            <div className="journey-steps">
              {JOURNEY_STEPS.map((step, index) => (
                <div
                  key={index}
                  className="journey-step"
                  style={{ animationDelay: `${index * 200 + 300}ms` }}
                >
                  <div className="journey-step-icon">
                    <span>{step.icon}</span>
                  </div>
                  <h3 className="journey-step-title">{step.title}</h3>
                  <p className="journey-step-description">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="journey-cta reveal">
            <Link to="/create" className="btn btn-primary">
              Start Your Journey
              <span className="btn-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* The Complete Package - Two Panels */}
      <section className="package-section">
        <div className="package-background"></div>
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">The Complete Package</span>
            <h2 className="section-title">From Paper to Digital Memories</h2>
          </div>

          <div className="package-panels">
            {/* Printed Journal Panel */}
            <div className="package-panel printed-panel reveal">
              <div className="panel-header">
                <span className="panel-icon">📖</span>
                <h3>Printed Journal</h3>
                <p className="panel-subtitle">For the trip</p>
              </div>
              <div className="panel-items">
                {PRINTED_JOURNAL_SECTIONS.map((section, index) => (
                  <div key={index} className="panel-item">
                    <span className="item-visual">{section.visual}</span>
                    <div className="item-content">
                      <h4>{section.title}</h4>
                      <p>{section.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="panel-footer">
                <span>Print at home • Ready in 2 minutes</span>
              </div>
            </div>

            {/* Arrow between panels */}
            <div className="package-arrow reveal">
              <div className="arrow-line"></div>
              <span className="arrow-text">Upload completed pages</span>
              <div className="arrow-icon">→</div>
            </div>

            {/* Digital Outputs Panel */}
            <div className="package-panel digital-panel reveal">
              <div className="panel-header">
                <span className="panel-icon">✨</span>
                <h3>Digital Memories</h3>
                <p className="panel-subtitle">After the trip</p>
              </div>
              <div className="panel-items digital-items">
                {DIGITAL_OUTPUTS.map((output, index) => (
                  <div key={index} className="panel-item digital-item">
                    <span className="item-visual">{output.icon}</span>
                    <div className="item-content">
                      <h4>{output.title}</h4>
                      <p>{output.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="panel-footer">
                <span>Share with family • Keep forever</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Showcase */}
      <section className="destinations-section">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">Sample Journals</span>
            <h2 className="section-title">Preview Popular Destinations</h2>
            <p className="section-subtitle">
              Download sample journals to see what you'll create
            </p>
          </div>

          <div className="destinations-showcase reveal">
            {DESTINATIONS.map((dest, index) => {
              const IconComponent = DESTINATION_ICONS[dest.name]
              const sampleFile = `/samples/${dest.name.toLowerCase()}-sample.pdf`
              return (
                <a
                  key={index}
                  href={sampleFile}
                  className="destination-pill"
                  style={{ animationDelay: `${index * 80}ms` }}
                  download
                >
                  <div className="destination-icon">
                    {IconComponent && <IconComponent size={48} />}
                  </div>
                  <div className="destination-info">
                    <span className="destination-name">{dest.name}</span>
                    <span className="destination-country">{dest.country}</span>
                  </div>
                  <span className="destination-download">⬇ PDF</span>
                </a>
              )
            })}
          </div>

          <div className="destinations-cta reveal">
            <Link to="/demo" className="btn btn-primary demo-btn">
              See Complete Demo: Sophia's Verona Adventure
              <span className="btn-arrow">→</span>
            </Link>
            <p className="destinations-note">
              Want a journal for a different destination?
            </p>
            <Link to="/create" className="btn btn-secondary">
              Create Custom Journal
              <span className="btn-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta-section">
        <div className="cta-background">
          <div className="cta-shape cta-shape-1"></div>
          <div className="cta-shape cta-shape-2"></div>
          <AirplaneIcon size={32} className="cta-decor cta-airplane" />
          <SparkleIcon size={20} className="cta-decor cta-sparkle-1" />
          <SparkleIcon size={16} className="cta-decor cta-sparkle-2" />
          <ButterflyIcon size={24} className="cta-decor cta-butterfly" />
        </div>
        <div className="container">
          <div className="cta-content reveal">
            <span className="cta-label">Get Started</span>
            <h2 className="cta-title">Ready to Create Memories?</h2>
            <p className="cta-description">
              Your personalized travel journal is just a few clicks away
            </p>
            <div className="cta-buttons">
              <Link to="/create" className="btn btn-primary btn-large cta-button">
                Create Journal
                <span className="btn-arrow">→</span>
              </Link>
              <Link to="/memories" className="btn btn-secondary cta-button-secondary">
                Upload Completed Journal
              </Link>
            </div>
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
