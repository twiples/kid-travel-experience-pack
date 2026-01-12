import { useState, useEffect } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import './CreateJournal.css'

const TRIP_TYPES = [
  { id: 'beach', label: 'Beach', emoji: '🏖️' },
  { id: 'city', label: 'City', emoji: '🏙️' },
  { id: 'cultural', label: 'Cultural', emoji: '🏛️' },
  { id: 'nature', label: 'Nature', emoji: '🏔️' },
  { id: 'theme-park', label: 'Theme Park', emoji: '🎢' },
]

const INTERESTS = [
  { id: 'animals', label: 'Animals', emoji: '🐾' },
  { id: 'art', label: 'Art', emoji: '🎨' },
  { id: 'food', label: 'Food', emoji: '🍕' },
  { id: 'sports', label: 'Sports', emoji: '⚽' },
  { id: 'history', label: 'History', emoji: '📜' },
  { id: 'science', label: 'Science', emoji: '🔬' },
  { id: 'music', label: 'Music', emoji: '🎵' },
  { id: 'nature', label: 'Nature', emoji: '🌿' },
  { id: 'architecture', label: 'Architecture', emoji: '🏗️' },
  { id: 'transportation', label: 'Transportation', emoji: '🚂' },
  { id: 'culture', label: 'Culture', emoji: '🌍' },
]

const STEPS = [
  { id: 1, title: 'Trip Details' },
  { id: 2, title: 'Child Info' },
  { id: 3, title: 'Interests' },
  { id: 4, title: 'Family Photo' },
  { id: 5, title: 'Preview' },
]

