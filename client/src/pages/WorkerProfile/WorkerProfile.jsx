import { useParams, useNavigate } from 'react-router-dom'
import { getWorkerById, getReviewsByWorkerId, formatCurrency } from '../../utils/dummyData'
import styles from './WorkerProfile.module.css'

const WorkerProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const worker = getWorkerById(id)
  const reviews = worker ? getReviewsByWorkerId(worker.id) : []

  if (!worker) return (
    <div className={styles.notFound}>
      <h2>Worker not found</h2>
      <button onClick={() => navigate('/search')}>← Back to Search</button>
    </div>
  )

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {/* Back */}
        <button className={styles.backBtn} onClick={() => navigate('/search')}>
          ← Back to Search
        </button>

        <div className={styles.layout}>
          {/* Left: Main info */}
          <div className={styles.main}>
            {/* Profile header */}
            <div className={styles.profileCard}>
              <div className={styles.profileTop}>
                <div className={styles.avatarWrap}>
                  <div className={styles.avatar} style={{ background: worker.avatarGradient }}>
                    {worker.initials}
                  </div>
                  <span className={`${styles.availDot} ${worker.available ? styles.green : styles.gray}`}></span>
                </div>
                <div className={styles.profileInfo}>
                  <div className={styles.nameRow}>
                    <h1 className={styles.workerName}>{worker.name}</h1>
                    {worker.verified && <span className={styles.verifiedBadge}>✓ Verified</span>}
                    {worker.badge && <span className={styles.proBadge}>{worker.badge}</span>}
                  </div>
                  <p className={styles.workerSkill}>{worker.skill} · {worker.experience} years experience</p>
                  <p className={styles.workerCity}>📍 {worker.city}, {worker.state} · {worker.distance}</p>
                  <div className={styles.ratingRow}>
                    <span className={styles.stars}>{'★'.repeat(Math.floor(worker.rating))}</span>
                    <span className={styles.ratingVal}>{worker.rating}</span>
                    <span className={styles.reviewCount}>({worker.totalReviews} reviews)</span>
                    <span className={styles.separator}>·</span>
                    <span className={styles.jobs}>{worker.totalJobs} jobs done</span>
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className={styles.statsRow}>
                <div className={styles.stat}>
                  <div className={styles.statVal}>{formatCurrency(worker.hourlyRate)}</div>
                  <div className={styles.statLabel}>Per Hour</div>
                </div>
                <div className={styles.statDivider}></div>
                <div className={styles.stat}>
                  <div className={styles.statVal}>{worker.totalJobs}+</div>
                  <div className={styles.statLabel}>Jobs Done</div>
                </div>
                <div className={styles.statDivider}></div>
                <div className={styles.stat}>
                  <div className={styles.statVal}>{worker.rating}★</div>
                  <div className={styles.statLabel}>Rating</div>
                </div>
                <div className={styles.statDivider}></div>
                <div className={styles.stat}>
                  <div className={styles.statVal}>{worker.responseTime}</div>
                  <div className={styles.statLabel}>Response Time</div>
                </div>
              </div>
            </div>

            {/* About */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>About</h2>
              <p className={styles.aboutText}>{worker.about}</p>
            </div>

            {/* Skills */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Skills & Specializations</h2>
              <div className={styles.skillTags}>
                {worker.skills.map(s => (
                  <span key={s} className={styles.skillTag}>{s}</span>
                ))}
              </div>
            </div>

            {/* Languages + Certifications */}
            <div className={styles.twoCol}>
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Languages</h2>
                <div className={styles.langTags}>
                  {worker.languages.map(l => (
                    <span key={l} className={styles.langTag}>{l}</span>
                  ))}
                </div>
              </div>
              {worker.certifications.length > 0 && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>Certifications</h2>
                  <div className={styles.certList}>
                    {worker.certifications.map(c => (
                      <div key={c} className={styles.certItem}>
                        <span className={styles.certIcon}>🎓</span> {c}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reviews */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Reviews ({reviews.length})</h2>
              {reviews.length === 0 ? (
                <p className={styles.noReviews}>No reviews yet for this worker.</p>
              ) : (
                <div className={styles.reviewsList}>
                  {reviews.map(r => (
                    <div key={r.id} className={styles.reviewCard}>
                      <div className={styles.reviewTop}>
                        <div className={styles.reviewAvatar} style={{ background: r.reviewerColor }}>
                          {r.reviewerInitials}
                        </div>
                        <div>
                          <div className={styles.reviewName}>{r.reviewerName}</div>
                          <div className={styles.reviewMeta}>
                            <span className={styles.reviewStars}>{'★'.repeat(r.rating)}</span>
                            <span className={styles.reviewJob}>{r.jobType}</span>
                            <span className={styles.reviewDate}>{r.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className={styles.reviewComment}>{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Booking sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.bookingCard}>
              <div className={styles.bookingRate}>
                {formatCurrency(worker.hourlyRate)}<span>/hr</span>
              </div>

              <div className={styles.availStatus}>
                <span className={`${styles.availDotSm} ${worker.available ? styles.green : styles.gray}`}></span>
                {worker.available ? 'Available now' : 'Currently unavailable'}
              </div>

              <div className={styles.bookingFields}>
                <div className={styles.bookField}>
                  <label className={styles.bookLabel}>Date</label>
                  <input type="date" className={styles.bookInput}
                    min={new Date().toISOString().split('T')[0]} />
                </div>
                <div className={styles.bookField}>
                  <label className={styles.bookLabel}>Time</label>
                  <select className={styles.bookInput}>
                    {['09:00 AM','10:00 AM','11:00 AM','12:00 PM','02:00 PM','03:00 PM','04:00 PM','05:00 PM'].map(t =>
                      <option key={t}>{t}</option>
                    )}
                  </select>
                </div>
                <div className={styles.bookField}>
                  <label className={styles.bookLabel}>Duration (hours)</label>
                  <select className={styles.bookInput}>
                    {[1,2,3,4,6,8].map(h => <option key={h} value={h}>{h} hour{h>1?'s':''}</option>)}
                  </select>
                </div>
                <div className={styles.bookField}>
                  <label className={styles.bookLabel}>Job Description</label>
                  <textarea className={styles.bookTextarea} rows={3}
                    placeholder="Describe the work you need done..." />
                </div>
              </div>

              <div className={styles.estimateRow}>
                <span>Estimated Cost</span>
                <span className={styles.estimateVal}>{formatCurrency(worker.hourlyRate * 2)}</span>
              </div>

              <button
                className={styles.bookBtn}
                onClick={() => navigate('/login')}
                disabled={!worker.available}
              >
                {worker.available ? '📋 Send Booking Request' : 'Worker Unavailable'}
              </button>

              <p className={styles.bookNote}>
                💳 Payment held securely via Razorpay escrow. Released after job completion.
              </p>
            </div>

            {/* Quick stats */}
            <div className={styles.quickStats}>
              <div className={styles.qStat}>
                <span className={styles.qIcon}>⚡</span>
                <span>Responds {worker.responseTime}</span>
              </div>
              <div className={styles.qStat}>
                <span className={styles.qIcon}>✅</span>
                <span>{worker.totalJobs} jobs completed</span>
              </div>
              <div className={styles.qStat}>
                <span className={styles.qIcon}>📍</span>
                <span>Based in {worker.city}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkerProfile
