import styles from './Stats.module.css'

const stats = [
  { number: '2,400+', label: 'Verified Workers' },
  { number: '140+', label: 'Cities Covered' },
  { number: '₹1.2Cr+', label: 'Payments Processed' },
  { number: '4.8★', label: 'Average Rating' },
]

const Stats = () => (
  <section className={styles.statsSection}>
    <div className={styles.statsInner}>
      {stats.map((s) => (
        <div key={s.label} className={styles.statItem}>
          <span className={styles.number}>{s.number}</span>
          <div className={styles.label}>{s.label}</div>
        </div>
      ))}
    </div>
  </section>
)

export default Stats