function CreateJournal() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    // Trip details
    customDestination: '',
    startDate: '',
    endDate: '',
    tripType: [],
    landmarks: '',
    // Child info
    childName: '',
    childAge: 10,
    // Interests
    interests: [],
    // Photo
    familyPhoto: null,
    photoPreview: null,
  })

  // Pre-fill destination from URL params
  useEffect(() => {
    const destination = searchParams.get('destination')
    const country = searchParams.get('country')

    if (destination) {
      const fullDestination = country ? `${destination}, ${country}` : destination
      setFormData(prev => ({
        ...prev,
        customDestination: fullDestination
      }))
    }
  }, [searchParams])

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleArrayItem = (field, item) => {
    setFormData(prev => {
      const arr = prev[field]
      if (arr.includes(item)) {
        return { ...prev, [field]: arr.filter(i => i !== item) }
      }
      return { ...prev, [field]: [...arr, item] }
    })
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Photo must be under 5MB')
        return
      }
      updateFormData('familyPhoto', file)
      const reader = new FileReader()
      reader.onload = (e) => {
        updateFormData('photoPreview', e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.customDestination.trim() &&
               formData.startDate &&
               formData.endDate &&
               formData.tripType.length > 0
      case 2:
        return formData.childName.trim() && formData.childAge >= 8 && formData.childAge <= 12
      case 3:
        return formData.interests.length > 0
      case 4:
        return true // Photo is optional
      case 5:
        return true
      default:
        return false
    }
  }

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const submitData = new FormData()
      submitData.append('destination', formData.customDestination)
      submitData.append('startDate', formData.startDate)
      submitData.append('endDate', formData.endDate)
      submitData.append('tripType', JSON.stringify(formData.tripType))
      submitData.append('landmarks', formData.landmarks)
      submitData.append('childName', formData.childName)
      submitData.append('childAge', formData.childAge)
      submitData.append('interests', JSON.stringify(formData.interests))
      if (formData.familyPhoto) {
        submitData.append('familyPhoto', formData.familyPhoto)
      }

      const response = await fetch('/api/journal/create', {
        method: 'POST',
        body: submitData,
      })

      const data = await response.json()
      if (data.journalId) {
        navigate(`/processing/${data.journalId}`)
      } else {
        throw new Error(data.error || 'Failed to create journal')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to create journal. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getDestinationName = () => {
    return formData.customDestination
  }

  const getTripDays = () => {
    if (!formData.startDate || !formData.endDate) return 0
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    const diffTime = Math.abs(end - start)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  return (
    <div className="create-journal">
      <header className="create-header">
        <div className="container">
          <Link to="/" className="back-link">← Back to Home</Link>
          <h1>Create Your Travel Journal</h1>
        </div>
      </header>

      <main className="create-main">
        <div className="container-sm">
          {/* Progress Steps */}
          <div className="progress-steps">
            {STEPS.map((step, index) => (
              <div key={step.id} className="progress-step">
                <div className={`step-circle ${
                  currentStep > step.id ? 'completed' :
                  currentStep === step.id ? 'active' : ''
                }`}>
                  {currentStep > step.id ? '✓' : step.id}
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`step-line ${currentStep > step.id ? 'completed' : ''}`} />
                )}
              </div>
            ))}
          </div>
          <p className="step-label text-center mb-3">
            Step {currentStep}: {STEPS[currentStep - 1].title}
          </p>

          {/* Step Content */}
          <div className="card step-content fade-in">
            {currentStep === 1 && (
              <div className="step-1">
                <h2>Where are you going?</h2>

                <div className="form-group">
                  <label className="form-label">Destination</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., Rome, Italy"
                    value={formData.customDestination}
                    onChange={(e) => updateFormData('customDestination', e.target.value)}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={formData.startDate}
                      onChange={(e) => updateFormData('startDate', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={formData.endDate}
                      min={formData.startDate}
                      onChange={(e) => updateFormData('endDate', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Trip Type</label>
                  <p className="form-hint">Select all that apply</p>
                  <div className="checkbox-group">
                    {TRIP_TYPES.map(type => (
                      <label
                        key={type.id}
                        className={`checkbox-item ${formData.tripType.includes(type.id) ? 'selected' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.tripType.includes(type.id)}
                          onChange={() => toggleArrayItem('tripType', type.id)}
                        />
                        <span>{type.emoji}</span>
                        <span>{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Planned Landmarks/Activities (optional)</label>
                  <textarea
                    className="form-textarea"
                    placeholder="e.g., Eiffel Tower, Louvre Museum, Seine River cruise..."
                    value={formData.landmarks}
                    onChange={(e) => updateFormData('landmarks', e.target.value)}
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="step-2">
                <h2>Tell us about your child</h2>

                <div className="form-group">
                  <label className="form-label">Child's Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter first name"
                    value={formData.childName}
                    onChange={(e) => updateFormData('childName', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Child's Age</label>
                  <p className="form-hint">This journal is designed for ages 8-12</p>
                  <div className="age-selector">
                    {[8, 9, 10, 11, 12].map(age => (
                      <button
                        key={age}
                        type="button"
                        className={`age-btn ${formData.childAge === age ? 'selected' : ''}`}
                        onClick={() => updateFormData('childAge', age)}
                      >
                        {age}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="step-3">
                <h2>What does {formData.childName || 'your child'} love?</h2>
                <p className="step-description">
                  We'll customize journal prompts based on these interests
                </p>

                <div className="interests-grid">
                  {INTERESTS.map(interest => (
                    <label
                      key={interest.id}
                      className={`interest-item ${formData.interests.includes(interest.id) ? 'selected' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.interests.includes(interest.id)}
                        onChange={() => toggleArrayItem('interests', interest.id)}
                      />
                      <span className="interest-emoji">{interest.emoji}</span>
                      <span className="interest-label">{interest.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="step-4">
                <h2>Add a Family Photo (Optional)</h2>
                <p className="step-description">
                  Upload a family photo and we'll create custom cartoon-style illustrations
                  that look like your family throughout the journal!
                </p>

                <div className="photo-upload-area">
                  {formData.photoPreview ? (
                    <div className="photo-preview">
                      <img src={formData.photoPreview} alt="Family preview" />
                      <button
                        type="button"
                        className="remove-photo"
                        onClick={() => {
                          updateFormData('familyPhoto', null)
                          updateFormData('photoPreview', null)
                        }}
                      >
                        × Remove
                      </button>
                    </div>
                  ) : (
                    <label className="upload-label">
                      <input
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={handlePhotoChange}
                        hidden
                      />
                      <div className="upload-content">
                        <span className="upload-icon">📷</span>
                        <span className="upload-text">Click to upload a photo</span>
                        <span className="upload-hint">JPG or PNG, max 5MB</span>
                      </div>
                    </label>
                  )}
                </div>

                <div className="privacy-note">
                  <h4>🔒 Privacy Promise</h4>
                  <ul>
                    <li>Your photo is only used to generate illustrations</li>
                    <li>Original photos are deleted immediately after processing</li>
                    <li>We never store or share your images</li>
                  </ul>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="step-5">
                <h2>Review Your Journal</h2>

                <div className="preview-summary">
                  <div className="preview-section">
                    <h3>🗺️ Trip Details</h3>
                    <p><strong>Destination:</strong> {getDestinationName()}</p>
                    <p><strong>Dates:</strong> {formData.startDate} to {formData.endDate} ({getTripDays()} days)</p>
                    <p><strong>Trip Type:</strong> {formData.tripType.join(', ')}</p>
                    {formData.landmarks && (
                      <p><strong>Landmarks:</strong> {formData.landmarks}</p>
                    )}
                  </div>

                  <div className="preview-section">
                    <h3>👧 Traveler</h3>
                    <p><strong>Name:</strong> {formData.childName}</p>
                    <p><strong>Age:</strong> {formData.childAge} years old</p>
                  </div>

                  <div className="preview-section">
                    <h3>💡 Interests</h3>
                    <div className="interests-preview">
                      {formData.interests.map(id => {
                        const interest = INTERESTS.find(i => i.id === id)
                        return (
                          <span key={id} className="interest-tag">
                            {interest?.emoji} {interest?.label}
                          </span>
                        )
                      })}
                    </div>
                  </div>

                  <div className="preview-section">
                    <h3>📷 Family Avatar</h3>
                    {formData.photoPreview ? (
                      <div className="photo-thumb">
                        <img src={formData.photoPreview} alt="Family" />
                        <span>Custom illustrations will be generated</span>
                      </div>
                    ) : (
                      <p>No photo uploaded - using default illustrations</p>
                    )}
                  </div>
                </div>

                <div className="journal-estimate">
                  <h4>Your journal will include:</h4>
                  <ul>
                    <li>📚 Pre-trip preparation pages with {getDestinationName()} facts</li>
                    <li>✈️ In-flight activities and puzzles</li>
                    <li>📝 {getTripDays()} daily journal pages with custom prompts</li>
                    <li>🎨 Sketching and reflection spaces</li>
                  </ul>
                  <p className="estimate-pages">Estimated: 20-30 pages</p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="step-navigation">
            {currentStep > 1 && (
              <button type="button" className="btn btn-secondary" onClick={prevStep}>
                ← Back
              </button>
            )}
            {currentStep < 5 ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={nextStep}
                disabled={!canProceed()}
              >
                Continue →
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary btn-large"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Generate My Journal →'}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default CreateJournal
