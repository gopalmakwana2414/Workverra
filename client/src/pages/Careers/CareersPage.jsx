import { useState } from 'react'
import styles from './CareersPage.module.css'

const PERKS = [
  { icon: '🏡', title: 'Remote-First',      desc: 'Work from anywhere in India. We trust you to manage your time.' },
  { icon: '💰', title: 'Competitive Pay',   desc: 'Market-rate salaries with equity options for early team members.' },
  { icon: '🚀', title: 'High Impact',       desc: 'Your work directly affects tens of thousands of workers and employers.' },
  { icon: '📚', title: 'Learning Budget',   desc: '₹20,000/year for courses, books, conferences, and certifications.' },
  { icon: '🏥', title: 'Health Insurance',  desc: 'Full health coverage for you and your immediate family.' },
  { icon: '🎯', title: 'Ownership Culture', desc: 'No unnecessary meetings. You own your roadmap and ship fast.' },
]

const OPENINGS = [
  { title: 'Full-Stack Developer (Node.js + React)',      team: 'Engineering',  type: 'Full-time',           location: 'Remote / Indore',   experience: '2–5 years',        desc: 'Build and maintain the core Workverra platform — booking system, payment integration, real-time notifications. You\'ll own features end-to-end.',             skills: ['Node.js','React','MongoDB','REST APIs','Socket.io'] },
  { title: 'Backend Developer (Node.js / Express)',        team: 'Engineering',  type: 'Full-time',           location: 'Remote / Indore',   experience: '2–4 years',        desc: 'Design and scale our backend APIs, implement Razorpay payment flows, build the OTP authentication system, and ensure 99.9% uptime.',                       skills: ['Node.js','Express','MongoDB','JWT','Razorpay'] },
  { title: 'Product Designer (UI/UX)',                     team: 'Design',       type: 'Full-time',           location: 'Remote',            experience: '2–4 years',        desc: 'Own the Workverra product design — worker and employer dashboards, booking flows, mobile responsiveness.',                                                  skills: ['Figma','UI Design','Mobile-first','User Research'] },
  { title: 'City Operations Manager — Indore / Bhopal',   team: 'Operations',   type: 'Full-time',           location: 'On-site, MP',       experience: '1–3 years',        desc: 'On-ground worker onboarding and verification in Madhya Pradesh cities. You\'ll be the face of Workverra for local workers.',                               skills: ['Field Operations','Hindi/English','MS Excel','Communication'] },
  { title: 'Growth & Marketing Intern',                    team: 'Marketing',    type: 'Internship (6 months)', location: 'Remote',          experience: 'Fresher / 0–1 year', desc: 'Help grow Workverra\'s user base through social media, content marketing, and worker/employer outreach campaigns.',                                       skills: ['Social Media','Content Writing','Analytics','Hindi/English'] },
]

