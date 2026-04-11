import { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import API from '../../api/axios'
import { SKILLS_LIST, CITIES } from '../../utils/dummyData'
import styles from './Register.module.css'

const STEPS_EMPLOYER = ['Role', 'Account', 'Company', 'Policy']
const STEPS_WORKER   = ['Role', 'Account', 'Profile', 'Skills', 'Policy']

const Register = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [searchParams] = useSearchParams()
  const initialRole = searchParams.get('role') || 'employer'

  const [role, setRole]   = useState(initialRole)
  const [step, setStep]   = useState(initialRole !== 'employer' && initialRole !== 'worker' ? 0 : 0)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors]   = useState({})
  const [policyAccepted, setPolicyAccepted] = useState(false)

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
      if (!form.name.trim())            e.name  = 'Full name is required'
      if (!/^\d{10}$/.test(form.phone)) e.phone = 'Enter valid 10-digit number'
      if (!form.city)                   e.city  = 'Select your city'
    }
    if (step === 2 && role === 'employer') {
      if (!form.companyName.trim()) e.companyName = 'Company / business name required'
    }
    if (step === 2 && role === 'worker') {
      if (!form.skill)      e.skill      = 'Select your primary skill'
      if (!form.experience) e.experience = 'Enter years of experience'
      if (!form.hourlyRate) e.hourlyRate = 'Enter your hourly rate'
    }
    // Policy step validation
    const policyStep = role === 'worker' ? 4 : 3
    if (step === policyStep && !policyAccepted) {
      e.policy = 'You must accept the policy to continue'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = async () => {
    if (!validate()) return
    if (step === totalSteps - 1) {
      setLoading(true)
      try {
        // FIX #4: Send phone as plain 10 digits — backend expects 10-digit string
        const payload = {
          name: form.name,
          phone: form.phone,          // ← plain 10 digits, NOT +91 prefixed
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
            skills: form.selectedSkills.length > 0 ? form.selectedSkills : [form.skill],
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
  const policyStep = role === 'worker' ? 4 : 3

  return (
    <div className={styles.page}>
      {/* Left Panel */}
      <div className={styles.left}>
        {/* FIX #5: Logo visible on auth pages */}
        <Link to="/" className={styles.logoLink}>
          <img src="/images/logo.png" alt="Workverra" className={styles.logoImg}
            onError={e => { e.target.style.display='none' }} />
          <span className={styles.logoText}>Workverra</span>
        </Link>

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

      {/* Right Panel */}
      <div className={styles.right}>
        <div className={styles.formWrap}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <p className={styles.stepLabel}>Step {step + 1} of {totalSteps} — {steps[step]}</p>

          {errors.submit && <div className={styles.submitError}>⚠ {errors.submit}</div>}

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
                  placeholder="Rahul Sharma" value={form.name}
                  onChange={e => set('name', e.target.value)} />
                {errors.name && <span className={styles.err}>{errors.name}</span>}
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Mobile Number</label>
                <div className={styles.phoneWrap}>
                  <span className={styles.phoneCode}>🇮🇳 +91</span>
                  <input className={`${styles.input} ${styles.phoneInner} ${errors.phone ? styles.inputError : ''}`}
                    placeholder="98765 43210" value={form.phone}
                    onChange={e => set('phone', e.target.value.replace(/\D/g,'').slice(0,10))}
                    maxLength={10} inputMode="numeric" />
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
                <select className={styles.input} value={form.companyType}
                  onChange={e => set('companyType', e.target.value)}>
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

          {/* FIX #13: Policy step — last step for both roles */}
          {step === policyStep && (
            <div className={styles.stepCard}>
              <h2 className={styles.stepTitle}>Accept Policy</h2>
              <p className={styles.stepSub}>Please read and accept our policies before creating your account</p>

              <div className={styles.policyBox}>
                <h4 className={styles.policyHeading}>Terms of Service</h4>
                <p className={styles.policyText}>
                  By using Workverra, you agree to maintain accurate profile information, conduct all
                  transactions honestly, and comply with applicable Indian laws. Workers agree to
                  complete booked jobs professionally. Employers agree to pay for completed services.
                  Workverra reserves the right to suspend accounts that violate these terms.
                </p>

                <h4 className={styles.policyHeading}>Privacy Policy</h4>
                <p className={styles.policyText}>
                  We collect your name, mobile number, city, and professional details to enable
                  bookings and payments. Your data is stored securely and never sold to third
                  parties. OTP verification ensures only you can access your account. Payment data
                  is handled by Razorpay and subject to their privacy policy.
                </p>

                <h4 className={styles.policyHeading}>Community Guidelines</h4>
                <p className={styles.policyText}>
                  All users must treat each other respectfully. Fake reviews, fraudulent bookings,
                  and harassment are strictly prohibited and will result in permanent account removal.
                  Report any violations to team.workverra@gmail.com.
                </p>

                <Link to="/policy" target="_blank" className={styles.fullPolicyLink}>
                  Read full policy →
                </Link>
              </div>

              <label className={`${styles.policyCheckRow} ${errors.policy ? styles.policyCheckError : ''}`}>
                <input
                  type="checkbox"
                  checked={policyAccepted}
                  onChange={e => {
                    setPolicyAccepted(e.target.checked)
                    if (e.target.checked) setErrors(er => ({ ...er, policy: '' }))
                  }}
                  className={styles.checkbox}
                />
                <span>
                  I have read and agree to Workverra's{' '}
                  <Link to="/policy" target="_blank" className={styles.policyLinkInline}>Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/policy" target="_blank" className={styles.policyLinkInline}>Privacy Policy</Link>
                </span>
              </label>
              {errors.policy && <span className={styles.err}>{errors.policy}</span>}
            </div>
          )}

          {/* Navigation buttons */}
          <div className={styles.navRow}>
            {step > 0 && (
              <button type="button" className={styles.backBtn} onClick={back}>← Back</button>
            )}
            <button
              type="button"
              className={`${styles.nextBtn} ${loading ? styles.loading : ''}`}
              onClick={next}
              disabled={loading || (step === policyStep && !policyAccepted)}
            >
              {loading
                ? <span className={styles.spinner}></span>
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
