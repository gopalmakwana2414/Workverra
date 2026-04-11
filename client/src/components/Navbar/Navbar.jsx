import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Navbar.module.css'

const Navbar = () => {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [search,    setSearch]    = useState('')
  const navigate  = useNavigate()
  const location  = useLocation()
  const { isAuthenticated, user, logout } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`)
      setSearch('')
    }
  }

  const handleDashboard = () => {
    navigate(user?.role === 'worker' ? '/dashboard/worker' : '/dashboard/employer')
    setMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  // FIX #1: "Post a Job" → goes directly to register as employer, NOT role selection
  const handlePostJob = () => {
    navigate('/register?role=employer')
    setMenuOpen(false)
  }

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.navInner}>

        {/* FIX #7: Logo — always show original color, no filter on login page */}
        <Link to="/" className={styles.logo}>
          <img
            src="/images/logo.png"
            alt="Workverra"
            className={styles.logoImg}
            onError={(e) => { e.target.style.display = 'none' }}
          />
          <div className={styles.logoText}>
            <span className={styles.logoName}>Workverra</span>
            <span className={styles.logoTagline}>Connecting Skills Locally</span>
          </div>
        </Link>

        {/* Desktop nav links */}
        <ul className={`${styles.navLinks} ${menuOpen ? styles.open : ''}`}>
          <li><a href="/#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a></li>
          <li><a href="/#features"     onClick={() => setMenuOpen(false)}>Features</a></li>
          <li><Link to="/search"       onClick={() => setMenuOpen(false)}>Browse Workers</Link></li>

          {/* Mobile-only auth row */}
          <li className={styles.mobileAuthRow}>
            {isAuthenticated ? (
              <>
                <button className={styles.mobileDashBtn} onClick={handleDashboard}>📊 My Dashboard</button>
                <button className={styles.mobileLogoutBtn} onClick={handleLogout}>🚪 Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login"    className={styles.mobileSignInBtn} onClick={() => setMenuOpen(false)}>Sign in</Link>
                <button className={styles.mobilePostBtn} onClick={handlePostJob}>Post a Job 🚀</button>
              </>
            )}
          </li>
        </ul>

        {/* Search */}
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <span className={styles.searchIcon}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
          </span>
          <input className={styles.searchInput} type="text"
            placeholder="Search workers, skills..."
            value={search}
            onChange={e => setSearch(e.target.value)} />
        </form>

        {/* Desktop CTA */}
        <div className={styles.navCta}>
          {isAuthenticated ? (
            <>
              <button className={styles.btnGhost} onClick={handleDashboard}>Dashboard</button>
              <button className={styles.btnPrimary} onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button className={styles.btnGhost} onClick={() => navigate('/login')}>Sign in</button>
              {/* FIX #1: Direct to employer registration */}
              <button className={styles.btnPrimary} onClick={handlePostJob}>Post a Job 🚀</button>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span/><span/><span/>
        </button>

      </div>
    </nav>
  )
}

export default Navbar
