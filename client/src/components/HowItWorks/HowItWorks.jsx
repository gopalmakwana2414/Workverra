import styles from './HowItWorks.module.css'

const steps = [
  {
    num: '1',
    title: 'Search by Skill & Location',
    desc: 'Enter your city and the skill you need. Filter by rating, availability, and hourly rate. See verified workers near you on a map.',
  },
  {
    num: '2',
    title: 'Send a Booking Request',
    desc: 'Select a time slot and send a booking request. Workers accept or decline in real-time. You get an instant notification either way.',
  },
  {
    num: '3',
    title: 'Pay Securely via UPI',
    desc: 'Payment is released after job completion. Razorpay-powered UPI integration ensures your money is safe until the work is done.',
  },
]

const HowItWorks = () => {
  return (
    <section id="how-it-works" className={styles.section}>
      <div className={styles.sectionInner}>
        <span className={styles.sectionTag}>How it works</span>
        <h2 className={styles.sectionTitle}>Hire in 3 simple steps</h2>
        <p className={styles.sectionSub}>
          From search to booking — Workverra makes local hiring effortless.
        </p>
        <div className={styles.stepsGrid}>
          {steps.map((step, i) => (
            <div key={step.num} className={styles.stepCard}>
              <div className={styles.stepNum}>{step.num}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
              {i < steps.length - 1 && <div className={styles.stepArrow}>→</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks