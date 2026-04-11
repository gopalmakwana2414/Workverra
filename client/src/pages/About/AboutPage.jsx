import { Link } from 'react-router-dom'
import styles from './AboutPage.module.css'

const STATS = [
  { num: '2,400+', label: 'Verified Workers' },
  { num: '200+',   label: 'Cities Covered' },
  { num: '10,000+',label: 'Happy Users' },
  { num: '4.8★',   label: 'Average Rating' },
]

const TEAM = [
  { name: 'Gopal Makwana',  role: 'Founder & CEO',           avatar: 'GM', gradient: 'linear-gradient(135deg,#667eea,#764ba2)', bio: 'Full-stack developer and product thinker. Passionate about bridging the digital divide for India\'s skilled workforce.' },
  { name: 'Meera Sharma',   role: 'Head of Operations',       avatar: 'MS', gradient: 'linear-gradient(135deg,#f093fb,#f5576c)', bio: 'Operations expert with 5 years in hyperlocal marketplace scaling across Tier 2 cities.' },
  { name: 'Arjun Verma',    role: 'CTO',                      avatar: 'AV', gradient: 'linear-gradient(135deg,#43e97b,#38f9d7)', bio: 'Backend architect. Built scalable APIs handling thousands of concurrent bookings.' },
  { name: 'Priya Patel',    role: 'Head of Worker Relations',  avatar: 'PP', gradient: 'linear-gradient(135deg,#fa709a,#fee140)', bio: 'Ensures every worker on the platform is supported, verified, and empowered to earn more.' },
]

const VALUES = [
  { icon: '🤝', title: 'Trust First',      desc: 'Every transaction on Workverra is built on verified identities, escrow payments, and transparent reviews.' },
  { icon: '📍', title: 'Hyperlocal Focus', desc: 'We believe the next billion opportunities are in Tier 2 and 3 India. Our platform is built for them.' },
  { icon: '💡', title: 'Simplicity',       desc: 'Complex technology made simple. Workers with no smartphone experience can use Workverra in minutes.' },
  { icon: '⚡', title: 'Speed',            desc: 'From search to booking to payment — the entire hiring process takes under 5 minutes on Workverra.' },
  { icon: '🔒', title: 'Safety',           desc: 'Escrow payments, OTP verification, and admin-reviewed badges keep both sides of every transaction safe.' },
  { icon: '🌱', title: 'Empowerment',      desc: 'We don\'t just connect workers to jobs — we help them build a digital reputation that grows over time.' },
]

