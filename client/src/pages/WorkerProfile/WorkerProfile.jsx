import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { workers, reviews, formatCurrency } from '../../utils/dummyData'
import styles from './WorkerProfile.module.css'

const WorkerProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const worker = workers.find(w => w.id === id) || workers[0]
  const workerReviews = reviews.filter(r => r.workerId === worker.id)

  const [bookingOpen, setBookingOpen] = useState(false)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [bookingForm, setBookingForm] = useState({
    date: '', time: '10:00 AM', duration: '2', description: ''
  })
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)

  const [reviewForm, setReviewForm] = useState({ stars: 5, comment: '' })
  const [reviewSuccess, setReviewSuccess] = useState(false)

  const estimatedTotal = worker.hourlyRate * parseInt(bookingForm.duration || 1)

  const handleBook = async (e) => {
    e.preventDefault()
    setBookingLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    setBookingLoading(false)
    setBookingSuccess(true)
    setTimeout(() => {
      setBookingOpen(false)
      setBookingSuccess(false)
      navigate('/dashboard/employer')
    }, 1800)
  }

  const handleReview = async (e) => {
    e.preventDefault()
    await new Promise(r => setTimeout(r, 800))
    setReviewSuccess(true)
    setTimeout(() => {
      setReviewOpen(false)
      setReviewSuccess(false)
    }, 1500)
  }

  const times = ['08:00 AM','09:00 AM','10:00 AM','11:00 AM','12:00 PM',
                 '01:00 PM','02:00 PM','03:00 PM','04:00 PM','05:00 PM','06:00 PM']

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* ── Profile Header ── */}
        <div className={styles.profileHeader}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>← Back to search</button>

          <div className={styles.headerCard}>
            <div className={styles.avatar} style={{ background: worker.avatarGradient }}>
              {worker.initials}
            </div>

            <div className={styles.workerMain}>
              <div className={styles.nameRow}>
                <h1 className={styles.name}>{worker.name}</h1>
                {worker.verified && <span className={styles.verifiedBadge}>✓ Verified</span>}
                {worker.badge && <span className={styles.proBadge}>{worker.badge}</span>}
              </div>
              <p className={styles.workerMeta}>
                {worker.skill} · {worker.experience} years experience · 📍 {worker.city}, {worker.pinCode}
              </p>
              <div className={styles.ratingRow}>
                <span className={styles.stars}>{'★'.repeat(Math.floor(worker.rating))}</span>
                <span className={styles.ratingVal}>{worker.rating}</span>
                <span className={styles.reviewCount}>({worker.totalReviews} reviews)</span>
                <span className={styles.sep}>·</span>
                <span className={styles.jobsDone}>{worker.jobsDone} jobs done</span>
              </div>
              <div className={styles.quickStats}>
                <div className={styles.qStat}>
                  <span className={styles.qIcon}>⚡</span>
                  <span>{worker.responseTime} response</span>
                </div>
                <div className={styles.qStat}>
                  <span className={styles.qIcon}>✅</span>
                  <span>{worker.successRate} success rate</span>
                </div>
                <div className={styles.qStat}>
                  <span className={styles.qIcon}>📅</span>
                  <span>Member since {worker.joinedDate}</span>
                </div>
              </div>
            </div>

            <div className={styles.bookingBox}>
              <div className={styles.rateDisplay}>
                <span className={styles.rateVal}>{formatCurrency(worker.hourlyRate)}</span>
                <span className={styles.rateLabel}>/hr</span>
              </div>
              <div className={`${styles.availStatus} ${worker.available ? styles.avGreen : styles.avGray}`}>
                {worker.available ? '● Available Now' : '○ Currently Busy'}
              </div>
              <button
                className={styles.bookBtn}
                onClick={() => setBookingOpen(true)}
                disabled={!worker.available}
              >
                {worker.available ? '📋 Book Now' : 'Currently Unavailable'}
              </button>
              <button className={styles.reviewBtn} onClick={() => setReviewOpen(true)}>
                ⭐ Leave a Review
              </button>
            </div>
          </div>
        </div>

        <div className={styles.body}>

          {/* ── Left Column ── */}
          <div className={styles.leftCol}>

            {/* About */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>About</h2>
              <p className={styles.aboutText}>{worker.about}</p>
            </section>

            {/* Skills */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Skills & Expertise</h2>
              <div className={styles.skillsGrid}>
                {worker.skills.map(s => (
                  <span key={s} className={styles.skillChip}>{s}</span>
                ))}
              </div>
            </section>

            {/* Stats */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Work Stats</h2>
              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <div className={styles.statVal}>{worker.jobsDone}+</div>
                  <div className={styles.statLabel}>Jobs Completed</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statVal}>{worker.rating}★</div>
                  <div className={styles.statLabel}>Average Rating</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statVal}>{worker.totalReviews}</div>
                  <div className={styles.statLabel}>Total Reviews</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statVal}>{worker.successRate}</div>
                  <div className={styles.statLabel}>Success Rate</div>
                </div>
              </div>
            </section>

            {/* Reviews */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Reviews ({worker.totalReviews})</h2>
              {workerReviews.length === 0 ? (
                <p className={styles.noReviews}>No reviews yet for this worker.</p>
              ) : (
                <div className={styles.reviewsList}>
                  {workerReviews.map(r => (
                    <div key={r.id} className={styles.reviewCard}>
                      <div className={styles.reviewTop}>
                        <div className={styles.reviewerAvatar}>{r.initials}</div>
                        <div>
                          <div className={styles.reviewerName}>{r.employerName}</div>
                          <div className={styles.reviewMeta}>
                            <span className={styles.reviewStars}>{'★'.repeat(r.stars)}</span>
                            <span className={styles.reviewDate}>{r.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className={styles.reviewComment}>{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* ── Right Column: sticky booking card on desktop ── */}
          <aside className={styles.rightCol}>
            <div className={styles.stickyCard}>
              <div className={styles.cardRateRow}>
                <span className={styles.cardRateVal}>{formatCurrency(worker.hourlyRate)}</span>
                <span className={styles.cardRateLabel}>/hr</span>
              </div>
              <div className={`${styles.availStatus} ${worker.available ? styles.avGreen : styles.avGray}`}>
                {worker.available ? '● Available Now' : '○ Currently Busy'}
              </div>
              <div className={styles.cardMeta}>
                <div className={styles.cardMetaRow}><span>⚡ Response time</span><strong>{worker.responseTime}</strong></div>
                <div className={styles.cardMetaRow}><span>📍 Location</span><strong>{worker.city}</strong></div>
                <div className={styles.cardMetaRow}><span>✅ Success rate</span><strong>{worker.successRate}</strong></div>
              </div>
              <button
                className={styles.bookBtnLarge}
                onClick={() => setBookingOpen(true)}
                disabled={!worker.available}
              >
                {worker.available ? '📋 Book Now' : 'Currently Unavailable'}
              </button>
              <button className={styles.reviewBtnLarge} onClick={() => setReviewOpen(true)}>
                ⭐ Write a Review
              </button>
            </div>
          </aside>

        </div>
      </div>

      {/* ── Booking Modal ── */}
      {bookingOpen && (
        <div className={styles.modalOverlay} onClick={() => !bookingLoading && !bookingSuccess && setBookingOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            {bookingSuccess ? (
              <div className={styles.modalSuccess}>
                <div className={styles.successIcon}>🎉</div>
                <h3>Booking Sent!</h3>
                <p>Your request has been sent to {worker.name}. You'll be notified when they confirm.</p>
              </div>
            ) : (
              <>
                <div className={styles.modalHead}>
                  <h2 className={styles.modalTitle}>Book {worker.name}</h2>
                  <button className={styles.closeBtn} onClick={() => setBookingOpen(false)}>✕</button>
                </div>
                <form onSubmit={handleBook} className={styles.modalForm}>
                  <div className={styles.mField}>
                    <label className={styles.mLabel}>Preferred Date</label>
                    <input type="date" className={styles.mInput} required
                      min={new Date().toISOString().split('T')[0]}
                      value={bookingForm.date}
                      onChange={e => setBookingForm(f => ({ ...f, date: e.target.value }))} />
                  </div>
                  <div className={styles.mRow}>
                    <div className={styles.mField}>
                      <label className={styles.mLabel}>Time</label>
                      <select className={styles.mSelect} value={bookingForm.time}
                        onChange={e => setBookingForm(f => ({ ...f, time: e.target.value }))}>
                        {times.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className={styles.mField}>
                      <label className={styles.mLabel}>Duration (hrs)</label>
                      <select className={styles.mSelect} value={bookingForm.duration}
                        onChange={e => setBookingForm(f => ({ ...f, duration: e.target.value }))}>
                        {[1,2,3,4,5,6,7,8].map(h => <option key={h} value={h}>{h}h</option>)}
                      </select>
                    </div>
                  </div>
                  <div className={styles.mField}>
                    <label className={styles.mLabel}>Job Description</label>
                    <textarea className={styles.mTextarea} rows={3} required
                      placeholder="Describe the work needed..."
                      value={bookingForm.description}
                      onChange={e => setBookingForm(f => ({ ...f, description: e.target.value }))} />
                  </div>

                  <div className={styles.estimateRow}>
                    <span>Estimated Total</span>
                    <strong>{formatCurrency(estimatedTotal)}</strong>
                  </div>
                  <p className={styles.estimateNote}>Payment held in escrow until job is completed.</p>

                  <button type="submit" className={`${styles.mSubmit} ${bookingLoading ? styles.mLoading : ''}`}
                    disabled={bookingLoading}>
                    {bookingLoading ? <span className={styles.spinner} /> : '🚀 Confirm Booking Request'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Review Modal ── */}
      {reviewOpen && (
        <div className={styles.modalOverlay} onClick={() => setReviewOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            {reviewSuccess ? (
              <div className={styles.modalSuccess}>
                <div className={styles.successIcon}>⭐</div>
                <h3>Review Submitted!</h3>
                <p>Thank you for your feedback. It helps other employers.</p>
              </div>
            ) : (
              <>
                <div className={styles.modalHead}>
                  <h2 className={styles.modalTitle}>Review {worker.name}</h2>
                  <button className={styles.closeBtn} onClick={() => setReviewOpen(false)}>✕</button>
                </div>
                <form onSubmit={handleReview} className={styles.modalForm}>
                  <div className={styles.mField}>
                    <label className={styles.mLabel}>Rating</label>
                    <div className={styles.starPicker}>
                      {[1,2,3,4,5].map(s => (
                        <button key={s} type="button"
                          className={`${styles.starBtn} ${s <= reviewForm.stars ? styles.starFilled : ''}`}
                          onClick={() => setReviewForm(f => ({ ...f, stars: s }))}>★</button>
                      ))}
                      <span className={styles.starLabel}>{reviewForm.stars}/5</span>
                    </div>
                  </div>
                  <div className={styles.mField}>
                    <label className={styles.mLabel}>Your Comment</label>
                    <textarea className={styles.mTextarea} rows={4} required
                      placeholder="Describe your experience with this worker..."
                      value={reviewForm.comment}
                      onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))} />
                  </div>
                  <button type="submit" className={styles.mSubmit}>Submit Review</button>
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
