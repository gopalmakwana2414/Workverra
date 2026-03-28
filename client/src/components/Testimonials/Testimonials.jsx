import styles from './Testimonials.module.css'

const testimonials = [
  { quote: 'Found a certified electrician in under 20 minutes. Payment was smooth via PhonePe. The worker showed his Workverra badge — I felt safe.', name: 'Sunita Rawat', role: 'Homeowner · Bhopal', initials: 'SR', color: '#667eea', stars: 5 },
  { quote: 'As a plumber, I used to rely on word-of-mouth. Since joining Workverra, I get 6–8 bookings a week. The app is simple, even for me.', name: 'Deepak Kaushik', role: 'Plumber · Indore', initials: 'DK', color: '#f093fb', stars: 5 },
  { quote: 'We hired 4 painters for our office renovation. The escrow payment feature gave us confidence. No upfront cash risk. Excellent platform.', name: 'Ankit Jain', role: 'Business Owner · Gwalior', initials: 'AJ', color: '#43e97b', stars: 5 },
]

const Testimonials = () => (
  <section className={styles.section}>
    <div className={styles.sectionInner}>
      <span className={styles.sectionTag}>What people say</span>
      <h2 className={styles.sectionTitle}>Real stories, real impact</h2>
      <div className={styles.tGrid}>
        {testimonials.map((t) => (
          <div key={t.name} className={styles.tCard}>
            <p className={styles.tQuote}>{t.quote}</p>
            <div className={styles.tAuthor}>
              <div className={styles.tAvatar} style={{ background: t.color }}>{t.initials}</div>
              <div>
                <div className={styles.tName}>{t.name}</div>
                <div className={styles.tRole}>{t.role}</div>
                <div className={styles.tStars}>{'★'.repeat(t.stars)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default Testimonials