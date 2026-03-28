import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Home from './pages/Home'
import Login from './pages/Login/Login'
import Search from './pages/Search/Search'
import './styles/globals.css'

const Placeholder = ({ title }) => (
  <div style={{ padding: '120px 5%', textAlign: 'center', fontFamily: 'Sora, sans-serif' }}>
    <h1 style={{ fontSize: 32, marginBottom: 12 }}>{title}</h1>
    <p style={{ color: '#4B5563' }}>Coming soon — build this next!</p>
  </div>
)

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/"                      element={<Home />} />
        <Route path="/login"                 element={<Login />} />
        <Route path="/search"                element={<Search />} />
        <Route path="/register"              element={<Placeholder title="Register — Coming Soon" />} />
        <Route path="/worker/:id"            element={<Placeholder title="Worker Profile — Coming Soon" />} />
        <Route path="/book"                  element={<Placeholder title="Booking — Coming Soon" />} />
        <Route path="/dashboard/worker"      element={<Placeholder title="Worker Dashboard — Coming Soon" />} />
        <Route path="/dashboard/employer"    element={<Placeholder title="Employer Dashboard — Coming Soon" />} />
        <Route path="/admin"                 element={<Placeholder title="Admin Panel — Coming Soon" />} />
        <Route path="*"                      element={<Placeholder title="404 — Page Not Found" />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
