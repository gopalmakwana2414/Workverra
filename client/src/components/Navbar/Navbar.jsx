import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Navbar.module.css'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch]     = useState('')
  const navigate  = useNavigate()
  const location  = useLocation()
  const { isAuthenticated, user, logout } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) navigate(`/search?q=${encodeURIComponent(search.trim())}`)
  }

  const handleDashboard = () => {
    navigate(user?.role === 'worker' ? '/dashboard/worker' : '/dashboard/employer')
  }

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.navInner}>

        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <img src="/images/logo.png" alt="Workverra" className={styles.logoImg}
            onError={(e) => { e.target.style.display = 'none' }} />
          <div className={styles.logoText}>
            <span className={styles.logoName}>Workverra</span>
            <span className={styles.logoTagline}>Connecting Skills Locally</span>
          </div>
        </Link>

        {/* Nav Links */}
        <ul className={`${styles.navLinks} ${menuOpen ? styles.open : ''}`}>
          <li><a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a></li>
          <li><a href="#features"     onClick={() => setMenuOpen(false)}>Features</a></li>
          <li><Link to="/search"      onClick={() => setMenuOpen(false)}>Browse Workers</Link></li>
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
            value={search} onChange={e => setSearch(e.target.value)} />
        </form>

        {/* CTA */}
        <div className={styles.navCta}>
          {isAuthenticated ? (
            <>
              <button className={styles.btnGhost} onClick={handleDashboard}>
                Dashboard
              </button>
              <button className={styles.btnPrimary} onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className={styles.btnGhost} onClick={() => navigate('/login')}>
                Sign in
              </button>
              <button className={styles.btnPrimary} onClick={() => navigate('/register')}>
                Post a Job 🚀
              </button>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <span/><span/><span/>
        </button>

      </div>
    </nav>
  )
}

export default Navbar