const AboutPage = () => (
  <div className={styles.page}>
    <div className={styles.hero}>
      <div className={styles.heroInner}>
        <span className={styles.badge}>About Workverra</span>
        <h1 className={styles.heroTitle}>
          Connecting India's skilled workforce<br />
          <span>one verified booking at a time</span>
        </h1>
        <p className={styles.heroSub}>
          Workverra is India's leading hyperlocal talent marketplace, built to give skilled workers in
          Tier 2 and Tier 3 cities a digital platform to find work, build reputation, and earn more —
          while helping employers hire trusted, verified professionals without hassle.
        </p>
        <div className={styles.heroCta}>
          <Link to="/search" className={styles.ctaBtn}>Browse Workers</Link>
          <Link to="/register" className={`${styles.ctaBtn} ${styles.ctaBtnOutline}`}>Join as Worker</Link>
        </div>
      </div>
    </div>

    <div className={styles.statsBar}>
      {STATS.map(s => (
        <div key={s.label} className={styles.statItem}>
          <div className={styles.statNum}>{s.num}</div>
          <div className={styles.statLabel}>{s.label}</div>
        </div>
      ))}
    </div>

    <div className={styles.section}>
      <div className={styles.sectionInner}>
        <div className={styles.missionGrid}>
          <div className={styles.missionLeft}>
            <span className={styles.sectionTag}>Our Mission</span>
            <h2 className={styles.sectionTitle}>Democratising work opportunities across India</h2>
            <p className={styles.sectionText}>
              India has over 450 million skilled workers — electricians, plumbers, carpenters,
              cooks, painters — yet most of them rely on word-of-mouth to find work. Meanwhile,
              employers waste hours calling around to find someone reliable.
            </p>
            <p className={styles.sectionText}>
              {/* FIX #9: Founded 2026 */}
              Workverra was founded in 2026 to fix this. We built a platform that lets workers
              create a verified digital identity, receive bookings, get paid securely, and build
              a reputation that follows them — and lets employers find, hire, and pay trusted
              professionals in under 5 minutes.
            </p>
            <p className={styles.sectionText}>
              We're starting in Madhya Pradesh and Chhattisgarh, and expanding across India's
              200+ Tier 2 and Tier 3 cities where the real opportunity lies.
            </p>
          </div>
          <div className={styles.missionRight}>
            <div className={styles.missionCard}>
              <div className={styles.missionIcon}>🎯</div>
              <h3>The Problem We Solve</h3>
              <ul className={styles.missionList}>
                <li>Workers have skills but no digital presence</li>
                <li>Employers waste time finding reliable help</li>
                <li>Cash payments with no accountability</li>
                <li>No way to verify worker quality beforehand</li>
                <li>No protection if work is incomplete</li>
              </ul>
            </div>
            <div className={`${styles.missionCard} ${styles.missionCardBlue}`}>
              <div className={styles.missionIcon}>✅</div>
              <h3>The Workverra Solution</h3>
              <ul className={styles.missionList}>
                <li>Verified profiles with ratings and reviews</li>
                <li>Search by skill, city, rating, availability</li>
                <li>Secure escrow payments via Razorpay</li>
                <li>Real-time booking and notifications</li>
                <li>Admin-verified badges for trusted workers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className={`${styles.section} ${styles.sectionGray}`}>
      <div className={styles.sectionInner}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <span className={styles.sectionTag}>Our Values</span>
          <h2 className={styles.sectionTitle}>What we stand for</h2>
        </div>
        <div className={styles.valuesGrid}>
          {VALUES.map(v => (
            <div key={v.title} className={styles.valueCard}>
              <div className={styles.valueIcon}>{v.icon}</div>
              <h3 className={styles.valueTitle}>{v.title}</h3>
              <p className={styles.valueDesc}>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className={styles.section}>
      <div className={styles.sectionInner}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <span className={styles.sectionTag}>The Team</span>
          <h2 className={styles.sectionTitle}>Built by people who care</h2>
        </div>
        <div className={styles.teamGrid}>
          {TEAM.map(t => (
            <div key={t.name} className={styles.teamCard}>
              <div className={styles.teamAvatar} style={{ background: t.gradient }}>{t.avatar}</div>
              <div className={styles.teamName}>{t.name}</div>
              <div className={styles.teamRole}>{t.role}</div>
              <p className={styles.teamBio}>{t.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className={styles.cta}>
      <div className={styles.ctaInner}>
        <h2 className={styles.ctaTitle}>Ready to get started?</h2>
        <p className={styles.ctaSub}>Join thousands of workers and employers building a better local economy.</p>
        <div className={styles.ctaActions}>
          <Link to="/register?role=employer" className={styles.ctaBtn}>Post a Job Free →</Link>
          <Link to="/register?role=worker"   className={`${styles.ctaBtn} ${styles.ctaBtnOutline}`}>Register as Worker →</Link>
        </div>
        {/* FIX #6: correct email */}
        <p className={styles.ctaContact}>
          Questions? <Link to="/contact" style={{ color:'#93c5fd', fontWeight:600 }}>Contact us</Link> or email{' '}
          <a href="mailto:team.workverra@gmail.com" style={{ color:'#93c5fd', fontWeight:600 }}>team.workverra@gmail.com</a>
        </p>
      </div>
    </div>
  </div>
)

export default AboutPage
