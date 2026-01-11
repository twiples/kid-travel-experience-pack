import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import CreateJournal from './pages/CreateJournal'
import Processing from './pages/Processing'
import Download from './pages/Download'

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create" element={<CreateJournal />} />
        <Route path="/processing/:journalId" element={<Processing />} />
        <Route path="/download/:journalId" element={<Download />} />
      </Routes>
    </div>
  )
}

export default App
