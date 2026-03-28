import { useNavigate } from 'react-router-dom'
import styles from './CTA.module.css'

const CTA = () => {
  const navigate = useNavigate()
  return (
    <section className={styles.ctaSection}>
      <div className={styles.ctaInner}>
        <span className={styles.sectionTag}>Get started today</span>
        <h2 className={styles.ctaTitle}>India's most trusted hyperlocal talent platform</h2>
        <p className={styles.ctaSub}>Join thousands of workers and employers building a better local economy — one verified booking at a time.</p>
        <div className={styles.ctaBtns}>
          <button className={styles.btnPrimary} onClick={() => navigate('/register?role=employer')}>Post a Job for Free</button>
          <button className={styles.btnSecondary} onClick={() => navigate('/register?role=worker')}>Register as a Worker</button>
        </div>
      </div>
    </section>
  )
}

export default CTA