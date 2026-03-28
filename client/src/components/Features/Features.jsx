import styles from './Features.module.css'

const features = [
  { icon: '🔐', iconBg: '#EBF2FF', title: 'OTP-Based Verification', desc: 'Workers verify identity via mobile OTP. No fake profiles. Every account is tied to a real phone number.' },
  { icon: '📍', iconBg: '#D1FAE5', title: 'Hyperlocal Matching', desc: 'GPS-powered search shows workers within your city or neighbourhood. Distance shown on every profile.' },
  { icon: '💳', iconBg: '#FFF8E7', title: 'Razorpay UPI Payments', desc: 'Pay with any UPI app. Payments held in escrow and released only after job completion.' },
  { icon: '⭐', iconBg: '#FEF2F2', title: 'Rating & Review System', desc: 'Both workers and employers leave reviews after every job. Quality workers rise to the top.' },
  { icon: '🔔', iconBg: '#F5F3FF', title: 'Real-Time Notifications', desc: 'Socket.io-powered live updates for booking requests, acceptances, and payment status.' },
  { icon: '🛡️', iconBg: '#ECFDF5', title: 'Admin Verification Badge', desc: 'Workers who pass additional checks get a verified badge. Employers can filter verified-only workers.' },
]

const Features = () => {
  return (
    <section id="features" className={styles.featuresWrap}>
      <div className={styles.featuresInner}>
        <span className={styles.sectionTag}>Platform features</span>
        <h2 className={styles.sectionTitle}>Everything you need. Nothing you don't.</h2>
        <p className={styles.sectionSub}>Built for Tier 2 &amp; 3 India — fast, lightweight, works on any smartphone.</p>
        <div className={styles.featuresGrid}>
          {features.map((feat) => (
            <div key={feat.title} className={styles.featCard}>
              <div className={styles.featIcon} style={{ background: feat.iconBg }}>{feat.icon}</div>
              <h3 className={styles.featTitle}>{feat.title}</h3>
              <p className={styles.featDesc}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features