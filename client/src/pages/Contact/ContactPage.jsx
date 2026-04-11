import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './ContactPage.module.css'

// FIX #6+12: Correct address and email
const CONTACT_INFO = [
  {
    icon: '📞',
    label: 'Phone',
    value: '+91 8959465264',
    sub: 'Mon–Sat, 9 AM – 7 PM IST',
    href: 'tel:+918959465264',
  },
  {
    icon: '✉️',
    label: 'Email',
    value: 'team.workverra@gmail.com',       // FIX #6
    sub: 'We reply within 24 hours',
    href: 'mailto:team.workverra@gmail.com', // FIX: was wrong href before
  },
  {
    icon: '🏢',
    label: 'Address',
    value: 'Workverra Technologies Pvt. Ltd.',
    // FIX #12: Correct address
    sub: '18, Shree Shyam Bhavan Tukral, Ujjain, Madhya Pradesh – 456550',
    href: null,
  },
]

const ContactPage = () => {
  const [form, setForm]       = useState({ name:'', email:'', phone:'', subject:'', message:'' })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })) }

  const validate = () => {
    const e = {}
    if (!form.name.trim())    e.name    = 'Name is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.subject.trim()) e.subject = 'Subject is required'
    if (form.message.trim().length < 20) e.message = 'Message must be at least 20 characters'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setSent(true)
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <span className={styles.badge}>Contact Us</span>
          <h1 className={styles.title}>Get in Touch</h1>
          <p className={styles.sub}>Have a question, issue, or feedback? We're here to help — reach out anytime.</p>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.leftCol}>
          {CONTACT_INFO.map(c => (
            <div key={c.label} className={styles.infoCard}>
              <div className={styles.infoIcon}>{c.icon}</div>
              <div className={styles.infoContent}>
                <div className={styles.infoLabel}>{c.label}</div>
                {c.href
                  ? <a href={c.href} className={styles.infoValue}>{c.value}</a>
                  : <div className={styles.infoValue}>{c.value}</div>
                }
                <div className={styles.infoSub}>{c.sub}</div>
              </div>
            </div>
          ))}

          <div className={styles.socialCard}>
            <div className={styles.socialTitle}>Also reach us on</div>
            <div className={styles.socialRow}>
              <a href="https://wa.me/918959465264" target="_blank" rel="noreferrer" className={`${styles.socialBtn} ${styles.whatsapp}`}>💬 WhatsApp</a>
              <a href="mailto:team.workverra@gmail.com" className={`${styles.socialBtn} ${styles.twitter}`}>✉ Email Us</a>
            </div>
          </div>

          <div className={styles.hoursCard}>
            <div className={styles.hoursTitle}>Support Hours</div>
            <div className={styles.hoursGrid}>
              <span>Monday – Friday</span><span>9:00 AM – 7:00 PM</span>
              <span>Saturday</span><span>10:00 AM – 5:00 PM</span>
              <span>Sunday</span><span className={styles.closed}>Closed</span>
            </div>
          </div>
        </div>

        <div className={styles.rightCol}>
          {sent ? (
            <div className={styles.successBox}>
              <div className={styles.successIcon}>✅</div>
              <h2 className={styles.successTitle}>Message Sent!</h2>
              <p className={styles.successSub}>
                Thank you for reaching out. Our team will get back to you within 24 hours at <strong>{form.email}</strong>.
              </p>
              <button className={styles.sendAgain} onClick={() => { setSent(false); setForm({ name:'', email:'', phone:'', subject:'', message:'' }) }}>
                Send another message
              </button>
            </div>
          ) : (
            <div className={styles.formCard}>
              <h2 className={styles.formTitle}>Send us a Message</h2>
              <p className={styles.formSub}>Fill in the form and we'll respond within 24 hours.</p>
              <form onSubmit={handleSubmit} className={styles.form} noValidate>
                <div className={styles.row2}>
                  <div className={styles.field}>
                    <label className={styles.label}>Full Name *</label>
                    <input className={`${styles.input} ${errors.name ? styles.inputErr : ''}`}
                      placeholder="Rahul Sharma" value={form.name} onChange={e => set('name', e.target.value)} />
                    {errors.name && <span className={styles.err}>{errors.name}</span>}
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Phone (optional)</label>
                    <input className={styles.input} placeholder="+91 98765 43210" type="tel"
                      value={form.phone} onChange={e => set('phone', e.target.value)} />
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Email Address *</label>
                  <input className={`${styles.input} ${errors.email ? styles.inputErr : ''}`}
                    type="email" placeholder="rahul@example.com" value={form.email}
                    onChange={e => set('email', e.target.value)} />
                  {errors.email && <span className={styles.err}>{errors.email}</span>}
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Subject *</label>
                  <select className={`${styles.input} ${errors.subject ? styles.inputErr : ''}`}
                    value={form.subject} onChange={e => set('subject', e.target.value)}>
                    <option value="">Select a topic</option>
                    <option>Registration Issue</option>
                    <option>OTP Not Received</option>
                    <option>Payment Problem</option>
                    <option>Booking Issue</option>
                    <option>Account / Profile</option>
                    <option>Report a Worker</option>
                    <option>Report an Employer</option>
                    <option>Subscription / Billing</option>
                    <option>Feature Request</option>
                    <option>Other</option>
                  </select>
                  {errors.subject && <span className={styles.err}>{errors.subject}</span>}
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Message *</label>
                  <textarea className={`${styles.input} ${styles.textarea} ${errors.message ? styles.inputErr : ''}`}
                    rows={5} placeholder="Describe your issue or question in detail…"
                    value={form.message} onChange={e => set('message', e.target.value)} />
                  {errors.message && <span className={styles.err}>{errors.message}</span>}
                  <span className={styles.charCount}>{form.message.length} characters</span>
                </div>
                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? <><span className={styles.spinner} /> Sending…</> : 'Send Message →'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <div className={styles.mapSection}>
        <div className={styles.mapInner}>
          <div className={styles.mapPlaceholder}>
            <span>📍</span>
            <p>18, Shree Shyam Bhavan Tukral, Ujjain, Madhya Pradesh – 456550</p>
            <a href="https://maps.google.com/?q=Ujjain,Madhya+Pradesh,India" target="_blank" rel="noreferrer" className={styles.mapLink}>
              Open in Google Maps →
            </a>
          </div>
        </div>
      </div>

      <div className={styles.footerNote}>
        <Link to="/" className={styles.backBtn}>← Back to Home</Link>
        <span>For urgent matters call <a href="tel:+918959465264" className={styles.phoneLink}>+91 8959465264</a></span>
      </div>
    </div>
  )
}

export default ContactPage
