import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './FAQPage.module.css'

const FAQS = [
  {
    category: 'Registration',
    icon: '📝',
    items: [
      { q: 'How do I register on Workverra?', a: 'Click "Register" on the homepage. Choose your role — Employer or Worker. Fill in your name, mobile number, and city. Verify your phone with an OTP. Your profile is ready in under 2 minutes.' },
      { q: 'Can I register both as a worker and employer?', a: 'You need separate accounts for each role. Each account is tied to a unique mobile number. We recommend keeping roles separate for a better experience.' },
      { q: 'What documents are needed to register?', a: 'No documents are required to register. A valid Indian mobile number is enough to start. Workers who want a verified badge can optionally submit Aadhaar or other ID proof later.' },
      { q: 'Why is OTP verification required?', a: 'OTP verification ensures every account belongs to a real person with a valid phone number. This prevents fake accounts and builds trust between workers and employers on the platform.' },
      { q: 'I did not receive the OTP on my phone. What should I do?', a: 'Check that your number has mobile signal and is not in DND mode. Wait 30 seconds and click "Resend OTP". If the issue continues, try a different network or call our support team at +91 8959465264.' },
    ],
  },
  {
    category: 'Hiring Workers',
    icon: '🤝',
    items: [
      { q: 'How do I find workers near me?', a: 'Go to "Search" and enter the skill you need (e.g., Plumber, Electrician) and your city. Use filters to narrow by rating, availability, and price. Browse profiles and send a booking request.' },
      { q: 'Are all workers on Workverra verified?', a: 'All workers complete phone verification. Workers with a blue "Verified" badge have additionally submitted identity proof reviewed by our admin team. We recommend hiring verified workers for added safety.' },
      { q: 'Can I see a worker\'s reviews and ratings before booking?', a: 'Yes. Every worker\'s profile shows their average star rating, total number of reviews, completed jobs, and individual reviews from previous employers. This helps you make an informed hiring decision.' },
      { q: 'What if I am not satisfied with the worker\'s performance?', a: 'Do not release payment until you are satisfied. If the work was clearly substandard, contact us at support@workverra.in within 24 hours of job completion. We will review the case and mediate a resolution.' },
      { q: 'Can I hire the same worker again?', a: 'Absolutely! You can directly visit their profile and send a new booking request anytime. If you are satisfied with a worker, we encourage you to leave a review — it helps other employers too.' },
    ],
  },
  {
    category: 'Payments',
    icon: '💳',
    items: [
      { q: 'Is it safe to pay on Workverra?', a: 'Yes. All payments are processed through Razorpay, India\'s most trusted payment gateway, which is PCI-DSS compliant. Workverra never stores your card or UPI credentials.' },
      { q: 'What is the escrow system and how does it protect me?', a: 'When you pay for a booking, money is held in secure escrow — meaning the worker does not receive it yet. Once you confirm the job is done satisfactorily, you release the payment. This protects you from paying for incomplete or poor work.' },
      { q: 'What payment methods are accepted?', a: 'We accept all major UPI apps (PhonePe, Google Pay, Paytm, BHIM), debit and credit cards (Visa, Mastercard, RuPay), and net banking from all major Indian banks.' },
      { q: 'Can I get a refund if the worker cancels?', a: 'Yes. If a worker cancels an accepted booking or fails to show up, you are eligible for a full refund of escrow funds. Refunds are processed within 5-7 working days to your original payment method.' },
      { q: 'How does the worker receive their payment?', a: 'After you release payment from escrow, funds are transferred to the worker\'s registered bank account via Razorpay Payout within 2-3 working days. Workers need to add their bank details in their dashboard.' },
    ],
  },
  {
    category: 'Subscription',
    icon: '⭐',
    items: [
      { q: 'Do I need a paid subscription to use Workverra?', a: 'No. Both workers and employers can use basic features for free. Free accounts have monthly limits: workers get up to 5 bookings, employers can post up to 2 jobs per month.' },
      { q: 'What are the subscription plans and prices?', a: 'Worker plans: Monthly ₹49/month or Yearly ₹499/year (save 15%). Employer plans: Monthly ₹99/month or Yearly ₹999/year (save 15%). All paid plans include unlimited bookings/jobs, verified badge eligibility, priority search listing, and chat support.' },
      { q: 'How do I upgrade to a paid plan?', a: 'Go to your Dashboard → Subscription. Choose a plan that fits your needs and complete payment via Razorpay. Your features are activated instantly after payment confirmation.' },
      { q: 'Can I cancel my subscription anytime?', a: 'Yes, you can cancel anytime from your Dashboard → Subscription → Cancel Plan. Your paid features remain active until the end of your current billing period. No refunds are issued for the remaining period.' },
      { q: 'Will I be auto-charged every month?', a: 'Yes, subscriptions auto-renew on your billing date. You will receive an SMS reminder 3 days before renewal. You can turn off auto-renewal anytime from your Dashboard → Subscription → Manage.' },
    ],
  },
  {
    category: 'Safety & Trust',
    icon: '🛡️',
    items: [
      { q: 'How does Workverra ensure worker quality?', a: 'Workers are phone-verified and rated after every job. Our rating and review system ensures low-quality workers move down in search results. Workers who receive repeated complaints may be suspended.' },
      { q: 'What should I do if I face misconduct from a worker?', a: 'Immediately contact us at support@workverra.in or call +91 8959465264. Do not release payment. We take misconduct seriously and will investigate within 24 hours. If verified, the worker will be permanently banned.' },
      { q: 'Is my personal information safe?', a: 'Your personal data is encrypted in transit and at rest. We never sell your data to third parties. We only share your contact information with the worker/employer you are actively booking with. See our Privacy Policy for full details.' },
      { q: 'How are disputes between workers and employers resolved?', a: 'Both parties should first attempt to resolve the issue directly. If unresolved, email support@workverra.in with details. Our team reviews evidence from both sides and issues a binding decision within 7 business days.' },
    ],
  },
]

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState(0)
  const [openItem, setOpenItem]             = useState(null)
  const [search, setSearch]                 = useState('')

  const toggle = (id) => setOpenItem(prev => prev === id ? null : id)

  const filtered = search
    ? FAQS.map(cat => ({
        ...cat,
        items: cat.items.filter(i =>
          i.q.toLowerCase().includes(search.toLowerCase()) ||
          i.a.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter(cat => cat.items.length > 0)
    : [FAQS[activeCategory]]

  const totalFaqs = FAQS.reduce((sum, cat) => sum + cat.items.length, 0)

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <span className={styles.badge}>FAQ</span>
          <h1 className={styles.title}>Frequently Asked Questions</h1>
          <p className={styles.sub}>
            {totalFaqs} answers to the most common questions about Workverra.
          </p>
          <div className={styles.searchWrap}>
            <span>🔍</span>
            <input
              className={styles.searchInput}
              placeholder="Search questions… e.g. refund, OTP, subscription"
              value={search}
              onChange={e => { setSearch(e.target.value); setActiveCategory(0) }}
            />
            {search && <button className={styles.clearBtn} onClick={() => setSearch('')}>✕</button>}
          </div>
        </div>
      </div>

      {/* Category tabs */}
      {!search && (
        <div className={styles.tabRow}>
          {FAQS.map((cat, i) => (
            <button
              key={cat.category}
              className={`${styles.tab} ${activeCategory === i ? styles.tabActive : ''}`}
              onClick={() => { setActiveCategory(i); setOpenItem(null) }}
            >
              {cat.icon} {cat.category}
              <span className={styles.tabCount}>{cat.items.length}</span>
            </button>
          ))}
        </div>
      )}

      {/* FAQ content */}
      <div className={styles.body}>
        {filtered.length === 0 ? (
          <div className={styles.noResults}>
            <div>🤷</div>
            <h3>No results for "{search}"</h3>
            <p>Try different keywords or <Link to="/contact" className={styles.contactLink}>contact our support team</Link>.</p>
          </div>
        ) : (
          filtered.map(cat => (
            <div key={cat.category} className={styles.catBlock}>
              {search && (
                <div className={styles.catLabel}>{cat.icon} {cat.category}</div>
              )}
              {cat.items.map((item, j) => {
                const id = `${cat.category}-${j}`
                const isOpen = openItem === id
                return (
                  <div key={id} className={`${styles.faqItem} ${isOpen ? styles.faqOpen : ''}`}>
                    <button className={styles.faqQ} onClick={() => toggle(id)}>
                      <span className={styles.qNum}>{j + 1}</span>
                      <span className={styles.qText}>{item.q}</span>
                      <span className={styles.icon}>{isOpen ? '−' : '+'}</span>
                    </button>
                    {isOpen && (
                      <div className={styles.faqA}>
                        <p>{item.a}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))
        )}
      </div>

      {/* CTA */}
      <div className={styles.cta}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Didn't find your answer?</h2>
          <p className={styles.ctaSub}>Our support team is available Mon–Sat, 9 AM – 7 PM.</p>
          <div className={styles.ctaActions}>
            <Link to="/contact" className={styles.ctaBtn}>📩 Contact Us</Link>
            <Link to="/help"    className={`${styles.ctaBtn} ${styles.ctaBtnGhost}`}>📚 Help Centre</Link>
            <a href="tel:+918959465264" className={`${styles.ctaBtn} ${styles.ctaBtnGhost}`}>📞 Call Support</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQPage
