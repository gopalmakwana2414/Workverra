import styles from './LogosStrip.module.css'

const logos = ['InfraCore', 'BuildRight', 'QuickFix Co.', 'HomePro', 'CityWorks']

const LogosStrip = () => (
  <div className={styles.strip}>
    <p className={styles.label}>Trusted by employers across India</p>
    <div className={styles.logosRow}>
      {logos.map((logo) => <div key={logo} className={styles.logoItem}>{logo}</div>)}
    </div>
  </div>
)

export default LogosStrip