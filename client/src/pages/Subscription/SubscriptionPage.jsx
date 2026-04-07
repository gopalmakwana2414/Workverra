import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import API from '../../api/axios'
import { PLANS, formatCurrency } from '../../utils/dummyData'
import styles from './SubscriptionPage.module.css'

const SubscriptionPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab]       = useState(user?.role || 'worker')
  const [paying, setPaying] = useState(null)
  const [success, setSuccess] = useState(null)

  const plans = PLANS[tab] || PLANS.worker

  const handleSubscribe = async (plan) => {
    if (plan.price === 0) {
      navigate('/register')
      return
    }
    if (!user) {
      navigate('/login')
      return
    }
    setPaying(plan.id)
    try {
      // Create Razorpay order
      const res = await API.post('/payments/create-order', {
        amount: plan.price,
        planId: plan.id,
      })

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: plan.price * 100,
        currency: 'INR',
        name: 'Workverra',
        description: `${plan.label} Plan - ${tab === 'worker' ? 'Worker' : 'Employer'}`,
        order_id: res.data.orderId,
        prefill: {
          name: user.name,
          contact: user.phone,
        },
        theme: { color: '#1A56DB' },
        handler: async (response) => {
          try {
            await API.post('/payments/verify-subscription', {
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              planId: plan.id,
            })
            setSuccess(plan)
          } catch (_) {
            alert('Payment verification failed. Contact support.')
          }
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      alert(err.response?.data?.message || 'Could not initiate payment. Try again.')
    }
    setPaying(null)
  }

  if (success) {
    return (
      <div className={styles.successPage}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>🎉</div>
          <h2 className={styles.successTitle}>Subscription Activated!</h2>
          <p className={styles.successSub}>
            Your <strong>{success.label}</strong> plan is now active.
            Enjoy all premium features.
          </p>
          <button
            className={styles.successBtn}
            onClick={() => navigate(user?.role === 'worker' ? '/dashboard/worker' : '/dashboard/employer')}
          >
            Go to Dashboard →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroBadge}>Simple, transparent pricing</div>
        <h1 className={styles.heroTitle}>Choose your plan</h1>
        <p className={styles.heroSub}>
          Start free. Upgrade when you're ready. Cancel anytime.
        </p>
        <div className={styles.tabRow}>
          {[
            { key: 'worker',   label: '🔧 I am a Worker' },
            { key: 'employer', label: '🏢 I am an Employer' },
          ].map(t => (
            <button
              key={t.key}
              className={`${styles.tabBtn} ${tab === t.key ? styles.tabActive : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div className={styles.plansWrap}>
        <div className={styles.plansGrid}>
          {plans.map((plan, idx) => {
            const isPopular = idx === 1
            const isFree    = plan.price === 0
            return (
              <div
                key={plan.id}
                className={`${styles.planCard} ${isPopular ? styles.planPopular : ''}`}
              >
                {isPopular && <div className={styles.popularBadge}>⭐ Most Popular</div>}

                <div className={styles.planHeader}>
                  <div className={styles.planLabel}>{plan.label}</div>
                  <div className={styles.planPrice}>
                    {isFree ? (
                      <span className={styles.priceFree}>Free</span>
                    ) : (
                      <>
                        <span className={styles.priceSymbol}>₹</span>
                        <span className={styles.priceNum}>{plan.price}</span>
                        <span className={styles.pricePeriod}>/{plan.period}</span>
                      </>
                    )}
                  </div>
                  {!isFree && (
                    <div className={styles.planSavings}>
                      {plan.period === 'year' ? `Save ₹${(plan.price / 12 < (tab === 'worker' ? 49 : 99)) ? (tab === 'worker' ? 49 * 12 - plan.price : 99 * 12 - plan.price) : 0}` : ''}
                    </div>
                  )}
                </div>

                <ul className={styles.featureList}>
                  {plan.features.map(f => (
                    <li key={f} className={styles.featureItem}>
                      <span className={styles.checkIcon}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  className={`${styles.planBtn} ${isPopular ? styles.planBtnPrimary : styles.planBtnSecondary} ${isFree ? styles.planBtnFree : ''}`}
                  onClick={() => handleSubscribe(plan)}
                  disabled={paying === plan.id}
                >
                  {paying === plan.id ? (
                    <span className={styles.btnSpinner} />
                  ) : isFree ? (
                    'Get Started Free'
                  ) : (
                    `Subscribe — ₹${plan.price}/${plan.period}`
                  )}
                </button>
              </div>
            )
          })}
        </div>

        {/* FAQ */}
        <div className={styles.faqSection}>
          <h3 className={styles.faqTitle}>Frequently Asked Questions</h3>
          <div className={styles.faqGrid}>
            {[
              { q: 'Can I cancel anytime?',         a: 'Yes. Cancel your subscription at any time from your dashboard. No hidden fees.' },
              { q: 'What happens after free limit?', a: 'After your free usage limit, you will be prompted to upgrade to continue using the platform.' },
              { q: 'Is my payment secure?',          a: 'All payments are processed via Razorpay with bank-grade security and encryption.' },
              { q: 'Can I switch plans?',            a: 'Yes. Upgrade or downgrade your plan at any time. Changes take effect immediately.' },
            ].map(item => (
              <div key={item.q} className={styles.faqItem}>
                <div className={styles.faqQ}>{item.q}</div>
                <div className={styles.faqA}>{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionPage
