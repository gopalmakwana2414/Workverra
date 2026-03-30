import { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { SKILLS_LIST, CITIES } from '../../utils/dummyData'
import styles from './Register.module.css'

const STEPS_EMPLOYER = ['Role', 'Account', 'Company']
const STEPS_WORKER   = ['Role', 'Account', 'Profile', 'Skills']

const Register = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialRole = searchParams.get('role') || 'employer'

  const [role, setRole]   = useState(initialRole)
  const [step, setStep]   = useState(0)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors]   = useState({})

  const [form, setForm] = useState({
    name: '', phone: '', city: '',
    companyName: '', companyType: '',
    skill: '', experience: '', hourlyRate: '', about: '',
    selectedSkills: [],
  })

  const steps = role === 'worker' ? STEPS_WORKER : STEPS_EMPLOYER
  const totalSteps = steps.length

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }))
    setErrors((e) => ({ ...e, [key]: '' }))
  }

  const toggleSkill = (skill) => {
    setForm((f) => ({
      ...f,
      selectedSkills: f.selectedSkills.includes(skill)
        ? f.selectedSkills.filter((s) => s !== skill)
        : f.selectedSkills.length < 5
          ? [...f.selectedSkills, skill]
          : f.selectedSkills,
    }))
  }

  const validate = () => {
    const e = {}
    if (step === 1) {
      if (!form.name.trim())  e.name  = 'Full name is required'
      if (!/^\d{10}$/.test(form.phone)) e.phone = 'Enter valid 10-digit number'
      if (!form.city)         e.city  = 'Select your city'
    }
    if (step === 2 && role === 'employer') {
      if (!form.companyName.trim()) e.companyName = 'Company / business name required'
    }
    if (step === 2 && role === 'worker') {
      if (!form.skill)         e.skill      = 'Select your primary skill'
      if (!form.experience)    e.experience = 'Enter years of experience'
      if (!form.hourlyRate)    e.hourlyRate = 'Enter your hourly rate'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = async () => {
    if (!validate()) return
    if (step === totalSteps - 1) {
      setLoading(true)
      await new Promise(r => setTimeout(r, 1400))
      setLoading(false)
      navigate(role === 'worker' ? '/dashboard/worker' : '/dashboard/employer')
    } else {
      setStep(s => s + 1)
    }
  }

  const back = () => setStep(s => s - 1)

  const progress = Math.round((step / (totalSteps - 1)) * 100)

  return (
    <div className={styles.page}>
      {/* Left panel */}
      <div className={styles.left}>
        <Link to="/" className={styles.brand}>Work<strong>verra</strong></Link>
        <div className={styles.leftContent}>
          <h2 className={styles.leftTitle}>
            {role === 'worker'
              ? 'Start earning with your skills'
              : 'Hire verified local talent'}
          </h2>
          <p className={styles.leftSub}>
            {role === 'worker'
              ? 'Join 2,400+ verified workers across India. Get bookings, secure payments, and grow your reputation.'
              : 'Access 2,400+ skilled workers in your city. Post jobs, manage bookings, and pay securely via UPI.'}
          </p>
          <div className={styles.stepList}>
            {steps.map((s, i) => (
              <div key={s} className={`${styles.stepItem} ${i === step ? styles.stepCurrent : ''} ${i < step ? styles.stepDone : ''}`}>
                <div className={styles.stepDot}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className={styles.right}>
        <div className={styles.formWrap}>
          {/* Progress bar */}
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
          </div>
          <p className={styles.stepLabel}>Step {step + 1} of {totalSteps} — {steps[step]}</p>

          {/* ── STEP 0: Role ── */}
          {step === 0 && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Join as a...</h2>
              <p className={styles.cardSub}>Choose your role to get started</p>
              <div className={styles.roleGrid}>
                <button
                  className={`${styles.roleCard} ${role === 'employer' ? styles.roleSelected : ''}`}
                  onClick={() => setRole('employer')}
                >
                  <span className={styles.roleIcon}>🏢</span>
                  <div className={styles.roleLabel}>Employer</div>
                  <div className={styles.roleDesc}>Post jobs, hire workers, manage bookings</div>
                  {role === 'employer' && <span className={styles.roleCheck}>✓</span>}
                </button>
                <button
                  className={`${styles.roleCard} ${role === 'worker' ? styles.roleSelected : ''}`}
                  onClick={() => setRole('worker')}
                >
                  <span className={styles.roleIcon}>👷</span>
                  <div className={styles.roleLabel}>Worker</div>
                  <div className={styles.roleDesc}>Get hired, earn money, build reputation</div>
                  {role === 'worker' && <span className={styles.roleCheck}>✓</span>}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 1: Account ── */}
          {step === 1 && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Create your account</h2>
              <p className={styles.cardSub}>Basic info to get you started</p>

              <div className={styles.fields}>
                <div className={styles.field}>
                  <label className={styles.label}>Full Name</label>
                  <input className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                    placeholder="e.g. Rahul Sharma" value={form.name}
                    onChange={e => set('name', e.target.value)} />
                  {errors.name && <span className={styles.err}>{errors.name}</span>}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Mobile Number</label>
                  <div className={styles.phoneWrap}>
                    <span className={styles.code}>🇮🇳 +91</span>
                    <input className={`${styles.phoneInput} ${errors.phone ? styles.inputError : ''}`}
                      placeholder="98765 43210" value={form.phone} maxLength={10}
                      onChange={e => set('phone', e.target.value.replace(/\D/g, '').slice(0,10))} />
                  </div>
                  {errors.phone && <span className={styles.err}>{errors.phone}</span>}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>City</label>
                  <select className={`${styles.select} ${errors.city ? styles.inputError : ''}`}
                    value={form.city} onChange={e => set('city', e.target.value)}>
                    <option value="">Select your city</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.city && <span className={styles.err}>{errors.city}</span>}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2 Employer: Company ── */}
          {step === 2 && role === 'employer' && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>About your business</h2>
              <p className={styles.cardSub}>Help workers understand who they're working for</p>
              <div className={styles.fields}>
                <div className={styles.field}>
                  <label className={styles.label}>Company / Business Name</label>
                  <input className={`${styles.input} ${errors.companyName ? styles.inputError : ''}`}
                    placeholder="e.g. Sharma Constructions" value={form.companyName}
                    onChange={e => set('companyName', e.target.value)} />
                  {errors.companyName && <span className={styles.err}>{errors.companyName}</span>}
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Business Type</label>
                  <select className={styles.select} value={form.companyType}
                    onChange={e => set('companyType', e.target.value)}>
                    <option value="">Select type</option>
                    {['Individual / Home','Construction','Real Estate','Hotel / Hospitality','Retail','Manufacturing','Other'].map(t =>
                      <option key={t} value={t}>{t}</option>
                    )}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2 Worker: Profile ── */}
          {step === 2 && role === 'worker' && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Your work profile</h2>
              <p className={styles.cardSub}>Tell employers what you do best</p>
              <div className={styles.fields}>
                <div className={styles.field}>
                  <label className={styles.label}>Primary Skill</label>
                  <select className={`${styles.select} ${errors.skill ? styles.inputError : ''}`}
                    value={form.skill} onChange={e => set('skill', e.target.value)}>
                    <option value="">Select your main skill</option>
                    {SKILLS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.skill && <span className={styles.err}>{errors.skill}</span>}
                </div>
                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <label className={styles.label}>Experience (years)</label>
                    <input className={`${styles.input} ${errors.experience ? styles.inputError : ''}`}
                      type="number" min="0" max="50" placeholder="e.g. 5"
                      value={form.experience} onChange={e => set('experience', e.target.value)} />
                    {errors.experience && <span className={styles.err}>{errors.experience}</span>}
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Hourly Rate (₹)</label>
                    <input className={`${styles.input} ${errors.hourlyRate ? styles.inputError : ''}`}
                      type="number" min="0" placeholder="e.g. 400"
                      value={form.hourlyRate} onChange={e => set('hourlyRate', e.target.value)} />
                    {errors.hourlyRate && <span className={styles.err}>{errors.hourlyRate}</span>}
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>About You <span className={styles.optional}>(optional)</span></label>
                  <textarea className={styles.textarea} rows={3}
                    placeholder="Briefly describe your experience and specializations..."
                    value={form.about} onChange={e => set('about', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3 Worker: Skills ── */}
          {step === 3 && role === 'worker' && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Select your skills</h2>
              <p className={styles.cardSub}>Pick up to 5 skills that describe your work</p>
              <div className={styles.skillsGrid}>
                {SKILLS_LIST.map(skill => (
                  <button key={skill}
                    className={`${styles.skillPill} ${form.selectedSkills.includes(skill) ? styles.skillActive : ''}`}
                    onClick={() => toggleSkill(skill)}>
                    {skill}
                    {form.selectedSkills.includes(skill) && <span className={styles.skillCheck}>✓</span>}
                  </button>
                ))}
              </div>
              <p className={styles.skillCount}>{form.selectedSkills.length}/5 selected</p>
            </div>
          )}

          {/* Nav Buttons */}
          <div className={styles.navBtns}>
            {step > 0 && (
              <button className={styles.backBtn} onClick={back}>← Back</button>
            )}
            <button
              className={`${styles.nextBtn} ${loading ? styles.loading : ''}`}
              onClick={next}
              disabled={loading}
            >
              {loading ? <span className={styles.spinner}></span>
                : step === totalSteps - 1 ? '🚀 Create Account' : 'Continue →'}
            </button>
          </div>

          <p className={styles.loginNote}>
            Already have an account?{' '}
            <Link to="/login" className={styles.link}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
