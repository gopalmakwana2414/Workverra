import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import API from '../../api/axios'
import { formatCurrency } from '../../utils/dummyData'
import styles from './WorkerProfile.module.css'

const TIMES = [
  '08:00 AM','09:00 AM','10:00 AM','11:00 AM','12:00 PM',
  '01:00 PM','02:00 PM','03:00 PM','04:00 PM','05:00 PM','06:00 PM',
]

const StarPicker = ({ value, onChange }) => (
  <div style={{ display:'flex', gap:4 }}>
    {[1,2,3,4,5].map(s => (
      <button key={s} type="button" onClick={() => onChange(s)}
        style={{
          fontSize:'1.5rem', background:'none', border:'none', cursor:'pointer',
          color: s <= value ? '#F59E0B' : '#d1d5db', padding:2,
        }}>★</button>
    ))}
  </div>
)

const WorkerProfile = () => {
  const { id }      = useParams()
  const navigate    = useNavigate()
  const { isAuthenticated, user } = useAuth()

  const [worker,         setWorker]         = useState(null)
  const [reviewList,     setReviewList]     = useState([])
  const [loadingWorker,  setLoadingWorker]  = useState(true)
  const [notFound,       setNotFound]       = useState(false)

  const [bookingOpen,    setBookingOpen]    = useState(false)
  const [reviewOpen,     setReviewOpen]     = useState(false)
  const [bookingForm,    setBookingForm]    = useState({ date:'', time:'10:00 AM', duration:'2', description:'', address:'' })
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [errors,         setErrors]         = useState({})
  const [reviewForm,     setReviewForm]     = useState({ stars:5, comment:'' })
  const [reviewSuccess,  setReviewSuccess]  = useState(false)

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  // ── Fetch worker from real API ───────────────────────────
  useEffect(() => {
    const fetchWorker = async () => {
      setLoadingWorker(true)
      try {
        const [workerRes, reviewRes] = await Promise.all([
          API.get(`/workers/${id}`),
          API.get(`/reviews/worker/${id}`).catch(() => ({ data: [] })),
        ])
        setWorker(workerRes.data)
        setReviewList(reviewRes.data || [])
      } catch (_) {
        setNotFound(true)
      }
      setLoadingWorker(false)
    }
    fetchWorker()
  }, [id])

  if (loadingWorker) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
        height:'60vh', color:'#1A56DB', gap:12, fontSize:'1rem' }}>
        <div style={{ width:22, height:22, border:'3px solid #dbeafe',
          borderTopColor:'#1A56DB', borderRadius:'50%', animation:'spin .8s linear infinite' }} />
        Loading profile…
      </div>
    )
  }

  if (notFound || !worker) {
    return (
      <div style={{ textAlign:'center', padding:'80px 20px', color:'#6b7280' }}>
        <div style={{ fontSize:'3rem', marginBottom:16 }}>😕</div>
        <h2 style={{ fontFamily:"'Sora',sans-serif", color:'#374151', marginBottom:8 }}>Worker not found</h2>
        <button onClick={() => navigate('/search')}
          style={{ marginTop:16, padding:'10px 24px', background:'#1A56DB', color:'#fff',
            border:'none', borderRadius:8, cursor:'pointer', fontWeight:600 }}>
          Back to Search
        </button>
      </div>
    )
  }

  const initials    = (worker.name || 'WK').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const avgRating   = worker.avgRating ?? worker.rating ?? 0
  const reviewCount = worker.reviewCount ?? worker.totalReviews ?? reviewList.length
  const rate        = worker.hourlyRate ?? 0
  const jobs        = worker.jobsDone ?? worker.completedJobs ?? 0
  const exp         = worker.experience ?? 0
  const available   = worker.isAvailable ?? worker.available ?? true
  const verified    = worker.isVerified  ?? worker.verified  ?? false
  const skillName   = worker.skill ?? (worker.skills?.[0] ?? 'Worker')

  const estimatedTotal = rate * parseInt(bookingForm.duration || 1)

  const validateBooking = () => {
    const e = {}
    if (!bookingForm.date)               e.date        = 'Select a date'
    if (!bookingForm.description.trim()) e.description = 'Describe the work'
    if (!bookingForm.address.trim())     e.address     = 'Enter your address'
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
        workerId:    worker._id || worker.id,
        date:        bookingForm.date,
        time:        bookingForm.time,
        duration:    Number(bookingForm.duration),
        description: bookingForm.description,
        address:     bookingForm.address,
        amount:      estimatedTotal,
      })
      setBookingSuccess(true)
      setTimeout(() => {
        setBookingOpen(false)
        setBookingSuccess(false)
        navigate('/dashboard/employer')
      }, 2000)
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Booking failed. Please try again.' })
    }
    setBookingLoading(false)
  }

  const handleReview = async (e) => {
    e.preventDefault()
    if (!reviewForm.comment.trim()) return
    try {
      const res = await API.post('/reviews', {
        workerId: worker._id || worker.id,
        stars:    reviewForm.stars,
        comment:  reviewForm.comment,
      })
      setReviewList(r => [res.data || {
        _id: `r-${Date.now()}`,
        reviewer: { name: user?.name || 'You' },
        stars: reviewForm.stars,
        comment: reviewForm.comment,
        createdAt: new Date().toISOString(),
      }, ...r])
      setReviewSuccess(true)
      setTimeout(() => {
        setReviewOpen(false)
        setReviewSuccess(false)
        setReviewForm({ stars:5, comment:'' })
      }, 1500)
    } catch (_) {}
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Back to search</button>

        {/* Profile Header */}
        <div className={styles.headerCard}>
          <div className={styles.avatar}
            style={{ background: 'linear-gradient(135deg,#667eea,#764ba2)' }}>
            {initials}
          </div>
          <div className={styles.headerInfo}>
            <div className={styles.nameRow}>
              <h1 className={styles.workerName}>{worker.name}</h1>
              {verified && <span className={styles.verifiedBadge}>✓ Verified</span>}
            </div>
            <div className={styles.skillRow}>
              {skillName} · {worker.city || ''} {exp > 0 ? `· ${exp} yrs exp` : ''}
            </div>
            <div className={styles.ratingRow}>
              {avgRating > 0 && (
                <>
                  <span className={styles.stars}>{'★'.repeat(Math.floor(avgRating))}</span>
                  <strong>{avgRating.toFixed(1)}</strong>
                  <span>({reviewCount} reviews)</span>
                  <span>·</span>
                </>
              )}
              {jobs > 0 && <span>{jobs} jobs done</span>}
            </div>
          </div>
          <div className={styles.headerRate}>
            {rate > 0 && (
              <>
                <div className={styles.rateVal}>{formatCurrency(rate)}</div>
                <div className={styles.rateLabel}>per hour</div>
              </>
            )}
            <div className={`${styles.availPill} ${available ? styles.availOn : styles.availOff}`}>
              {available ? '● Available' : '○ Busy'}
            </div>
          </div>
        </div>

        <div className={styles.bodyGrid}>
          {/* Left col */}
          <div className={styles.leftCol}>
            {worker.about && (
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>About</h3>
                <p className={styles.aboutText}>{worker.about}</p>
              </div>
            )}

            {worker.skills?.length > 0 && (
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>Skills &amp; Services</h3>
                <div className={styles.skillChips}>
                  {worker.skills.map(s => <span key={s} className={styles.chip}>{s}</span>)}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className={styles.card}>
              <div className={styles.reviewHeader}>
                <h3 className={styles.cardTitle}>Reviews ({reviewList.length})</h3>
                {isAuthenticated && user?.role === 'employer' && (
                  <button className={styles.addReviewBtn} onClick={() => setReviewOpen(true)}>
                    + Add Review
                  </button>
                )}
              </div>
              {reviewList.length === 0 && (
                <p style={{ color:'#9ca3af', fontSize:'.875rem' }}>No reviews yet. Be the first!</p>
              )}
              {reviewList.map(r => (
                <div key={r._id || r.id} className={styles.reviewCard}>
                  <div className={styles.reviewTop}>
                    <div className={styles.reviewAvatar}>
                      {(r.reviewer?.name || r.reviewerName || 'A').charAt(0)}
                    </div>
                    <div>
                      <div className={styles.reviewerName}>
                        {r.reviewer?.name || r.reviewerName || 'Anonymous'}
                      </div>
                      <div className={styles.reviewStars}>
                        {'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}
                      </div>
                    </div>
                    <span className={styles.reviewDate}>
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : r.date || ''}
                    </span>
                  </div>
                  <p className={styles.reviewComment}>{r.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right col — sticky booking card */}
          <div className={styles.rightCol}>
            <div className={styles.stickyCard}>
              {rate > 0 && (
                <div className={styles.priceRow}>
                  <span className={styles.price}>{formatCurrency(rate)}</span>
                  <span className={styles.perHr}>/hr</span>
                </div>
              )}
              <div className={styles.metaList}>
                {worker.responseTime && (
                  <div className={styles.metaItem}><span>⏱</span><span>Responds {worker.responseTime}</span></div>
                )}
                {worker.successRate && (
                  <div className={styles.metaItem}><span>✅</span><span>{worker.successRate} success rate</span></div>
                )}
                {worker.joinedDate && (
                  <div className={styles.metaItem}><span>📅</span><span>Member since {worker.joinedDate}</span></div>
                )}
                {worker.pinCode && (
                  <div className={styles.metaItem}><span>📍</span><span>PIN: {worker.pinCode}</span></div>
                )}
              </div>
              <button
                className={styles.bookBtn}
                disabled={!available}
                onClick={() => isAuthenticated ? setBookingOpen(true) : navigate('/login')}
              >
                {available ? '📋 Book Now' : '○ Currently Unavailable'}
              </button>
              {isAuthenticated && (
                <button
                  className={styles.chatBtn}
                  onClick={() => navigate(`/chat/${worker._id || worker.id}`)}
                >
                  💬 Message Worker
                </button>
              )}
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
                <p style={{ color:'#6b7280' }}>Redirecting to your dashboard…</p>
              </div>
            ) : (
              <>
                <div className={styles.modalHeader}>
                  <h2>Book {worker.name}</h2>
                  <button onClick={() => setBookingOpen(false)} className={styles.closeBtn}>✕</button>
                </div>
                {errors.submit && (
                  <div style={{ background:'#FEF2F2', color:'#991B1B', padding:'10px 14px',
                    borderRadius:8, fontSize:'13px', marginBottom:12 }}>
                    ⚠ {errors.submit}
                  </div>
                )}
                <form onSubmit={handleBook} className={styles.bookForm}>
                  <div className={styles.bookRow}>
                    <div className={styles.bookField}>
                      <label>Date *</label>
                      <input type="date" min={minDate} value={bookingForm.date}
                        onChange={e => { setBookingForm(f=>({...f,date:e.target.value})); setErrors(e=>({...e,date:''})) }}
                        className={errors.date ? styles.inputErr : ''} />
                      {errors.date && <span className={styles.errTxt}>{errors.date}</span>}
                    </div>
                    <div className={styles.bookField}>
                      <label>Time</label>
                      <select value={bookingForm.time}
                        onChange={e => setBookingForm(f=>({...f,time:e.target.value}))}>
                        {TIMES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className={styles.bookField}>
                    <label>Duration</label>
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                      {[1,2,3,4,6,8].map(h => (
                        <button key={h} type="button"
                          onClick={() => setBookingForm(f=>({...f,duration:String(h)}))}
                          style={{
                            padding:'6px 14px', border:'1.5px solid',
                            borderColor: bookingForm.duration == h ? '#1A56DB' : '#e5e7eb',
                            background:  bookingForm.duration == h ? '#1A56DB' : '#fff',
                            color:       bookingForm.duration == h ? '#fff' : '#374151',
                            borderRadius:8, cursor:'pointer', fontSize:'.875rem', fontWeight:500,
                          }}>{h}h</button>
                      ))}
                    </div>
                  </div>
                  <div className={styles.bookField}>
                    <label>Work Description *</label>
                    <textarea rows={3} placeholder="Describe what needs to be done..."
                      value={bookingForm.description}
                      onChange={e => { setBookingForm(f=>({...f,description:e.target.value})); setErrors(e=>({...e,description:''})) }}
                      className={errors.description ? styles.inputErr : ''} />
                    {errors.description && <span className={styles.errTxt}>{errors.description}</span>}
                  </div>
                  <div className={styles.bookField}>
                    <label>Your Address *</label>
                    <input placeholder="Full address for the work"
                      value={bookingForm.address}
                      onChange={e => { setBookingForm(f=>({...f,address:e.target.value})); setErrors(e=>({...e,address:''})) }}
                      className={errors.address ? styles.inputErr : ''} />
                    {errors.address && <span className={styles.errTxt}>{errors.address}</span>}
                  </div>
                  {rate > 0 && (
                    <div className={styles.bookSummary}>
                      <span>Estimated: {formatCurrency(estimatedTotal)}</span>
                      <span style={{ fontSize:'.8rem', color:'#6b7280' }}>
                        ({bookingForm.duration}h × {formatCurrency(rate)})
                      </span>
                    </div>
                  )}
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
                    <StarPicker value={reviewForm.stars}
                      onChange={s => setReviewForm(f => ({...f, stars:s}))} />
                  </div>
                  <div className={styles.bookField}>
                    <label>Your Review</label>
                    <textarea rows={4} placeholder="Share your experience with this worker..."
                      value={reviewForm.comment}
                      onChange={e => setReviewForm(f => ({...f, comment:e.target.value}))} />
                  </div>
                  <button type="submit" className={styles.confirmBtn}
                    disabled={!reviewForm.comment.trim()}>
                    Submit Review
                  </button>
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
