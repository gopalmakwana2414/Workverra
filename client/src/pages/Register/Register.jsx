import { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import API from '../../api/axios'
import { SKILLS_LIST, CITIES } from '../../utils/dummyData'
import styles from './Register.module.css'

const STEPS_EMPLOYER = ['Role', 'Account', 'Company']
const STEPS_WORKER   = ['Role', 'Account', 'Profile', 'Skills']

const Register = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
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
    setErrors((e) => ({ ...e, [key]: '', submit: '' }))
  }

  const toggleSkill = (skill) => {
    setForm((f) => ({
      ...f,
      selectedSkills: f.selectedSkills.includes(skill)
        ? f.selectedSkills.filter((s) => s !== skill)
        : f.selectedSkills.length < 5 ? [...f.selectedSkills, skill] : f.selectedSkills,
    }))
  }

  const validate = () => {
    const e = {}
    if (step === 1) {
      if (!form.name.trim())          e.name  = 'Full name is required'
      if (!/^\d{10}$/.test(form.phone)) e.phone = 'Enter valid 10-digit number'
      if (!form.city)                  e.city  = 'Select your city'
    }
    if (step === 2 && role === 'employer') {
      if (!form.companyName.trim()) e.companyName = 'Company / business name required'
    }
    if (step === 2 && role === 'worker') {
      if (!form.skill)       e.skill      = 'Select your primary skill'
      if (!form.experience)  e.experience = 'Enter years of experience'
      if (!form.hourlyRate)  e.hourlyRate = 'Enter your hourly rate'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = async () => {
    if (!validate()) return
    if (step === totalSteps - 1) {
      setLoading(true)
      try {
        const payload = {
          name: form.name,
          phone: `+91${form.phone}`,
          city: form.city,
          role,
          ...(role === 'employer' ? {
            companyName: form.companyName,
            companyType: form.companyType,
          } : {
            skill: form.skill,
            experience: Number(form.experience),
            hourlyRate: Number(form.hourlyRate),
            about: form.about,
            skills: form.selectedSkills,
          })
        }
        const res = await API.post('/auth/register', payload)
        login(res.data)
        navigate(role === 'worker' ? '/dashboard/worker' : '/dashboard/employer')
      } catch (err) {
        const msg = err.response?.data?.message || 'Registration failed. Please try again.'
        setErrors({ submit: msg })
      }
      setLoading(false)
    } else {
      setStep(s => s + 1)
    }
  }

  const back = () => setStep(s => s - 1)
  const progress = Math.round((step / (totalSteps - 1)) * 100)

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <Link to="/" className={styles.brand}>Work<strong>verra</strong></Link>
        <div className={styles.leftContent}>
          <h2 className={styles.leftTitle}>
            {role === 'worker' ? 'Start earning with your skills' : 'Hire verified local talent'}
          </h2>
          <p className={styles.leftSub}>
            {role === 'worker'
              ? 'Join thousands of verified workers across India. Get bookings, secure payments, and grow your reputation.'
              : 'Access skilled workers in your city. Post jobs, manage bookings, and pay securely via UPI.'}
          </p>
          <div className={styles.stepList}>
            {steps.map((s, i) => (
              <div key={s} className={`${styles.stepItem} ${i === step ? styles.stepCurrent : ''} ${i < step ? styles.stepDone : ''}`}>
                <div className={styles.stepDot}>{i < step ? '✓' : i + 1}</div>
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.formWrap}>
          {/* Progress bar */}
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>

          {/* Global submit error */}
          {errors.submit && (
            <div className={styles.submitError}>
              ⚠ {errors.submit}
            </div>
          )}

          {/* Step 0: Role */}
          {step === 0 && (
            <div className={styles.stepCard}>
              <h2 className={styles.stepTitle}>How will you use Workverra?</h2>
              <p className={styles.stepSub}>Choose your role to get started</p>
              <div className={styles.roleCards}>
                {[
                  { r:'employer', icon:'🏢', title:'Hire Workers', desc:'Find and hire skilled workers for your projects' },
                  { r:'worker',   icon:'🔧', title:'Find Work',   desc:'Get hired and earn with your skills' },
                ].map(({ r, icon, title, desc }) => (
                  <button key={r} type="button"
                    className={`${styles.roleCard} ${role === r ? styles.roleCardActive : ''}`}
                    onClick={() => setRole(r)}>
                    <span className={styles.roleCardIcon}>{icon}</span>
                    <div className={styles.roleCardTitle}>{title}</div>
                    <div className={styles.roleCardDesc}>{desc}</div>
                    {role === r && <div className={styles.roleCardCheck}>✓</div>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Account */}
          {step === 1 && (
            <div className={styles.stepCard}>
              <h2 className={styles.stepTitle}>Your account details</h2>
              <p className={styles.stepSub}>We'll use this to set up your profile</p>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Full Name</label>
                <input className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                  placeholder="Rahul Sharma" value={form.name} onChange={e => set('name', e.target.value)} />
                {errors.name && <span className={styles.err}>{errors.name}</span>}
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Mobile Number</label>
                <div className={styles.phoneWrap}>
                  <span className={styles.phoneCode}>🇮🇳 +91</span>
                  <input className={`${styles.input} ${styles.phoneInner} ${errors.phone ? styles.inputError : ''}`}
                    placeholder="98765 43210" value={form.phone}
                    onChange={e => set('phone', e.target.value.replace(/\D/g,'').slice(0,10))} maxLength={10} />
                </div>
                {errors.phone && <span className={styles.err}>{errors.phone}</span>}
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>City</label>
                <select className={`${styles.input} ${errors.city ? styles.inputError : ''}`}
                  value={form.city} onChange={e => set('city', e.target.value)}>
                  <option value="">Select your city</option>
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
                {errors.city && <span className={styles.err}>{errors.city}</span>}
              </div>
            </div>
          )}

          {/* Step 2 Employer: Company */}
          {step === 2 && role === 'employer' && (
            <div className={styles.stepCard}>
              <h2 className={styles.stepTitle}>Company details</h2>
              <p className={styles.stepSub}>Help workers know who they're working for</p>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Company / Business Name</label>
                <input className={`${styles.input} ${errors.companyName ? styles.inputError : ''}`}
                  placeholder="e.g. Sharma Construction" value={form.companyName}
                  onChange={e => set('companyName', e.target.value)} />
                {errors.companyName && <span className={styles.err}>{errors.companyName}</span>}
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Business Type (optional)</label>
                <select className={styles.input} value={form.companyType} onChange={e => set('companyType', e.target.value)}>
                  <option value="">Select type</option>
                  {['Individual / Freelancer','Small Business','Construction','Real Estate',
                    'Restaurant / Hotel','Manufacturing','Healthcare','Retail','Other']
                    .map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Step 2 Worker: Profile */}
          {step === 2 && role === 'worker' && (
            <div className={styles.stepCard}>
              <h2 className={styles.stepTitle}>Your work profile</h2>
              <p className={styles.stepSub}>Tell employers about your expertise</p>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Primary Skill</label>
                <select className={`${styles.input} ${errors.skill ? styles.inputError : ''}`}
                  value={form.skill} onChange={e => set('skill', e.target.value)}>
                  <option value="">Select your main skill</option>
                  {SKILLS_LIST.map(s => <option key={s}>{s}</option>)}
                </select>
                {errors.skill && <span className={styles.err}>{errors.skill}</span>}
              </div>
              <div className={styles.row2}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Experience (years)</label>
                  <input type="number" className={`${styles.input} ${errors.experience ? styles.inputError : ''}`}
                    placeholder="e.g. 4" min="0" max="50" value={form.experience}
                    onChange={e => set('experience', e.target.value)} />
                  {errors.experience && <span className={styles.err}>{errors.experience}</span>}
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Hourly Rate (₹)</label>
                  <input type="number" className={`${styles.input} ${errors.hourlyRate ? styles.inputError : ''}`}
                    placeholder="e.g. 350" min="50" value={form.hourlyRate}
                    onChange={e => set('hourlyRate', e.target.value)} />
                  {errors.hourlyRate && <span className={styles.err}>{errors.hourlyRate}</span>}
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>About You (optional)</label>
                <textarea className={`${styles.input} ${styles.textarea}`} rows={3}
                  placeholder="Briefly describe your experience and what makes you stand out..."
                  value={form.about} onChange={e => set('about', e.target.value)} />
              </div>
            </div>
          )}

          {/* Step 3 Worker: Skills */}
          {step === 3 && role === 'worker' && (
            <div className={styles.stepCard}>
              <h2 className={styles.stepTitle}>Select your skills</h2>
              <p className={styles.stepSub}>Pick up to 5 skills you offer ({form.selectedSkills.length}/5 selected)</p>
              <div className={styles.skillsGrid}>
                {SKILLS_LIST.map(s => (
                  <button key={s} type="button"
                    className={`${styles.skillChip} ${form.selectedSkills.includes(s) ? styles.skillActive : ''}`}
                    onClick={() => toggleSkill(s)}>
                    {s}
                    {form.selectedSkills.includes(s) && <span className={styles.skillCheck}>✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className={styles.navRow}>
            {step > 0 && (
              <button type="button" className={styles.backBtn} onClick={back}>← Back</button>
            )}
            <button type="button" className={`${styles.nextBtn} ${loading ? styles.loading : ''}`}
              onClick={next} disabled={loading}>
              {loading ? <span className={styles.spinner}></span>
               : step === totalSteps - 1 ? 'Create Account 🎉' : 'Continue →'}
            </button>
          </div>

          <p className={styles.loginNote}>
            Already have an account?{' '}
            <Link to={`/login?role=${role}`} className={styles.loginLink}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
