import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import API from '../../api/axios'
import styles from './Login.module.css'

const Login = () => {
  const navigate = useNavigate()
  const { login, isAuthenticated, user } = useAuth()
  const [step, setStep]     = useState('phone')
  const [role, setRole]     = useState('employer')
  const [phone, setPhone]   = useState('')
  const [otp, setOtp]       = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')
  const [timer, setTimer]   = useState(0)
  const [success, setSuccess] = useState(false)
  const otpRefs = useRef([])

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
      console.warn('OTP send:', err.message)
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
      setError(err.response?.data?.message || 'Incorrect OTP. Please try again.')
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

  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google?role=${role}`
  }

  return (
    <div className={styles.page}>
      {/* Left panel */}
      <div className={styles.leftPanel}>
        <div className={styles.leftContent}>
          <Link to="/" className={styles.brandLogo}>
            <img src="/images/logo.png" alt="Workverra"
              onError={(e) => { e.target.style.display = 'none' }} />
            <span className={styles.brandText}>Work<strong>verra</strong></span>
          </Link>
          <div className={styles.leftHero}>
            <h2 className={styles.leftTitle}>
              India's most trusted<br />
              <span>hyperlocal talent</span><br />
              marketplace
            </h2>
            <p className={styles.leftSub}>
              Connect with verified workers across 200+ cities in Tier 2 &amp; 3 India.
            </p>
          </div>
          <div className={styles.trustCards}>
            {[
              { icon: '🔐', title: 'OTP Verified',  desc: 'Every account is phone-verified' },
              { icon: '💳', title: 'UPI Payments',  desc: 'Safe escrow-based payments' },
              { icon: '⭐', title: '4.8★ Rating',   desc: 'Trusted by 10,000+ users' },
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

      {/* Right panel */}
      <div className={styles.rightPanel}>
        <div className={styles.formWrap}>

          {/* Role toggle */}
          <div className={styles.roleToggle}>
            {['employer', 'worker'].map(r => (
              <button key={r}
                className={`${styles.roleBtn} ${role === r ? styles.roleActive : ''}`}
                onClick={() => setRole(r)} type="button">
                {r === 'employer' ? "I'm an Employer" : "I'm a Worker"}
              </button>
            ))}
          </div>

          {/* Phone step */}
          {step === 'phone' && (
            <div className={styles.formCard}>
              <div className={styles.formHeader}>
                <h1 className={styles.formTitle}>Welcome back</h1>
                <p className={styles.formSub}>Enter your mobile number to continue</p>
              </div>

              {/* Google Sign In */}
              <button
                type="button"
                className={styles.googleBtn}
                onClick={handleGoogleLogin}
              >
                <svg width="18" height="18" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                Continue with Google
              </button>

              <div className={styles.divider}>
                <span className={styles.dividerLine}></span>
                <span className={styles.dividerText}>or sign in with mobile</span>
                <span className={styles.dividerLine}></span>
              </div>

              <form onSubmit={handlePhoneSubmit} className={styles.form}>
                <div className={styles.phoneInputWrap}>
                  <div className={styles.countryCode}>
                    <span className={styles.flag}>🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    className={styles.phoneInput}
                    placeholder="98765 43210"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setError('') }}
                    maxLength={10}
                    autoFocus
                  />
                </div>
                {error && <p className={styles.errorMsg}>⚠ {error}</p>}
                <button
                  type="submit"
                  className={`${styles.submitBtn} ${loading ? styles.loading : ''}`}
                  disabled={loading || phone.length !== 10}
                >
                  {loading ? <span className={styles.spinner}></span> : 'Send OTP →'}
                </button>
                <p className={styles.formNote}>
                  New to Workverra?{' '}
                  <Link to={`/register?role=${role}`} className={styles.link}>Create an account</Link>
                </p>
              </form>
            </div>
          )}

          {/* OTP step */}
          {step === 'otp' && (
            <div className={styles.formCard}>
              <button
                className={styles.backBtn}
                onClick={() => { setStep('phone'); setOtp(['','','','','','']); setError('') }}
                type="button"
              >← Back</button>
              <div className={styles.formHeader}>
                <h1 className={styles.formTitle}>Verify OTP</h1>
                <p className={styles.formSub}>
                  Sent to <strong>+91 {phone}</strong>
                </p>
              </div>
              <form onSubmit={handleOtpSubmit} className={styles.form}>
                <div className={styles.otpRow} onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (otpRefs.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className={`${styles.otpBox} ${digit ? styles.otpFilled : ''} ${success ? styles.otpSuccess : ''}`}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    />
                  ))}
                </div>
                {error   && <p className={styles.errorMsg}>⚠ {error}</p>}
                {success && <p className={styles.successMsg}>✓ Verified! Redirecting...</p>}
                <button
                  type="submit"
                  className={`${styles.submitBtn} ${loading ? styles.loading : ''} ${success ? styles.successBtn : ''}`}
                  disabled={loading || otp.join('').length !== 6}
                >
                  {loading && !success
                    ? <span className={styles.spinner}></span>
                    : success ? '✓ Verified!' : 'Verify & Login'}
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
            By continuing, you agree to Workverra's{' '}
            <Link to="/policy" className={styles.link}>Terms of Service</Link> and{' '}
            <Link to="/policy" className={styles.link}>Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
