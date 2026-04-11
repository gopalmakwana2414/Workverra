import { Link } from 'react-router-dom'
import styles from './HowItWorks.module.css'

const steps = [
  {
    num: '1',
    icon: '🔍',
    title: 'Search by Skill & Location',
    desc: 'Enter your city and the skill you need. Filter by rating, availability, and hourly rate. See verified workers near you.',
  },
  {
    num: '2',
    icon: '📋',
    title: 'Send a Booking Request',
    desc: 'Select a date and time, describe the job, and send your request. Workers accept or decline in real-time.',
  },
  {
    num: '3',
    icon: '💳',
    title: 'Pay Securely via UPI',
    desc: 'Pay through Razorpay escrow. Funds are held safely and released to the worker only after you confirm completion.',
  },
]

const HowItWorks = () => {
  return (
    <section id="how-it-works" className={styles.section}>
      <div className={styles.sectionInner}>
        <span className={styles.sectionTag}>How it works</span>
        <h2 className={styles.sectionTitle}>Hire in 3 simple steps</h2>
        <p className={styles.sectionSub}>
          From search to payment — Workverra makes local hiring effortless. Get
          the right person on-site in hours, not days.
        </p>
        <div className={styles.stepsGrid}>
          {steps.map((step, i) => (
            <div key={step.num} className={styles.stepCard}>
              <div className={styles.stepTop}>
                <div className={styles.stepIcon}>{step.icon}</div>
                <div className={styles.stepNum}>{step.num}</div>
              </div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
              {i < steps.length - 1 && <div className={styles.stepArrow}>→</div>}
            </div>
          ))}
        </div>
        {/* FIX #8: link to full How It Works page */}
        <div className={styles.learnMore}>
          <Link to="/how-it-works" className={styles.learnMoreBtn}>
            Learn more about how it works →
          </Link>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
