import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './HelpPage.module.css'

const CATEGORIES = [
  {
    icon: '🚀',
    title: 'Getting Started',
    articles: [
      { q: 'How do I create an account on Workverra?', a: 'Click "Register" on the homepage. Choose your role (Employer or Worker), fill in your details, and verify your mobile number via OTP. Your account will be ready in under 2 minutes.' },
      { q: 'What is the difference between a Worker and Employer account?', a: 'A Worker account lets you create a profile, list your skills, and receive booking requests from employers. An Employer account lets you search for workers, post jobs, and manage bookings.' },
      { q: 'Is Workverra free to use?', a: 'Yes! Basic accounts are free. Workers get up to 5 bookings/month and employers can post up to 2 jobs/month for free. Paid plans unlock unlimited features starting at ₹49/month.' },
      { q: 'Which cities is Workverra available in?', a: 'Workverra is currently available in 200+ Tier 2 and Tier 3 cities across India, including Indore, Bhopal, Nagpur, Raipur, Jaipur, Lucknow, and many more. We expand to new cities every month.' },
    ],
  },
  {
    icon: '🔐',
    title: 'Login & OTP',
    articles: [
      { q: 'I didn\'t receive my OTP. What should I do?', a: 'Wait 30 seconds and press "Resend OTP". Check that you entered the correct 10-digit mobile number. Make sure your phone is not in DND (Do Not Disturb) mode. If the issue persists, call us at +91 8959465264.' },
      { q: 'My OTP expired. How do I get a new one?', a: 'OTPs are valid for 10 minutes. If yours expired, click "Resend OTP" to receive a fresh one. You can request a new OTP after the 30-second cooldown timer.' },
      { q: 'I forgot which phone number I registered with.', a: 'Try the number you most commonly use. If you still cannot log in, contact our support team at support@workverra.in or call +91 8959465264 with your full name and city to recover your account.' },
      { q: 'Can I log in using Google?', a: 'Yes! On the Login page, click "Continue with Google" to sign in with your Google account. This is the fastest way to log in without needing an OTP.' },
    ],
  },
  {
    icon: '📋',
    title: 'Bookings',
    articles: [
      { q: 'How do I book a worker?', a: 'Search for workers by skill and city. Click on a worker\'s profile, then click "Book Now". Select the date, time, duration, and describe the work needed. Submit the request — the worker will accept or decline within a few hours.' },
      { q: 'How do I accept or reject a booking as a worker?', a: 'Go to your Worker Dashboard → My Jobs tab. You will see pending booking requests. Click "Accept" or "Decline" for each request. Employers are notified in real-time of your response.' },
      { q: 'Can I cancel a booking?', a: 'Employers can cancel a booking before the worker accepts it. After acceptance, contact the worker directly via chat or call our support team. Cancellation after payment may be subject to refund policy.' },
      { q: 'What happens if a worker doesn\'t show up?', a: 'If a verified worker fails to show up, contact us within 2 hours at support@workverra.in. We will escalate the issue, investigate, and issue a full refund of any payment held in escrow.' },
    ],
  },
  {
    icon: '💳',
    title: 'Payments',
    articles: [
      { q: 'How does the escrow payment system work?', a: 'When you pay for a booking, funds are held securely in escrow by Workverra via Razorpay. The worker receives payment ONLY after you confirm the job is complete. This protects both parties.' },
      { q: 'Which payment methods are accepted?', a: 'We accept all UPI apps (PhonePe, GPay, Paytm, BHIM), debit/credit cards (Visa, Mastercard, RuPay), and net banking — all securely processed through Razorpay.' },
      { q: 'How do I release payment to the worker?', a: 'After the job is completed, go to your Employer Dashboard → Bookings. Find the booking and click "Release Payment". Funds will be transferred to the worker\'s account within 2-3 business days.' },
      { q: 'What is the refund policy?', a: 'Payments in escrow can be refunded if: (1) the booking is cancelled before acceptance, (2) the worker fails to show up. Subscription fees are non-refundable once the billing period starts. Refunds are processed in 5-7 business days.' },
    ],
  },
  {
    icon: '👤',
    title: 'Profile & Settings',
    articles: [
      { q: 'How do I update my worker profile?', a: 'Go to your Worker Dashboard → Edit Profile. You can update your skills, hourly rate, bio, and profile photo. Changes are reflected immediately to employers searching for workers.' },
      { q: 'How do I get a verified badge?', a: 'To get verified: (1) Complete your profile 100%, (2) Complete at least 5 bookings with a 4-star rating, (3) Submit your ID proof via the dashboard. Admin verification takes 2-3 working days.' },
      { q: 'Can I change my registered mobile number?', a: 'For security reasons, changing your registered mobile number requires identity verification. Contact us at support@workverra.in with your name, current number, and a valid ID proof.' },
      { q: 'How do I delete my account?', a: 'Go to your Dashboard → Settings → Delete Account. Note: Deleting your account is permanent and will remove all your bookings, reviews, and payment history. Active bookings must be completed before deletion.' },
    ],
  },
]

