import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import styles from './Navbar.module.css'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location])

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.navInner}>

        <Link to="/" className={styles.logo}>
          <img src="/images/logo.png" alt="Workverra" className={styles.logoImg} />
          <span className={styles.logoText}>Workverra</span>
        </Link>

        <ul className={`${styles.navLinks} ${menuOpen ? styles.open : ''}`}>
          <li><a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a></li>
          <li><a href="#features" onClick={() => setMenuOpen(false)}>Features</a></li>
          <li><a href="#workers" onClick={() => setMenuOpen(false)}>Browse Workers</a></li>
        </ul>

        <div className={styles.navCta}>
          <button className={styles.btnGhost} onClick={() => navigate('/login')}>Sign in</button>
          <button className={styles.btnPrimary} onClick={() => navigate('/register')}>Post a Job</button>
        </div>

        <button
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span><span></span><span></span>
        </button>

      </div>
    </nav>
  )
}

export default Navbar