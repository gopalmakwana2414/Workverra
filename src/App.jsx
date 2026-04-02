import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
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

// Redirect logged-in users away from login/register
const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <div className="page-loader">Loading...</div>
  return isAuthenticated ? <Navigate to="/" replace /> : children
}

// Protect routes that need login
const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, user, loading } = useAuth()
  if (loading) return <div className="page-loader">Loading...</div>
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (role && user?.role !== role) return <Navigate to="/" replace />
  return children
}

const Placeholder = ({ title }) => (
  <div style={{ padding: '120px 5%', textAlign: 'center', fontFamily: 'Sora, sans-serif' }}>
    <h1 style={{ fontSize: 32, marginBottom: 12 }}>{title}</h1>
    <p style={{ color: '#4B5563' }}>Coming soon!</p>
  </div>
)

// Layouts
const MainLayout  = ({ children }) => <><Navbar />{children}<Footer /></>
const DashLayout  = ({ children }) => <><Navbar />{children}</>
const AuthLayout  = ({ children }) => <>{children}</>

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"           element={<MainLayout><Home /></MainLayout>} />
      <Route path="/search"     element={<MainLayout><Search /></MainLayout>} />
      <Route path="/worker/:id" element={<MainLayout><WorkerProfile /></MainLayout>} />

      {/* Guest only */}
      <Route path="/login"    element={<GuestRoute><AuthLayout><Login /></AuthLayout></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><AuthLayout><Register /></AuthLayout></GuestRoute>} />

      {/* Protected dashboards */}
      <Route path="/dashboard/worker"
        element={<ProtectedRoute role="worker"><DashLayout><WorkerDashboard /></DashLayout></ProtectedRoute>} />
      <Route path="/dashboard/employer"
        element={<ProtectedRoute role="employer"><DashLayout><EmployerDashboard /></DashLayout></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin"
        element={<ProtectedRoute role="admin"><DashLayout><Placeholder title="Admin Panel" /></DashLayout></ProtectedRoute>} />

      {/* 404 */}
      <Route path="*" element={<MainLayout><Placeholder title="404 — Page Not Found" /></MainLayout>} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}

export default App
