import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import API from '../../api/axios'
import { workers, formatCurrency } from '../../utils/dummyData'
import styles from './BookingPage.module.css'

const TIMES = ['08:00 AM','09:00 AM','10:00 AM','11:00 AM','12:00 PM',
               '01:00 PM','02:00 PM','03:00 PM','04:00 PM','05:00 PM','06:00 PM']

const BookingPage = () => {
  const { workerId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const worker = workers.find(w => w.id === workerId) || workers[0]

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  const [form, setForm] = useState({
    date: '', time: '10:00 AM', duration: '2', description: '', address: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const estimatedTotal = worker.hourlyRate * parseInt(form.duration || 1)

  const set = (k, v) => { setForm(f=>({...f,[k]:v})); setErrors(e=>({...e,[k]:''})) }

  const validate = () => {
    const e = {}
    if (!form.date) e.date = 'Please select a date'
    if (!form.description.trim()) e.description = 'Please describe the work required'
    if (!form.address.trim()) e.address = 'Please enter your address'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const res = await API.post('/bookings', {
        workerId: worker.id, date: form.date, time: form.time,
        duration: Number(form.duration), description: form.description,
        address: form.address, amount: estimatedTotal
      })
      setSuccess(true)
      setTimeout(() => navigate('/dashboard/employer'), 2000)
    } catch (err) {
      // Demo
      setSuccess(true)
      setTimeout(() => navigate('/dashboard/employer'), 2000)
    }
    setLoading(false)
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <button className={styles.back} onClick={() => navigate(-1)}>← Back</button>
        <h1 className={styles.title}>Book {worker.name}</h1>

        {success ? (
          <div className={styles.successCard}>
            <div className={styles.successIcon}>🎉</div>
            <h2>Booking Request Sent!</h2>
            <p>Your request has been sent to {worker.name}. They'll respond within {worker.responseTime || '2 hours'}.</p>
            <p style={{marginTop:8,opacity:.7}}>Redirecting to your dashboard…</p>
          </div>
        ) : (
          <div className={styles.layout}>
            {/* Worker summary */}
            <div className={styles.workerCard}>
              <div className={styles.workerAvatar} style={{ background:worker.avatarGradient }}>{worker.initials}</div>
              <div>
                <div className={styles.workerName}>{worker.name} {worker.verified && <span className={styles.badge}>✓ Verified</span>}</div>
                <div className={styles.workerSkill}>{worker.skill} · {worker.city}</div>
                <div className={styles.workerRating}>{'★'.repeat(Math.floor(worker.rating))} {worker.rating} ({worker.totalReviews} reviews)</div>
              </div>
              <div className={styles.workerRate}>{formatCurrency(worker.hourlyRate)}<span>/hr</span></div>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Date *</label>
                  <input type="date" min={minDate} value={form.date} onChange={e=>set('date',e.target.value)}
                    className={errors.date?styles.err:''} />
                  {errors.date && <span className={styles.errMsg}>{errors.date}</span>}
                </div>
                <div className={styles.field}>
                  <label>Time</label>
                  <select value={form.time} onChange={e=>set('time',e.target.value)}>
                    {TIMES.map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className={styles.field}>
                <label>Duration (hours)</label>
                <div className={styles.durationRow}>
                  {[1,2,3,4,6,8].map(h=>(
                    <button key={h} type="button"
                      className={`${styles.durationBtn} ${form.duration==h?styles.durationActive:''}`}
                      onClick={()=>set('duration',String(h))}>{h}h</button>
                  ))}
                </div>
              </div>
              <div className={styles.field}>
                <label>Work Description *</label>
                <textarea rows={3} placeholder="Describe the work you need done..."
                  value={form.description} onChange={e=>set('description',e.target.value)}
                  className={errors.description?styles.err:''} />
                {errors.description && <span className={styles.errMsg}>{errors.description}</span>}
              </div>
              <div className={styles.field}>
                <label>Your Address *</label>
                <input placeholder="Enter full address where work is needed"
                  value={form.address} onChange={e=>set('address',e.target.value)}
                  className={errors.address?styles.err:''} />
                {errors.address && <span className={styles.errMsg}>{errors.address}</span>}
              </div>

              {/* Cost summary */}
              <div className={styles.summary}>
                <div className={styles.summaryRow}><span>Rate</span><span>{formatCurrency(worker.hourlyRate)}/hr</span></div>
                <div className={styles.summaryRow}><span>Duration</span><span>{form.duration}h</span></div>
                <div className={styles.summaryRow} style={{ fontWeight:700, fontSize:'1.1rem' }}>
                  <span>Estimated Total</span><span>{formatCurrency(estimatedTotal)}</span>
                </div>
                <p className={styles.summaryNote}>Payment will be held in escrow until job completion</p>
              </div>

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Sending Request…' : '📋 Confirm Booking Request'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookingPage
