import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './PolicyPage.module.css'

const sections = [
  {
    id: 'responsibilities',
    icon: '👤',
    title: 'User Responsibilities',
    content: [
      {
        heading: 'Account Accuracy',
        body: 'You agree to provide accurate, current, and complete information during registration. You are responsible for maintaining the confidentiality of your account credentials. Workverra is not liable for any loss resulting from unauthorized use of your account.'
      },
      {
        heading: 'Acceptable Use',
        body: 'You must not use the platform for any unlawful purpose, to post false or misleading information, to harass or harm other users, or to engage in fraudulent activity. Any misuse will result in immediate account suspension.'
      },
      {
        heading: 'Worker Responsibilities',
        body: 'Workers must accurately represent their skills, qualifications, and availability. Workers are solely responsible for the quality of their work. Workverra acts as a marketplace and does not guarantee job outcomes or disputes between workers and employers.'
      },
      {
        heading: 'Employer Responsibilities',
        body: 'Employers must provide clear job descriptions, agreed compensation, and a safe working environment. Employers must pay the agreed amount through the platform and must not attempt to bypass the payment system.'
      },
    ]
  },
  {
    id: 'payment',
    icon: '💳',
    title: 'Payment & Subscription Terms',
    content: [
      {
        heading: 'Free Tier',
        body: 'Both workers and employers can register once for free. Free accounts have limited features: Workers can receive up to 5 bookings/month. Employers can post up to 2 jobs/month. Free accounts do not include verified badges or priority listing.'
      },
      {
        heading: 'Paid Subscriptions',
        body: 'Worker Monthly: ₹49/month. Worker Yearly: ₹499/year. Employer Monthly: ₹99/month. Employer Yearly: ₹999/year. Subscriptions auto-renew unless cancelled before the renewal date. You can cancel anytime from your dashboard.'
      },
      {
        heading: 'Payment Processing',
        body: 'All payments are processed securely via Razorpay. Workverra does not store your card or UPI credentials. Transaction data is encrypted and handled under PCI-DSS compliance standards.'
      },
      {
        heading: 'Escrow System',
        body: 'When an employer pays for a booking, funds are held in escrow by Workverra. Funds are only released to the worker after the employer confirms job completion. In case of disputes, Workverra reserves the right to mediate and make a final decision.'
      },
      {
        heading: 'Refund Policy',
        body: 'Subscription fees are non-refundable once the billing period has started. Booking payments in escrow can be refunded if the worker fails to show up or the booking is cancelled before acceptance. Refunds are processed within 5-7 business days.'
      },
    ]
  },
  {
    id: 'privacy',
    icon: '🔒',
    title: 'Privacy & Data Usage',
    content: [
      {
        heading: 'Data We Collect',
        body: 'We collect: Name, phone number, city, and profile information you provide. Booking and payment transaction history. Device information, IP address, and usage patterns for security and analytics. We do not sell your personal data to third parties.'
      },
      {
        heading: 'How We Use Your Data',
        body: 'Your data is used to: Operate and improve the Workverra platform. Match workers with employers based on location and skills. Send OTP verification and important service notifications. Comply with legal obligations and prevent fraud.'
      },
      {
        heading: 'Data Storage & Security',
        body: 'All data is stored on secure servers with encryption at rest and in transit. We use industry-standard security practices including JWT authentication, HTTPS, and regular security audits.'
      },
      {
        heading: 'Your Rights',
        body: 'You have the right to: Access the personal data we hold about you. Request correction of inaccurate data. Request deletion of your account and associated data. Withdraw consent at any time. Contact us at privacy@workverra.in for any data requests.'
      },
      {
        heading: 'Cookies',
        body: 'Workverra uses essential cookies for authentication and session management. We do not use third-party advertising cookies. You can clear cookies at any time through your browser settings.'
      },
    ]
  },
  {
    id: 'rules',
    icon: '📋',
    title: 'Platform Rules',
    content: [
      {
        heading: 'Prohibited Activities',
        body: 'The following are strictly prohibited: Creating fake accounts or impersonating others. Posting misleading job offers or skill claims. Attempting to contact workers or employers outside the platform to avoid fees. Sharing abusive, discriminatory, or harmful content. Using the platform for any illegal services.'
      },
      {
        heading: 'Dispute Resolution',
        body: 'In case of disputes between workers and employers, both parties should first attempt to resolve the issue directly. If unresolved, contact Workverra support at support@workverra.in. Workverra will review evidence from both parties and make a binding decision within 7 business days.'
      },
      {
        heading: 'Account Suspension',
        body: 'Workverra reserves the right to suspend or permanently ban accounts that violate these terms. Users will be notified via their registered mobile number. Suspended users may appeal the decision within 14 days by contacting support.'
      },
      {
        heading: 'Changes to Policy',
        body: 'Workverra may update these policies at any time. Users will be notified of significant changes via SMS or in-app notification. Continued use of the platform after changes constitute acceptance of the updated terms.'
      },
      {
        heading: 'Governing Law',
        body: 'These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Indore, Madhya Pradesh, India.'
      },
    ]
  },
]

const PolicyPage = () => {
  const [active, setActive] = useState('responsibilities')

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerBadge}>Legal &amp; Policies</div>
          <h1 className={styles.headerTitle}>Workverra Policies</h1>
          <p className={styles.headerSub}>
            Last updated: April 2026 · Effective immediately for all users
          </p>
        </div>
      </div>

      <div className={styles.body}>
        {/* Sidebar nav */}
        <nav className={styles.sidebar}>
          {sections.map(s => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`${styles.navItem} ${active === s.id ? styles.navActive : ''}`}
              onClick={() => setActive(s.id)}
            >
              <span className={styles.navIcon}>{s.icon}</span>
              {s.title}
            </a>
          ))}
          <div className={styles.sidebarNote}>
            <p>Questions? Email us:</p>
            <a href="mailto:support@workverra.in" className={styles.emailLink}>
              support@workverra.in
            </a>
          </div>
        </nav>

        {/* Content */}
        <div className={styles.content}>
          {sections.map(s => (
            <section key={s.id} id={s.id} className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>{s.icon}</span>
                <h2 className={styles.sectionTitle}>{s.title}</h2>
              </div>
              {s.content.map(item => (
                <div key={item.heading} className={styles.item}>
                  <h3 className={styles.itemHeading}>{item.heading}</h3>
                  <p className={styles.itemBody}>{item.body}</p>
                </div>
              ))}
            </section>
          ))}

          {/* Footer note */}
          <div className={styles.footerNote}>
            <p>
              By using Workverra, you agree to these policies.
              For questions, contact{' '}
              <a href="mailto:support@workverra.in">support@workverra.in</a>
            </p>
            <Link to="/" className={styles.homeLink}>← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PolicyPage
