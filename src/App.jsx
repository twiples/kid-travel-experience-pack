import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import CreateJournal from './pages/CreateJournal'
import Processing from './pages/Processing'
import Download from './pages/Download'
import Memories from './pages/Memories'
import DemoShowcase from './pages/DemoShowcase'

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create" element={<CreateJournal />} />
        <Route path="/processing/:journalId" element={<Processing />} />
        <Route path="/download/:journalId" element={<Download />} />
        <Route path="/memories" element={<Memories />} />
        <Route path="/memories/:journalId" element={<Memories />} />
        <Route path="/demo" element={<DemoShowcase />} />
      </Routes>
    </div>
  )
}

export default App
