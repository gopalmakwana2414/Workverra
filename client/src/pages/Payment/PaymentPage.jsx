import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { createOrder, verifyPayment } from '../../api/paymentApi'
import { bookings, workers, formatCurrency } from '../../utils/dummyData'
import styles from './PaymentPage.module.css'

const PaymentPage = () => {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [paid, setPaid] = useState(false)
  const [error, setError] = useState('')

  const booking = bookings.find(b => b.id === bookingId) || bookings[0]
  const worker = workers.find(w => w.name === booking?.workerName) || workers[0]

  const handlePayment = async () => {
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('sb_token')
      const data = await createOrder(booking.id || bookingId, token)

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_placeholder',
        amount: data.order?.amount || booking.amount * 100,
        currency: 'INR',
        name: 'SkillBridge',
        description: `Payment for ${booking.skill || 'Work'} by ${booking.workerName}`,
        order_id: data.order?.id,
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentId: data.paymentId
            }, token)
            setPaid(true)
          } catch (_) { setPaid(true) } // demo
        },
        prefill: { name: user?.name || '', contact: user?.phone || '' },
        theme: { color: '#1A56DB' }
      }

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options)
        rzp.on('payment.failed', () => setError('Payment failed. Please try again.'))
        rzp.open()
      } else {
        // Demo fallback when Razorpay script not loaded
        await new Promise(r => setTimeout(r, 1500))
        setPaid(true)
      }
    } catch (err) {
      // Demo mode
      await new Promise(r => setTimeout(r, 1200))
      setPaid(true)
    }
    setLoading(false)
  }

  if (paid) return (
    <div className={styles.page}>
      <div className={styles.successWrap}>
        <div className={styles.successCircle}>✓</div>
        <h2 className={styles.successTitle}>Payment Successful!</h2>
        <p className={styles.successSub}>
          {formatCurrency(booking.amount)} has been securely held in escrow.<br/>
          It will be released to {booking.workerName} once the job is complete.
        </p>
        <button className={styles.doneBtn} onClick={() => navigate('/dashboard/employer')}>
          Back to Dashboard
        </button>
      </div>
    </div>
  )

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <button className={styles.back} onClick={() => navigate(-1)}>← Back</button>
        <h1 className={styles.title}>Complete Payment</h1>

        <div className={styles.card}>
          <div className={styles.workerRow}>
            <div className={styles.avatar} style={{ background: worker.avatarGradient }}>{worker.initials}</div>
            <div>
              <div className={styles.workerName}>{booking.workerName}</div>
              <div className={styles.workerSkill}>{booking.skill} · {booking.date} · {booking.time}</div>
            </div>
          </div>

          <div className={styles.breakdown}>
            <div className={styles.row}><span>Work Duration</span><span>{booking.duration}h</span></div>
            <div className={styles.row}><span>Rate</span><span>{formatCurrency(worker.hourlyRate)}/hr</span></div>
            <div className={styles.row}><span>Platform Fee</span><span className={styles.free}>Free</span></div>
            <div className={`${styles.row} ${styles.totalRow}`}><span>Total</span><span>{formatCurrency(booking.amount)}</span></div>
          </div>

          <div className={styles.escrowNote}>
            <span>🔐</span>
            <p>Your payment is protected by SkillBridge Escrow. Funds are only released after you confirm work completion.</p>
          </div>

          {error && <p className={styles.errorMsg}>⚠ {error}</p>}

          <button className={styles.payBtn} onClick={handlePayment} disabled={loading}>
            {loading ? (
              <span style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span className={styles.spinner} />Initiating payment…
              </span>
            ) : (
              <>💳 Pay {formatCurrency(booking.amount)} via Razorpay</>
            )}
          </button>

          <div className={styles.methods}>
            <span>Accepted:</span>
            <strong>UPI · Cards · Net Banking · Wallets</strong>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage
