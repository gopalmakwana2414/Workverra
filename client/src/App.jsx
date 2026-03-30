import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Home from './pages/Home'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Search from './pages/Search/Search'
import WorkerProfile from './pages/WorkerProfile/WorkerProfile'
import WorkerDashboard from './pages/WorkerDashboard/WorkerDashboard'
import EmployerDashboard from './pages/EmployerDashboard/EmployerDashboard'
import './styles/globals.css'

// Pages without Navbar/Footer (full-screen layouts)
const AuthLayout = ({ children }) => <>{children}</>

// Pages with Navbar/Footer
const MainLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
)

// Dashboard layout (no footer, has its own sidebar)
const DashLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
)

const Placeholder = ({ title }) => (
  <div style={{ padding:'120px 5%', textAlign:'center', fontFamily:'Sora, sans-serif' }}>
    <h1 style={{ fontSize:32, marginBottom:12 }}>{title}</h1>
    <p style={{ color:'#4B5563' }}>Coming soon!</p>
  </div>
)

function App() {
  return (
    <Router>
      <Routes>
        {/* Main site pages */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/search" element={<MainLayout><Search /></MainLayout>} />
        <Route path="/worker/:id" element={<MainLayout><WorkerProfile /></MainLayout>} />

        {/* Auth pages — full screen, no nav/footer */}
        <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />

        {/* Dashboard pages — nav only, no footer */}
        <Route path="/dashboard/worker" element={<DashLayout><WorkerDashboard /></DashLayout>} />
        <Route path="/dashboard/employer" element={<DashLayout><EmployerDashboard /></DashLayout>} />

        {/* Admin — placeholder for now */}
        <Route path="/admin" element={<DashLayout><Placeholder title="Admin Panel — Coming Soon" /></DashLayout>} />

        {/* 404 */}
        <Route path="*" element={<MainLayout><Placeholder title="404 — Page Not Found" /></MainLayout>} />
      </Routes>
    </Router>
  )
}

export default App