// FIX #11: Application form modal
const ApplyModal = ({ job, onClose }) => {
  const [form, setForm] = useState({ name:'', email:'', phone:'', address:'', experience:'', currentRole:'', notice:'', whyUs:'', resume:null })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const set = (k, v) => { setForm(f=>({...f,[k]:v})); setErrors(e=>({...e,[k]:''})) }

  const validate = () => {
    const e = {}
    if (!form.name.trim())                             e.name  = 'Name is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required'
    if (!/^\d{10}$/.test(form.phone.replace(/\D/g,''))) e.phone = 'Valid 10-digit number required'
    if (!form.address.trim())                          e.address = 'Address is required'
    if (!form.experience)                              e.experience = 'Select experience level'
    if (!form.whyUs.trim())                            e.whyUs = 'Please tell us why you want to join'
    if (!form.resume)                                  e.resume = 'Resume is required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>✕</button>

        {submitted ? (
          <div className={styles.submitSuccess}>
            <div style={{ fontSize:'3rem', marginBottom:16 }}>✅</div>
            <h3>Application Submitted!</h3>
            <p>Thank you for applying for <strong>{job.title}</strong>. Our team will review your application and reach out at <strong>{form.email}</strong> within 5–7 business days.</p>
            <button className={styles.applySubmitBtn} onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <h2 className={styles.modalTitle}>Apply — {job.title}</h2>
            <p className={styles.modalSub}>{job.team} · {job.location} · {job.type}</p>

            <form onSubmit={handleSubmit} className={styles.applyForm} noValidate>
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Full Name *</label>
                  <input className={`${styles.formInput} ${errors.name ? styles.inputErr : ''}`}
                    placeholder="Rahul Sharma" value={form.name}
                    onChange={e => set('name', e.target.value)} />
                  {errors.name && <span className={styles.err}>{errors.name}</span>}
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Email Address *</label>
                  <input className={`${styles.formInput} ${errors.email ? styles.inputErr : ''}`}
                    type="email" placeholder="rahul@example.com" value={form.email}
                    onChange={e => set('email', e.target.value)} />
                  {errors.email && <span className={styles.err}>{errors.email}</span>}
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Mobile Number *</label>
                  <input className={`${styles.formInput} ${errors.phone ? styles.inputErr : ''}`}
                    placeholder="98765 43210" value={form.phone}
                    onChange={e => set('phone', e.target.value)} />
                  {errors.phone && <span className={styles.err}>{errors.phone}</span>}
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Current Location / Address *</label>
                  <input className={`${styles.formInput} ${errors.address ? styles.inputErr : ''}`}
                    placeholder="City, State" value={form.address}
                    onChange={e => set('address', e.target.value)} />
                  {errors.address && <span className={styles.err}>{errors.address}</span>}
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Total Work Experience *</label>
                  <select className={`${styles.formInput} ${errors.experience ? styles.inputErr : ''}`}
                    value={form.experience} onChange={e => set('experience', e.target.value)}>
                    <option value="">Select experience</option>
                    <option>Fresher (0–1 year)</option>
                    <option>1–2 years</option>
                    <option>2–4 years</option>
                    <option>4–6 years</option>
                    <option>6–10 years</option>
                    <option>10+ years</option>
                  </select>
                  {errors.experience && <span className={styles.err}>{errors.experience}</span>}
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Current Role / Company</label>
                  <input className={styles.formInput}
                    placeholder="e.g. Junior Dev at XYZ" value={form.currentRole}
                    onChange={e => set('currentRole', e.target.value)} />
                </div>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Notice Period</label>
                <select className={styles.formInput} value={form.notice}
                  onChange={e => set('notice', e.target.value)}>
                  <option value="">Select</option>
                  <option>Immediate / Available now</option>
                  <option>2 weeks</option>
                  <option>1 month</option>
                  <option>2 months</option>
                  <option>3 months</option>
                </select>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Why do you want to join Workverra? *</label>
                <textarea className={`${styles.formInput} ${styles.formTextarea} ${errors.whyUs ? styles.inputErr : ''}`}
                  rows={4} placeholder="Tell us what excites you about this role and the Workverra mission..."
                  value={form.whyUs} onChange={e => set('whyUs', e.target.value)} />
                {errors.whyUs && <span className={styles.err}>{errors.whyUs}</span>}
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Resume / CV * (PDF or DOC)</label>
                <input type="file" accept=".pdf,.doc,.docx"
                  className={`${styles.fileInput} ${errors.resume ? styles.inputErr : ''}`}
                  onChange={e => set('resume', e.target.files[0])} />
                {errors.resume && <span className={styles.err}>{errors.resume}</span>}
                {form.resume && <span className={styles.fileName}>📎 {form.resume.name}</span>}
              </div>

              <button type="submit" className={styles.applySubmitBtn} disabled={loading}>
                {loading
                  ? <><span className={styles.spinner} /> Submitting…</>
                  : 'Submit Application →'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

const CareersPage = () => {
  const [selectedTeam, setSelectedTeam] = useState('All')
  const [applyingTo, setApplyingTo]     = useState(null)

  const teams    = ['All', ...new Set(OPENINGS.map(o => o.team))]
  const filtered = selectedTeam === 'All' ? OPENINGS : OPENINGS.filter(o => o.team === selectedTeam)

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.badge}>We're Hiring</span>
          <h1 className={styles.title}>Build the future of work in India</h1>
          <p className={styles.sub}>
            Join a small, high-impact team making it easy for India's 450 million skilled workers
            to find work, build reputation, and earn more.
          </p>
          <div className={styles.heroCta}>
            <a href="#openings" className={styles.ctaBtn}>View Open Roles ↓</a>
            <a href="mailto:team.workverra@gmail.com" className={`${styles.ctaBtn} ${styles.ctaBtnOutline}`}>
              team.workverra@gmail.com
            </a>
          </div>
        </div>
      </div>

      <div className={styles.perksSection}>
        <div className={styles.sectionInner}>
          <div style={{ textAlign:'center', marginBottom:36 }}>
            <span className={styles.sectionTag}>Why Workverra?</span>
            <h2 className={styles.sectionTitle}>What we offer</h2>
          </div>
          <div className={styles.perksGrid}>
            {PERKS.map(p => (
              <div key={p.title} className={styles.perkCard}>
                <div className={styles.perkIcon}>{p.icon}</div>
                <div className={styles.perkTitle}>{p.title}</div>
                <div className={styles.perkDesc}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.openingsSection} id="openings">
        <div className={styles.sectionInner}>
          <div className={styles.openingsHead}>
            <div>
              <span className={styles.sectionTag}>Open Positions</span>
              <h2 className={styles.sectionTitle}>{filtered.length} role{filtered.length !== 1 ? 's' : ''} available</h2>
            </div>
            <div className={styles.teamFilter}>
              {teams.map(t => (
                <button key={t}
                  className={`${styles.teamBtn} ${selectedTeam === t ? styles.teamActive : ''}`}
                  onClick={() => setSelectedTeam(t)}>{t}</button>
              ))}
            </div>
          </div>

          <div className={styles.jobsList}>
            {filtered.map((job) => (
              <div key={job.title} className={styles.jobCard}>
                <div className={styles.jobTop}>
                  <div className={styles.jobInfo}>
                    <div className={styles.jobTitle}>{job.title}</div>
                    <div className={styles.jobMeta}>
                      <span className={styles.jobTeam}>{job.team}</span>
                      <span>📍 {job.location}</span>
                      <span>⏱ {job.type}</span>
                      <span>💼 {job.experience}</span>
                    </div>
                    <p className={styles.jobDesc}>{job.desc}</p>
                    <div className={styles.skillTags}>
                      {job.skills.map(s => <span key={s} className={styles.skillTag}>{s}</span>)}
                    </div>
                  </div>
                  {/* FIX #11: open application form modal */}
                  <div className={styles.jobAction}>
                    <button className={styles.applyBtn} onClick={() => setApplyingTo(job)}>
                      Apply Now →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.openApplication}>
            <div className={styles.openAppIcon}>📬</div>
            <div>
              <div className={styles.openAppTitle}>Don't see your role?</div>
              <div className={styles.openAppSub}>
                Send your resume to{' '}
                <a href="mailto:team.workverra@gmail.com" className={styles.emailLink}>
                  team.workverra@gmail.com
                </a>. We review every application.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.culture}>
        <div className={styles.cultureInner}>
          <h2>We move fast, care deeply, and keep things simple.</h2>
          <p>Workverra is a small team with a big mission. If you want your work to matter — this is the place.</p>
          <a href="mailto:team.workverra@gmail.com" className={styles.cultureBtn}>Get in Touch →</a>
        </div>
      </div>

      {/* FIX #11: Apply modal */}
      {applyingTo && <ApplyModal job={applyingTo} onClose={() => setApplyingTo(null)} />}
    </div>
  )
}

export default CareersPage
