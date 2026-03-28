import { useNavigate } from 'react-router-dom'
import styles from './WorkerCards.module.css'

const workers = [
  { initials: 'MK', gradient: 'linear-gradient(135deg,#667eea,#764ba2)', name: 'Mohan Kumar', role: 'Plumber · 6 yrs exp', city: 'Indore, MP', distance: '0.8 km', stars: 5, reviews: 89, rate: '₹380', skills: ['Pipe Fitting','Leakage Fix','Bathroom Setup'], featured: false },
  { initials: 'PS', gradient: 'linear-gradient(135deg,#f093fb,#f5576c)', name: 'Priya Sharma', role: 'Interior Painter · 8 yrs exp', city: 'Bhopal, MP', distance: '1.5 km', stars: 5, reviews: 134, rate: '₹520', skills: ['Wall Painting','Texture Work','Waterproofing'], featured: true, badge: 'Top Rated Pro' },
  { initials: 'AV', gradient: 'linear-gradient(135deg,#4facfe,#00f2fe)', name: 'Amit Verma', role: 'Carpenter · 4 yrs exp', city: 'Jabalpur, MP', distance: '2.1 km', stars: 4, reviews: 56, rate: '₹290', skills: ['Furniture','Door Fitting','Modular'], featured: false },
]

const WorkerCards = () => {
  const navigate = useNavigate()
  return (
    <section id="workers" className={styles.section}>
      <div className={styles.sectionInner}>
        <span className={styles.sectionTag}>Browse talent</span>
        <h2 className={styles.sectionTitle}>Top workers near you</h2>
        <p className={styles.sectionSub}>All workers are verified, rated, and ready to work.</p>
        <div className={styles.workersGrid}>
          {workers.map((w) => (
            <div key={w.name} className={`${styles.workerCard} ${w.featured ? styles.featured : ''}`} onClick={() => navigate('/search')}>
              <div className={styles.cardTop}>
                <div className={styles.workerAvatar} style={{ background: w.gradient }}>{w.initials}</div>
                <div className={styles.workerRate}>{w.rate}<span>/hr</span></div>
              </div>
              <div className={styles.workerName}>{w.name}</div>
              <div className={styles.workerRole}>{w.role}</div>
              <div className={styles.workerLoc}>📍 {w.city} · {w.distance}</div>
              <div className={styles.ratingRow}>
                <span className={styles.stars}>{'★'.repeat(w.stars)}{'☆'.repeat(5 - w.stars)}</span>
                <span className={styles.reviewCount}>({w.reviews} reviews)</span>
              </div>
              {w.badge && <div className={styles.verifiedBadge}>✓ {w.badge}</div>}
              <div className={styles.divider}></div>
              <div className={styles.workerSkills}>
                {w.skills.map((s) => <span key={s} className={styles.skillTag}>{s}</span>)}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.browseAll}>
          <button className={styles.btnGhost} onClick={() => navigate('/search')}>Browse All Workers →</button>
        </div>
      </div>
    </section>
  )
}

export default WorkerCards