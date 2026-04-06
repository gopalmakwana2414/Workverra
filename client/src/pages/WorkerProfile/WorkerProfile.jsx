import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import API from '../../api/axios'
import { workers, reviews, formatCurrency } from '../../utils/dummyData'
import styles from './WorkerProfile.module.css'

const TIMES = ['08:00 AM','09:00 AM','10:00 AM','11:00 AM','12:00 PM',
               '01:00 PM','02:00 PM','03:00 PM','04:00 PM','05:00 PM','06:00 PM']

const StarPicker = ({ value, onChange }) => (
  <div style={{ display:'flex', gap:4 }}>
    {[1,2,3,4,5].map(s => (
      <button key={s} type="button"
        onClick={() => onChange(s)}
        style={{ fontSize:'1.5rem', background:'none', border:'none', cursor:'pointer',
                 color: s <= value ? '#F59E0B' : '#d1d5db', padding:2 }}>★</button>
    ))}
  </div>
)

const WorkerProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const worker = workers.find(w => w.id === id) || workers[0]
  const workerReviews = reviews?.filter(r => r.workerId === worker.id) || []

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  const [bookingOpen, setBookingOpen] = useState(false)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [bookingForm, setBookingForm] = useState({ date:'', time:'10:00 AM', duration:'2', description:'', address:'' })
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [errors, setErrors] = useState({})
  const [reviewForm, setReviewForm] = useState({ stars:5, comment:'' })
  const [reviewSuccess, setReviewSuccess] = useState(false)
  const [reviewList, setReviewList] = useState(workerReviews)

  const estimatedTotal = worker.hourlyRate * parseInt(bookingForm.duration || 1)

  const validateBooking = () => {
    const e = {}
    if (!bookingForm.date) e.date = 'Select a date'
    if (!bookingForm.description.trim()) e.description = 'Describe the work'
    if (!bookingForm.address.trim()) e.address = 'Enter your address'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleBook = async (e) => {
    e.preventDefault()
    if (!validateBooking()) return
    if (!isAuthenticated) { navigate('/login'); return }
    setBookingLoading(true)
    try {
      await API.post('/bookings', {
        workerId: worker.id, ...bookingForm,
        duration: Number(bookingForm.duration), amount: estimatedTotal
      })
    } catch (_) {}
    setBookingLoading(false)
    setBookingSuccess(true)
    setTimeout(() => { setBookingOpen(false); setBookingSuccess(false); navigate('/dashboard/employer') }, 2000)
  }

  const handleReview = async (e) => {
    e.preventDefault()
    if (!reviewForm.comment.trim()) return
    try {
      await API.post('/reviews', { workerId:worker.id, stars:reviewForm.stars, comment:reviewForm.comment })
    } catch (_) {}
    const newReview = {
      id: 'r-' + Date.now(), workerId: worker.id,
      reviewerName: user?.name || 'Anonymous', stars: reviewForm.stars,
      comment: reviewForm.comment, date: 'Just now'
    }
    setReviewList(r => [newReview, ...r])
    setReviewSuccess(true)
    setTimeout(() => { setReviewOpen(false); setReviewSuccess(false); setReviewForm({ stars:5, comment:'' }) }, 1500)
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Back to search</button>

        {/* Profile Header */}
        <div className={styles.headerCard}>
          <div className={styles.avatar} style={{ background:worker.avatarGradient }}>{worker.initials}</div>
          <div className={styles.headerInfo}>
            <div className={styles.nameRow}>
              <h1 className={styles.workerName}>{worker.name}</h1>
              {worker.verified && <span className={styles.verifiedBadge}>✓ Verified</span>}
              {worker.badge && <span className={styles.proBadge}>{worker.badge}</span>}
            </div>
            <div className={styles.skillRow}>{worker.skill} · {worker.city} · {worker.experience} yrs exp</div>
            <div className={styles.ratingRow}>
              <span className={styles.stars}>{'★'.repeat(Math.floor(worker.rating))}</span>
              <strong>{worker.rating}</strong>
              <span>({worker.totalReviews} reviews)</span>
              <span>·</span>
              <span>{worker.jobsDone} jobs</span>
            </div>
          </div>
          <div className={styles.headerRate}>
            <div className={styles.rateVal}>{formatCurrency(worker.hourlyRate)}</div>
            <div className={styles.rateLabel}>per hour</div>
            <div className={`${styles.availPill} ${worker.available ? styles.availOn : styles.availOff}`}>
              {worker.available ? '● Available' : '○ Busy'}
            </div>
          </div>
        </div>

        <div className={styles.bodyGrid}>
          {/* Left col */}
          <div className={styles.leftCol}>
            {/* About */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>About</h3>
              <p className={styles.aboutText}>{worker.about}</p>
            </div>

            {/* Skills */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Skills & Services</h3>
              <div className={styles.skillChips}>
                {worker.skills?.map(s => <span key={s} className={styles.chip}>{s}</span>)}
              </div>
            </div>

            {/* Reviews */}
            <div className={styles.card}>
              <div className={styles.reviewHeader}>
                <h3 className={styles.cardTitle}>Reviews ({reviewList.length})</h3>
                {isAuthenticated && user?.role === 'employer' && (
                  <button className={styles.addReviewBtn} onClick={() => setReviewOpen(true)}>+ Add Review</button>
                )}
              </div>
              {reviewList.length === 0 && <p style={{ color:'#9ca3af' }}>No reviews yet.</p>}
              {reviewList.map(r => (
                <div key={r.id} className={styles.reviewCard}>
                  <div className={styles.reviewTop}>
                    <div className={styles.reviewAvatar}>{r.reviewerName?.charAt(0) || 'A'}</div>
                    <div>
                      <div className={styles.reviewerName}>{r.reviewerName}</div>
                      <div className={styles.reviewStars}>{'★'.repeat(r.stars)}{'☆'.repeat(5-r.stars)}</div>
                    </div>
                    <span className={styles.reviewDate}>{r.date}</span>
                  </div>
                  <p className={styles.reviewComment}>{r.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right col */}
          <div className={styles.rightCol}>
            <div className={styles.stickyCard}>
              <div className={styles.priceRow}>
                <span className={styles.price}>{formatCurrency(worker.hourlyRate)}</span>
                <span className={styles.perHr}>/hr</span>
              </div>
              <div className={styles.metaList}>
                <div className={styles.metaItem}><span>⏱</span><span>Responds {worker.responseTime}</span></div>
                <div className={styles.metaItem}><span>✅</span><span>{worker.successRate} success rate</span></div>
                <div className={styles.metaItem}><span>📅</span><span>Member since {worker.joinedDate}</span></div>
              </div>
              <button
                className={styles.bookBtn}
                disabled={!worker.available}
                onClick={() => isAuthenticated ? setBookingOpen(true) : navigate('/login')}>
                {worker.available ? '📋 Book Now' : '○ Currently Unavailable'}
              </button>
              {!isAuthenticated && (
                <p className={styles.loginHint}>
                  <a href="/login" style={{ color:'#1A56DB' }}>Login</a> to book this worker
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {bookingOpen && (
        <div className={styles.overlay} onClick={() => !bookingLoading && setBookingOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            {bookingSuccess ? (
              <div style={{ textAlign:'center', padding:'20px 0' }}>
                <div style={{ fontSize:'3rem', marginBottom:12 }}>🎉</div>
                <h3 style={{ fontFamily:"'Sora',sans-serif", color:'#059669', marginBottom:8 }}>Request Sent!</h3>
                <p style={{ color:'#6b7280' }}>{worker.name} will respond within {worker.responseTime}.</p>
              </div>
            ) : (
              <>
                <div className={styles.modalHeader}>
                  <h2>Book {worker.name}</h2>
                  <button onClick={() => setBookingOpen(false)} className={styles.closeBtn}>✕</button>
                </div>
                <form onSubmit={handleBook} className={styles.bookForm}>
                  <div className={styles.bookRow}>
                    <div className={styles.bookField}>
                      <label>Date *</label>
                      <input type="date" min={minDate} value={bookingForm.date}
                        onChange={e => setBookingForm(f=>({...f,date:e.target.value}))}
                        className={errors.date?styles.inputErr:''} />
                      {errors.date && <span className={styles.errTxt}>{errors.date}</span>}
                    </div>
                    <div className={styles.bookField}>
                      <label>Time</label>
                      <select value={bookingForm.time} onChange={e => setBookingForm(f=>({...f,time:e.target.value}))}>
                        {TIMES.map(t=><option key={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className={styles.bookField}>
                    <label>Duration</label>
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                      {[1,2,3,4,6,8].map(h=>(
                        <button key={h} type="button"
                          onClick={() => setBookingForm(f=>({...f,duration:String(h)}))}
                          style={{
                            padding:'6px 14px', border:'1.5px solid',
                            borderColor:bookingForm.duration==h?'#1A56DB':'#e5e7eb',
                            background:bookingForm.duration==h?'#1A56DB':'#fff',
                            color:bookingForm.duration==h?'#fff':'#374151',
                            borderRadius:8, cursor:'pointer', fontSize:'.875rem', fontWeight:500
                          }}>{h}h</button>
                      ))}
                    </div>
                  </div>
                  <div className={styles.bookField}>
                    <label>Work Description *</label>
                    <textarea rows={3} placeholder="Describe what needs to be done..."
                      value={bookingForm.description}
                      onChange={e => setBookingForm(f=>({...f,description:e.target.value}))}
                      className={errors.description?styles.inputErr:''} />
                    {errors.description && <span className={styles.errTxt}>{errors.description}</span>}
                  </div>
                  <div className={styles.bookField}>
                    <label>Your Address *</label>
                    <input placeholder="Full address for the work"
                      value={bookingForm.address}
                      onChange={e => setBookingForm(f=>({...f,address:e.target.value}))}
                      className={errors.address?styles.inputErr:''} />
                    {errors.address && <span className={styles.errTxt}>{errors.address}</span>}
                  </div>
                  <div className={styles.bookSummary}>
                    <span>Estimated: {formatCurrency(estimatedTotal)}</span>
                    <span style={{ fontSize:'.8rem', color:'#6b7280' }}>({bookingForm.duration}h × {formatCurrency(worker.hourlyRate)})</span>
                  </div>
                  <button type="submit" className={styles.confirmBtn} disabled={bookingLoading}>
                    {bookingLoading ? 'Sending…' : 'Confirm Request'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewOpen && (
        <div className={styles.overlay} onClick={() => setReviewOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()} style={{ maxWidth:440 }}>
            {reviewSuccess ? (
              <div style={{ textAlign:'center', padding:'20px 0' }}>
                <div style={{ fontSize:'3rem', marginBottom:12 }}>⭐</div>
                <h3 style={{ fontFamily:"'Sora',sans-serif", color:'#059669' }}>Review submitted!</h3>
              </div>
            ) : (
              <>
                <div className={styles.modalHeader}>
                  <h2>Rate {worker.name}</h2>
                  <button onClick={() => setReviewOpen(false)} className={styles.closeBtn}>✕</button>
                </div>
                <form onSubmit={handleReview} className={styles.bookForm}>
                  <div className={styles.bookField}>
                    <label>Your Rating</label>
                    <StarPicker value={reviewForm.stars} onChange={s => setReviewForm(f=>({...f,stars:s}))} />
                  </div>
                  <div className={styles.bookField}>
                    <label>Your Review</label>
                    <textarea rows={4} placeholder="Share your experience with this worker..."
                      value={reviewForm.comment}
                      onChange={e => setReviewForm(f=>({...f,comment:e.target.value}))} />
                  </div>
                  <button type="submit" className={styles.confirmBtn}
                    disabled={!reviewForm.comment.trim()}>Submit Review</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default WorkerProfile
