import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { createOrder, verifyPayment } from '../../api/paymentApi'
import styles from './PaymentPage.module.css'

const PaymentPage = () => {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [paid, setPaid] = useState(false)
  const [error, setError] = useState('')
  const [bookingData, setBookingData] = useState(null)

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    return () => document.body.removeChild(script)
  }, [])

  const handlePayment = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await createOrder(bookingId)
      const { order, paymentId } = res.data

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'Workverra',
        description: 'Worker Booking Payment',
        order_id: order.id,
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentId,
            })
            setPaid(true)
          } catch (err) {
            setError('Payment verification failed. Contact support.')
          }
        },
        prefill: {
          name: user?.name || '',
          contact: user?.phone ? `+91${user.phone}` : '',
        },
        theme: { color: '#1A56DB' },
        modal: {
          ondismiss: () => setLoading(false),
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', (response) => {
        setError(`Payment failed: ${response.error.description}`)
        setLoading(false)
      })
      rzp.open()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initiate payment. Please try again.')
      setLoading(false)
    }
  }

  if (paid) return (
    <div className={styles.page}>
      <div className={styles.successWrap}>
        <div className={styles.successCircle}>✓</div>
        <h2 className={styles.successTitle}>Payment Successful!</h2>
        <p className={styles.successSub}>
          Your payment has been securely processed.<br />
          Funds will be released to the worker once the job is complete.
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
          <div className={styles.escrowNote}>
            <span>🔐</span>
            <p>Your payment is protected by Workverra Escrow. Funds are only released after you confirm work completion.</p>
          </div>

          {error && <p className={styles.errorMsg}>⚠ {error}</p>}

          <button className={styles.payBtn} onClick={handlePayment} disabled={loading}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className={styles.spinner} />Initiating payment…
              </span>
            ) : (
              <>💳 Pay via Razorpay</>
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