const HelpPage = () => {
  const [active, setActive]   = useState(0)
  const [openQ,  setOpenQ]    = useState(null)
  const [search, setSearch]   = useState('')

  const filtered = CATEGORIES.map(cat => ({
    ...cat,
    articles: cat.articles.filter(a =>
      !search ||
      a.q.toLowerCase().includes(search.toLowerCase()) ||
      a.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => !search || cat.articles.length > 0)

  const toggleQ = (id) => setOpenQ(prev => prev === id ? null : id)

  return (
    <div className={styles.page}>
      {/* Header with search */}
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <span className={styles.badge}>Help Centre</span>
          <h1 className={styles.title}>How can we help you?</h1>
          <p className={styles.sub}>Search our knowledge base or browse by category below.</p>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              className={styles.searchInput}
              placeholder="Search help articles… e.g. OTP, payment, booking"
              value={search}
              onChange={e => { setSearch(e.target.value); setActive(0) }}
            />
            {search && (
              <button className={styles.clearSearch} onClick={() => setSearch('')}>✕</button>
            )}
          </div>
        </div>
      </div>

      {/* Category pills */}
      {!search && (
        <div className={styles.catRow}>
          {CATEGORIES.map((c, i) => (
            <button
              key={c.title}
              className={`${styles.catPill} ${active === i ? styles.catActive : ''}`}
              onClick={() => setActive(i)}
            >
              {c.icon} {c.title}
            </button>
          ))}
        </div>
      )}

      <div className={styles.body}>
        {/* Sidebar — desktop only */}
        {!search && (
          <nav className={styles.sidebar}>
            {CATEGORIES.map((c, i) => (
              <button
                key={c.title}
                className={`${styles.sideItem} ${active === i ? styles.sideActive : ''}`}
                onClick={() => setActive(i)}
              >
                <span>{c.icon}</span>
                {c.title}
                <span className={styles.articleCount}>{c.articles.length}</span>
              </button>
            ))}
            <div className={styles.sideContact}>
              <p>Can't find an answer?</p>
              <Link to="/contact" className={styles.contactLink}>Contact Support →</Link>
            </div>
          </nav>
        )}

        {/* Articles */}
        <div className={styles.articles}>
          {filtered.length === 0 ? (
            <div className={styles.noResults}>
              <div style={{ fontSize:'2.5rem', marginBottom:12 }}>🤷</div>
              <h3>No results for "{search}"</h3>
              <p>Try different keywords or <Link to="/contact" style={{ color:'#1A56DB', fontWeight:600 }}>contact us</Link>.</p>
            </div>
          ) : (
            (search ? filtered : [filtered[active] || filtered[0]]).map(cat => (
              <div key={cat.title} className={styles.catSection}>
                {search && <div className={styles.catHeader}>{cat.icon} {cat.title}</div>}
                {cat.articles.map((art, j) => {
                  const id = `${cat.title}-${j}`
                  return (
                    <div key={id} className={`${styles.article} ${openQ === id ? styles.articleOpen : ''}`}>
                      <button className={styles.question} onClick={() => toggleQ(id)}>
                        <span>{art.q}</span>
                        <span className={styles.chevron}>{openQ === id ? '▲' : '▼'}</span>
                      </button>
                      {openQ === id && (
                        <div className={styles.answer}>{art.a}</div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Still need help */}
      <div className={styles.stillHelp}>
        <div className={styles.stillHelpInner}>
          <h2 className={styles.stillTitle}>Still need help?</h2>
          <p className={styles.stillSub}>Our support team is ready to assist you.</p>
          <div className={styles.helpActions}>
            <Link to="/contact" className={styles.helpBtn}>📩 Send a Message</Link>
            <a href="tel:+918959465264" className={`${styles.helpBtn} ${styles.helpBtnOutline}`}>📞 Call +91 8959465264</a>
            <Link to="/faq" className={`${styles.helpBtn} ${styles.helpBtnOutline}`}>❓ View FAQs</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpPage
