import { Link } from 'react-router-dom'
import styles from './HowItWorksPage.module.css'

const EMPLOYER_STEPS = [
  { num: '01', icon: '🔍', title: 'Search by Skill & Location', desc: 'Enter your city and the skill you need. Filter by rating, availability, and hourly rate. See verified workers near you.' },
  { num: '02', icon: '📋', title: 'Send a Booking Request', desc: 'Select a date, time, and duration. Describe the job clearly and send your request. Workers respond within minutes.' },
  { num: '03', icon: '✅', title: 'Worker Accepts', desc: 'The worker reviews your request and accepts it. You get an instant notification confirming the booking.' },
  { num: '04', icon: '💳', title: 'Pay via UPI (Escrow)', desc: 'Pay securely through Razorpay. Funds are held in escrow and only released after you confirm the job is done.' },
  { num: '05', icon: '⭐', title: 'Rate & Review', desc: 'After completion, leave a review. Your feedback helps other employers and rewards great workers.' },
]

const WORKER_STEPS = [
  { num: '01', icon: '📱', title: 'Register with OTP', desc: 'Sign up with your mobile number. Verify with OTP. Create your profile with your skills, experience, and hourly rate.' },
  { num: '02', icon: '🛡️', title: 'Get Verified', desc: 'Our team reviews your profile. Verified workers get a badge that increases bookings by up to 3x.' },
  { num: '03', icon: '🔔', title: 'Receive Booking Requests', desc: 'Employers near you send booking requests. Accept or decline based on your availability — all in real-time.' },
  { num: '04', icon: '🔨', title: 'Complete the Job', desc: 'Show up, do great work. The employer reviews and confirms completion.' },
  { num: '05', icon: '💰', title: 'Get Paid Instantly', desc: 'Once the employer confirms, payment is released to you immediately via UPI. No delays, no middlemen.' },
]

const FAQS = [
  { q: 'Is Workverra free to join?', a: 'Yes — creating an account and posting a job is completely free for employers. Workers join free and start receiving bookings immediately after verification.' },
  { q: 'How does the escrow payment work?', a: 'When you book a worker, you pay upfront via UPI. The money is held securely and only released to the worker after you confirm the job is complete. If a job is cancelled before it starts, you get a full refund.' },
  { q: 'How are workers verified?', a: 'Every worker verifies their phone via OTP. Workers who complete additional checks — identity document, skill demonstration — receive a blue Verified badge on their profile.' },
  { q: 'What if I\'m not happy with the work?', a: 'Don\'t confirm completion until you\'re satisfied. Contact our support team at team.workverra@gmail.com and we\'ll help mediate and arrange a resolution.' },
  { q: 'Which cities does Workverra cover?', a: 'We\'re live in 200+ cities across Madhya Pradesh, Rajasthan, Uttar Pradesh, Gujarat, and now expanding to South India. Check the search page to find workers near you.' },
]

const HowItWorksPage = () => (
  <div className={styles.page}>
    {/* Header */}
    <div className={styles.hero}>
      <div className={styles.heroInner}>
        <span className={styles.badge}>How Workverra Works</span>
        <h1 className={styles.title}>From search to payment — in under 5 minutes</h1>
        <p className={styles.sub}>Whether you're hiring or looking for work, Workverra makes it simple, safe, and fast.</p>
        <div className={styles.heroCta}>
          <Link to="/search" className={styles.ctaBtn}>Find Workers →</Link>
          <Link to="/register?role=worker" className={`${styles.ctaBtn} ${styles.ctaBtnOutline}`}>Join as Worker →</Link>
        </div>
      </div>
    </div>

    {/* For Employers */}
    <div className={styles.section}>
      <div className={styles.sectionInner}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionTag}>For Employers</span>
          <h2 className={styles.sectionTitle}>Hire a worker in 5 steps</h2>
        </div>
        <div className={styles.stepsGrid}>
          {EMPLOYER_STEPS.map((s, i) => (
            <div key={s.num} className={styles.stepCard}>
              <div className={styles.stepTop}>
                <div className={styles.stepIcon}>{s.icon}</div>
                <div className={styles.stepNum}>{s.num}</div>
              </div>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.stepDesc}>{s.desc}</p>
              {i < EMPLOYER_STEPS.length - 1 && <div className={styles.stepArrow}>↓</div>}
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* For Workers */}
    <div className={`${styles.section} ${styles.sectionBlue}`}>
      <div className={styles.sectionInner}>
        <div className={styles.sectionHead}>
          <span className={`${styles.sectionTag} ${styles.sectionTagWhite}`}>For Workers</span>
          <h2 className={`${styles.sectionTitle} ${styles.sectionTitleWhite}`}>Start earning in 5 steps</h2>
        </div>
        <div className={styles.stepsGrid}>
          {WORKER_STEPS.map((s, i) => (
            <div key={s.num} className={`${styles.stepCard} ${styles.stepCardDark}`}>
              <div className={styles.stepTop}>
                <div className={styles.stepIcon}>{s.icon}</div>
                <div className={`${styles.stepNum} ${styles.stepNumLight}`}>{s.num}</div>
              </div>
              <h3 className={`${styles.stepTitle} ${styles.stepTitleLight}`}>{s.title}</h3>
              <p className={`${styles.stepDesc} ${styles.stepDescLight}`}>{s.desc}</p>
              {i < WORKER_STEPS.length - 1 && <div className={`${styles.stepArrow} ${styles.stepArrowLight}`}>↓</div>}
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* FAQ */}
    <div className={styles.section}>
      <div className={styles.sectionInner}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span className={styles.sectionTag}>FAQ</span>
          <h2 className={styles.sectionTitle}>Common questions</h2>
        </div>
        <div className={styles.faqList}>
          {FAQS.map(f => (
            <details key={f.q} className={styles.faqItem}>
              <summary className={styles.faqQ}>{f.q}</summary>
              <p className={styles.faqA}>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>

    {/* CTA */}
    <div className={styles.ctaSection}>
      <div className={styles.ctaInner}>
        <h2>Ready to get started?</h2>
        <p>Join thousands of workers and employers across India.</p>
        <div className={styles.ctaBtns}>
          <Link to="/register?role=employer" className={styles.ctaBtn}>Post a Job Free →</Link>
          <Link to="/register?role=worker"   className={`${styles.ctaBtn} ${styles.ctaBtnOutline}`}>Register as Worker →</Link>
        </div>
      </div>
    </div>
  </div>
)

export default HowItWorksPage
