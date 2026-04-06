import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import API from '../../api/axios'
import styles from './Login.module.css'

const Login = () => {
  const navigate = useNavigate()
  const { login, isAuthenticated, user } = useAuth()
  const [step, setStep] = useState('phone')
  const [role, setRole] = useState('employer')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [timer, setTimer] = useState(0)
  const [success, setSuccess] = useState(false)
  const otpRefs = useRef([])

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'worker' ? '/dashboard/worker' : '/dashboard/employer')
    }
  }, [isAuthenticated, user, navigate])

  useEffect(() => {
    if (timer <= 0) return
    const interval = setInterval(() => setTimer((t) => t - 1), 1000)
    return () => clearInterval(interval)
  }, [timer])

  const handlePhoneSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
      setError('Please enter a valid 10-digit mobile number')
      return
    }
    setLoading(true)
    try {
      await API.post('/auth/send-otp', { phone: `+91${phone}`, role })
    } catch (err) {
      // If backend not available, continue in demo mode
      console.warn('OTP send demo mode:', err.message)
    }
    setLoading(false)
    setStep('otp')
    setTimer(30)
    setTimeout(() => otpRefs.current[0]?.focus(), 100)
  }

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    setError('')
    if (value && index < 5) otpRefs.current[index + 1]?.focus()
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus()
  }

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) { setOtp(pasted.split('')); otpRefs.current[5]?.focus() }
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const enteredOtp = otp.join('')
    if (enteredOtp.length !== 6) { setError('Please enter the complete 6-digit OTP'); return }

    setLoading(true)
    try {
      const res = await API.post('/auth/verify-otp', { phone: `+91${phone}`, otp: enteredOtp, role })
      setSuccess(true)
      await new Promise(r => setTimeout(r, 700))
      login(res.data)
      navigate(role === 'worker' ? '/dashboard/worker' : '/dashboard/employer')
    } catch (err) {
      // Demo fallback — allow 123456
      if (enteredOtp === '123456') {
        setSuccess(true)
        await new Promise(r => setTimeout(r, 700))
        const demoUser = {
          token: 'demo-token-' + Date.now(),
          user: { _id: 'demo-' + role, name: role === 'worker' ? 'Mohan Kumar' : 'Rahul Enterprises', phone: `+91${phone}`, role }
        }
        login(demoUser)
        navigate(role === 'worker' ? '/dashboard/worker' : '/dashboard/employer')
      } else {
        setError(err.response?.data?.message || 'Incorrect OTP. Use 123456 for demo.')
      }
    }
    setLoading(false)
  }

  const handleResend = async () => {
    if (timer > 0) return
    setOtp(['', '', '', '', '', ''])
    setError('')
    setTimer(30)
    otpRefs.current[0]?.focus()
    try { await API.post('/auth/send-otp', { phone: `+91${phone}`, role }) } catch (_) {}
  }

  return (
    <div className={styles.page}>
      <div className={styles.leftPanel}>
        <div className={styles.leftContent}>
          <Link to="/" className={styles.brandLogo}>
            <img src="/images/logo.png" alt="SkillBridge" onError={(e) => { e.target.style.display = 'none' }} />
            <span className={styles.brandText}>Work<strong>verra</strong></span>
          </Link>
          <div className={styles.leftHero}>
            <h2 className={styles.leftTitle}>
              India's most trusted<br />
              <span>hyperlocal talent</span><br />
              marketplace
            </h2>
            <p className={styles.leftSub}>
              Connect with 2,400+ verified workers across 140+ cities in Tier 2 & 3 India.
            </p>
          </div>
          <div className={styles.trustCards}>
            {[
              { icon:'🔐', title:'OTP Verified', desc:'Every account is phone-verified' },
              { icon:'💳', title:'UPI Payments', desc:'Safe escrow-based payments' },
              { icon:'⭐', title:'4.8★ Rating', desc:'Trusted by 10,000+ users' },
            ].map(c => (
              <div key={c.title} className={styles.trustCard}>
                <span className={styles.trustIcon}>{c.icon}</span>
                <div>
                  <div className={styles.trustTitle}>{c.title}</div>
                  <div className={styles.trustDesc}>{c.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.formWrap}>
          <div className={styles.roleToggle}>
            {['employer','worker'].map(r => (
              <button key={r}
                className={`${styles.roleBtn} ${role === r ? styles.roleActive : ''}`}
                onClick={() => setRole(r)} type="button">
                {r === 'employer' ? "I'm an Employer" : "I'm a Worker"}
              </button>
            ))}
          </div>

          {step === 'phone' && (
            <div className={styles.formCard}>
              <div className={styles.formHeader}>
                <h1 className={styles.formTitle}>Welcome back</h1>
                <p className={styles.formSub}>Enter your mobile number to continue</p>
              </div>
              <form onSubmit={handlePhoneSubmit} className={styles.form}>
                <div className={styles.phoneInputWrap}>
                  <div className={styles.countryCode}><span className={styles.flag}>🇮🇳</span><span>+91</span></div>
                  <input type="tel" className={styles.phoneInput} placeholder="98765 43210"
                    value={phone} onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setError('') }}
                    maxLength={10} autoFocus />
                </div>
                {error && <p className={styles.errorMsg}>⚠ {error}</p>}
                <button type="submit" className={`${styles.submitBtn} ${loading ? styles.loading : ''}`}
                  disabled={loading || phone.length !== 10}>
                  {loading ? <span className={styles.spinner}></span> : 'Send OTP →'}
                </button>
                <p className={styles.formNote}>
                  New to Workverra?{' '}
                  <Link to={`/register?role=${role}`} className={styles.link}>Create an account</Link>
                </p>
              </form>
            </div>
          )}

          {step === 'otp' && (
            <div className={styles.formCard}>
              <button className={styles.backBtn} onClick={() => { setStep('phone'); setOtp(['','','','','','']); setError('') }} type="button">← Back</button>
              <div className={styles.formHeader}>
                <h1 className={styles.formTitle}>Verify OTP</h1>
                <p className={styles.formSub}>
                  Sent to <strong>+91 {phone}</strong><br />
                  <span className={styles.demoHint}>Demo: use OTP <strong>123456</strong></span>
                </p>
              </div>
              <form onSubmit={handleOtpSubmit} className={styles.form}>
                <div className={styles.otpRow} onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input key={i} ref={(el) => (otpRefs.current[i] = el)}
                      type="text" inputMode="numeric" maxLength={1}
                      className={`${styles.otpBox} ${digit ? styles.otpFilled : ''} ${success ? styles.otpSuccess : ''}`}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)} />
                  ))}
                </div>
                {error && <p className={styles.errorMsg}>⚠ {error}</p>}
                {success && <p className={styles.successMsg}>✓ Verified! Redirecting...</p>}
                <button type="submit"
                  className={`${styles.submitBtn} ${loading ? styles.loading : ''} ${success ? styles.successBtn : ''}`}
                  disabled={loading || otp.join('').length !== 6}>
                  {loading && !success ? <span className={styles.spinner}></span> : success ? '✓ Verified!' : 'Verify & Login'}
                </button>
                <div className={styles.resendRow}>
                  {timer > 0
                    ? <span className={styles.timerText}>Resend OTP in {timer}s</span>
                    : <button type="button" className={styles.resendBtn} onClick={handleResend}>Resend OTP</button>
                  }
                </div>
              </form>
            </div>
          )}

          <p className={styles.termsNote}>
            By continuing, you agree to SkillBridge's{' '}
            <Link to="/terms" className={styles.link}>Terms of Service</Link> and{' '}
            <Link to="/privacy" className={styles.link}>Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
