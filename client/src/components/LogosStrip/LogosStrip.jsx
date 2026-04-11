import styles from './LogosStrip.module.css'

const PARTNERS = [
  { icon: '🏗️', name: 'InfraCore',    type: 'Construction' },
  { icon: '🔨', name: 'BuildRight',   type: 'Home Renovation' },
  { icon: '⚡', name: 'QuickFix',     type: 'Repairs & Maintenance' },
  { icon: '🏠', name: 'HomePro',      type: 'Property Management' },
  { icon: '🌆', name: 'CityWorks',    type: 'Urban Infrastructure' },
  { icon: '🛠️', name: 'SkillBuild',   type: 'Skilled Trades' },
]

const LogosStrip = () => (
  <div className={styles.strip}>
    <div className={styles.stripInner}>
      <p className={styles.label}>
        <span className={styles.line}></span>
        Trusted by 500+ employers across India
        <span className={styles.line}></span>
      </p>
      <div className={styles.logosRow}>
        {PARTNERS.map((p) => (
          <div key={p.name} className={styles.logoCard}>
            <span className={styles.logoIcon}>{p.icon}</span>
            <div className={styles.logoInfo}>
              <div className={styles.logoName}>{p.name}</div>
              <div className={styles.logoType}>{p.type}</div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.stripNote}>
        <span>⭐ 4.8/5 average employer rating</span>
        <span>·</span>
        <span>10,000+ successful bookings</span>
        <span>·</span>
        <span>₹1.2Cr+ payments processed</span>
      </div>
    </div>
  </div>
)

export default LogosStrip
