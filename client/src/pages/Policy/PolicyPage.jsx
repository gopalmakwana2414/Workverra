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
        body: 'You agree to provide accurate, current, and complete information during registration. You are responsible for maintaining the confidentiality of your account credentials. Workverra is not liable for any loss resulting from unauthorized use of your account.',
      },
      {
        heading: 'Acceptable Use',
        body: 'You must not use the platform for any unlawful purpose, post false or misleading information, harass or harm other users, or engage in fraudulent activity. Any misuse will result in immediate account suspension.',
      },
      {
        heading: 'Worker Responsibilities',
        body: 'Workers must accurately represent their skills, qualifications, and availability. Workers are solely responsible for the quality of their work. Workverra acts as a marketplace and does not guarantee job outcomes.',
      },
      {
        heading: 'Employer Responsibilities',
        body: 'Employers must provide clear job descriptions, agreed compensation, and a safe working environment. Employers must pay the agreed amount through the platform and must not attempt to bypass the payment system.',
      },
    ],
  },
  {
    id: 'payment',
    icon: '💳',
    title: 'Payment & Subscription Terms',
    content: [
      {
        heading: 'Free Tier',
        body: 'Both workers and employers can register for free. Free accounts include limited features: Workers can receive up to 5 bookings/month. Employers can post up to 2 jobs/month.',
      },
      {
        heading: 'Paid Subscriptions',
        body: 'Worker Monthly: ₹49/month. Worker Yearly: ₹499/year. Employer Monthly: ₹99/month. Employer Yearly: ₹999/year. Subscriptions auto-renew unless cancelled before the renewal date.',
      },
      {
        heading: 'Payment Processing',
        body: 'All payments are processed securely via Razorpay. Workverra does not store your card or UPI credentials. Transaction data is encrypted and handled under PCI-DSS compliance standards.',
      },
      {
        heading: 'Escrow System',
        body: 'When an employer pays for a booking, funds are held in escrow by Workverra. Funds are only released to the worker after the employer confirms job completion. In case of disputes, Workverra reserves the right to mediate and make a final decision.',
      },
    ],
  },
  {
    id: 'privacy',
    icon: '🔒',
    title: 'Privacy Policy',
    content: [
      {
        heading: 'Data We Collect',
        body: 'We collect your name, mobile number, city, skill information, and professional details to enable bookings and payments. We also collect usage data to improve our services.',
      },
      {
        heading: 'How We Use Your Data',
        body: 'Your data is used to create your profile, match you with workers or employers, process payments, send OTP verification, and send service notifications. We never sell your data to third parties.',
      },
      {
        heading: 'OTP & Authentication',
        body: 'Your mobile number is verified via OTP to ensure account security. OTPs expire within 10 minutes and are single-use. We use JWT tokens for session management with a 30-day expiry.',
      },
      {
        heading: 'Data Retention',
        body: 'We retain your account data as long as your account is active. You may request deletion of your account and data by contacting team.workverra@gmail.com. Booking and payment records may be retained for legal compliance.',
      },
    ],
  },
  {
    id: 'conduct',
    icon: '🤝',
    title: 'Community Guidelines',
    content: [
      {
        heading: 'Respectful Conduct',
        body: 'All users must treat each other with respect. Harassment, discrimination, and abuse of any kind are strictly prohibited and will result in permanent account removal.',
      },
      {
        heading: 'Prohibited Activities',
        body: 'Fake reviews, fraudulent bookings, impersonation, and circumventing the escrow payment system are all prohibited. These violations will result in immediate and permanent suspension.',
      },
      {
        heading: 'Reporting Violations',
        body: 'Report any violations or suspicious activity to team.workverra@gmail.com. We investigate every report and take appropriate action within 48 hours.',
      },
    ],
  },
  {
    id: 'termination',
    icon: '🚫',
    title: 'Account Termination',
    content: [
      {
        heading: 'By User',
        body: 'You may delete your account at any time from your dashboard settings or by contacting team.workverra@gmail.com. Deletion removes your profile from public view immediately.',
      },
      {
        heading: 'By Workverra',
        body: 'We reserve the right to suspend or permanently ban accounts that violate these terms, with or without prior notice. Users with pending payments or active bookings will have those resolved before termination.',
      },
    ],
  },
  {
    id: 'contact',
    icon: '📬',
    title: 'Contact & Grievances',
    content: [
      {
        heading: 'General Queries',
        // FIX #6+12: correct email and address
        body: 'For general queries, contact us at team.workverra@gmail.com or call +91 8959465264 (Mon–Sat, 9 AM – 7 PM IST).',
      },
      {
        heading: 'Registered Address',
        body: '18, Shree Shyam Bhavan Tukral, Ujjain, Madhya Pradesh – 456550, India.',
      },
      {
        heading: 'Grievance Officer',
        body: 'For formal grievances under the IT Act, contact Gopal Makwana at team.workverra@gmail.com. We aim to resolve all grievances within 30 days.',
      },
    ],
  },
]

const PolicyPage = () => {
  const [activeSection, setActiveSection] = useState(sections[0].id)

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <span className={styles.badge}>Legal</span>
          <h1 className={styles.title}>Terms, Privacy & Policy</h1>
          <p className={styles.sub}>
            Last updated: April 2026 · Effective from: January 2026
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
              className={`${styles.navItem} ${activeSection === s.id ? styles.navActive : ''}`}
              onClick={() => setActiveSection(s.id)}
            >
              <span>{s.icon}</span>
              <span>{s.title}</span>
            </a>
          ))}
          <div className={styles.sidebarFooter}>
            <p>Questions?</p>
            <a href="mailto:team.workverra@gmail.com" className={styles.emailLink}>
              team.workverra@gmail.com
            </a>
          </div>
        </nav>

        {/* Content */}
        <main className={styles.content}>
          <div className={styles.intro}>
            <p>
              These Terms of Service, Privacy Policy, and Community Guidelines govern your use of
              the Workverra platform. By registering or using our services, you agree to these terms.
              Please read them carefully. If you have any questions, contact us at{' '}
              <a href="mailto:team.workverra@gmail.com" className={styles.inlineLink}>
                team.workverra@gmail.com
              </a>.
            </p>
          </div>

          {sections.map(section => (
            <div key={section.id} id={section.id} className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>{section.icon}</span>
                <h2 className={styles.sectionTitle}>{section.title}</h2>
              </div>
              {section.content.map(item => (
                <div key={item.heading} className={styles.policyItem}>
                  <h3 className={styles.itemHeading}>{item.heading}</h3>
                  <p className={styles.itemBody}>{item.body}</p>
                </div>
              ))}
            </div>
          ))}

          <div className={styles.footer}>
            <p>
              By using Workverra, you confirm that you have read, understood, and agree to these
              terms. For a printed copy, contact{' '}
              <a href="mailto:team.workverra@gmail.com" className={styles.inlineLink}>
                team.workverra@gmail.com
              </a>.
            </p>
            <div className={styles.footerActions}>
              <Link to="/" className={styles.backBtn}>← Back to Home</Link>
              <Link to="/contact" className={styles.contactBtn}>Contact Us</Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default PolicyPage
