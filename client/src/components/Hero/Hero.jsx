import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Hero.module.css'

const TYPEWRITER_WORDS = [
  'Electricians',
  'Plumbers',
  'Carpenters',
  'Painters',
  'AC Technicians',
  'Welders',
]

const workerData = {
  initials: 'RS',
  name: 'Ravi Sharma',
  title: 'Electrician · Bhopal, MP',
  skills: ['Wiring', 'AC Repair', 'Inverter Setup', 'Panel Work'],
  jobs: '120+',
  rating: '4.9★',
  rate: '₹450',
  distance: '1.2 km from you',
}

const avatarColors = ['#667eea', '#f093fb', '#4facfe', '#43e97b']

const Hero = () => {
  const navigate = useNavigate()
  const [wordIndex, setWordIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [charIndex, setCharIndex] = useState(0)

  // Typewriter effect
  useEffect(() => {
    const currentWord = TYPEWRITER_WORDS[wordIndex]
    let timeout

    if (!isDeleting && charIndex < currentWord.length) {
      timeout = setTimeout(() => {
        setDisplayed(currentWord.slice(0, charIndex + 1))
        setCharIndex(c => c + 1)
      }, 80)
    } else if (!isDeleting && charIndex === currentWord.length) {
      timeout = setTimeout(() => setIsDeleting(true), 1800)
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setDisplayed(currentWord.slice(0, charIndex - 1))
        setCharIndex(c => c - 1)
      }, 45)
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false)
      setWordIndex(i => (i + 1) % TYPEWRITER_WORDS.length)
    }

    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, wordIndex])

  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>

        {/* Left: Copy */}
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.dot}></span>
            Now live in Tier 2 &amp; 3 cities across India
          </div>

          <h1 className={styles.heroTitle}>
            India's Fastest Way to Hire{' '}
            <span className={styles.typewriterWrap}>
              <span className={styles.highlight}>{displayed}</span>
              <span className={styles.cursor}>|</span>
            </span>
          </h1>

          <p className={styles.heroSub}>
            Workverra is India's hyperlocal talent marketplace — connecting verified, skilled
            workers with employers in your city. OTP-secured profiles, real-time booking, and
            escrow-protected UPI payments. Hire in under 5 minutes.
          </p>

          <div className={styles.trustPills}>
            <span className={styles.pill}>✓ Verified workers</span>
            <span className={styles.pill}>✓ Escrow payments</span>
            <span className={styles.pill}>✓ Real-time booking</span>
          </div>

          <div className={styles.heroActions}>
            <button
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={() => navigate('/search')}
            >
              Find Workers Near You →
            </button>
            <button
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={() => navigate('/register?role=worker')}
            >
              I'm a Worker — Join Free
            </button>
          </div>

          <div className={styles.heroTrust}>
            <div className={styles.avatarStack}>
              {avatarColors.map((color, i) => (
                <div key={i} className={styles.avatar} style={{ background: color }}>
                  {['R', 'P', 'A', 'S'][i]}
                </div>
              ))}
            </div>
            <p><strong>2,400+ workers</strong> verified this month</p>
          </div>
        </div>

        {/* Right: Worker Card */}
        <div className={styles.heroVisual}>
          <div className={styles.floatingRating}>
            <span className={styles.star}>★</span>
            <strong>4.9</strong> avg rating
          </div>

          <div className={styles.workerCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardAvatar}>{workerData.initials}</div>
              <div className={styles.cardInfo}>
                <h3>{workerData.name}</h3>
                <p>{workerData.title}</p>
                <span className={styles.verifiedBadge}>✓ Verified Pro</span>
              </div>
            </div>

            <div className={styles.skillTags}>
              {workerData.skills.map((skill, i) => (
                <span key={skill} className={`${styles.skillTag} ${i === 2 ? styles.accent : ''}`}>
                  {skill}
                </span>
              ))}
            </div>

            <div className={styles.cardStats}>
              <div className={styles.stat}>
                <div className={styles.statVal}>{workerData.jobs}</div>
                <div className={styles.statLabel}>Jobs done</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statVal}>{workerData.rating}</div>
                <div className={styles.statLabel}>Rating</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statVal}>{workerData.rate}<small>/hr</small></div>
                <div className={styles.statLabel}>Rate</div>
              </div>
            </div>

            <button className={styles.bookBtn} onClick={() => navigate('/search')}>
              Book Now via Workverra
            </button>
          </div>

          <div className={styles.mapPill}>
            <span className={styles.mapPin}></span>
            {workerData.distance}
          </div>
        </div>

      </div>
    </section>
  )
}

export default Hero
