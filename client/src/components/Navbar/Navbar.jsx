import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Navbar.module.css'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, user, logout } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const close = () => setMenuOpen(false)

  const handleDashboard = () => {
    navigate(user?.role === 'worker' ? '/dashboard/worker' : '/dashboard/employer')
    close()
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    close()
  }

  const handlePostJob = () => {
    navigate('/register?role=employer')
    close()
  }

  // 🔥 FINAL FIX FUNCTION
  const navigateToSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/")
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    }
    close()
  }

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.navInner}>

        {/* Logo */}
        <Link
          to="/"
          className={styles.logo}
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" })
            close()
          }}
        >
          <img
            src="/images/logo.png"
            alt="Workverra"
            className={styles.logoImg}
            onError={e => { e.target.style.display = 'none' }}
          />
          <div className={styles.logoText}>
            <span className={styles.logoName}>Workverra</span>
            <span className={styles.logoTagline}>Connecting Skills Locally</span>
          </div>
        </Link>

        {/* Links */}
        <ul className={`${styles.navLinks} ${menuOpen ? styles.open : ''}`}>
          <li>
            <Link
              to="/"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" })
                close()
              }}
            >
              Home
            </Link>
          </li>

          <li>
            <button onClick={() => navigateToSection("how-it-works")}>
              How it works
            </button>
          </li>

          <li>
            <button onClick={() => navigateToSection("features")}>
              Features
            </button>
          </li>

          <li>
            <button onClick={() => navigateToSection("workers")}>
              Browse Workers
            </button>
          </li>

          <li className={styles.mobileAuthRow}>
            {isAuthenticated ? (
              <>
                <button className={styles.mobileDashBtn} onClick={handleDashboard}>
                  📊 My Dashboard
                </button>
                <button className={styles.mobileLogoutBtn} onClick={handleLogout}>
                  🚪 Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={styles.mobileSignInBtn} onClick={close}>
                  Sign in
                </Link>
                <button className={styles.mobilePostBtn} onClick={handlePostJob}>
                  Post a Job 🚀
                </button>
              </>
            )}
          </li>
        </ul>

        {/* Desktop Buttons */}
        <div className={styles.navCta}>
          {isAuthenticated ? (
            <>
              <button className={styles.btnGhost} onClick={handleDashboard}>
                Dashboard
              </button>
              <button className={styles.btnPrimary} onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className={styles.btnGhost} onClick={() => navigate('/login')}>
                Sign in
              </button>
              <button className={styles.btnPrimary} onClick={handlePostJob}>
                Post a Job 🚀
              </button>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setMenuOpen(v => !v)}
        >
          <span /><span /><span />
        </button>

      </div>
    </nav>
  )
}

export default Navbar