import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { bookings, workerNotifications, workers, formatCurrency, SKILLS_LIST, CITIES } from '../../utils/dummyData'
import styles from './WorkerDashboard.module.css'

// The logged-in worker (demo)
const ME_WORKER = workers[0] // Mohan Kumar

const STATUS_COLORS = {
  pending:   { bg:'#FFF8E7', color:'#92400E', label:'Pending' },
  confirmed: { bg:'#EBF2FF', color:'#1344B8', label:'Confirmed' },
  completed: { bg:'#D1FAE5', color:'#065F46', label:'Completed' },
  rejected:  { bg:'#FEF2F2', color:'#991B1B', label:'Rejected' },
}

const WorkerDashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [notifList, setNotifList] = useState(workerNotifications)
  const [editForm, setEditForm] = useState({
    name: ME_WORKER.name,
    skill: ME_WORKER.skill,
    city: ME_WORKER.city,
    about: ME_WORKER.about,
    hourlyRate: ME_WORKER.hourlyRate,
    available: ME_WORKER.available,
  })
  const [editLoading, setEditLoading] = useState(false)
  const [editSuccess, setEditSuccess] = useState(false)

  const myJobs = bookings  // in real app, filtered to this worker
  const totalEarnings = myJobs.filter(b => b.paymentStatus === 'released').reduce((s, b) => s + b.amount, 0)
  const pendingPayment = myJobs.filter(b => b.paymentStatus === 'held').reduce((s, b) => s + b.amount, 0)
  const completedJobs = myJobs.filter(b => b.status === 'completed').length
  const pendingJobs = myJobs.filter(b => b.status === 'pending').length
  const unreadCount = notifList.filter(n => !n.read).length

  const handleAccept = (id) => alert(`Booking ${id} accepted! (Demo — connect to backend to persist)`)
  const handleReject = (id) => alert(`Booking ${id} rejected. (Demo)`)

  const handleEditSave = async (e) => {
    e.preventDefault()
    setEditLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    setEditLoading(false)
    setEditSuccess(true)
    setTimeout(() => setEditSuccess(false), 2500)
  }

  const tabs = [
    { id: 'overview',      label: 'Overview',      icon: '📊' },
    { id: 'jobs',          label: 'My Jobs',        icon: '🔨', badge: pendingJobs },
    { id: 'earnings',      label: 'Earnings',       icon: '💰' },
    { id: 'profile',       label: 'Edit Profile',   icon: '👤' },
    { id: 'notifications', label: 'Notifications',  icon: '🔔', badge: unreadCount },
  ]

  return (
    <div className={styles.page}>
      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.userAvatar} style={{ background: ME_WORKER.avatarGradient }}>
            {ME_WORKER.initials}
          </div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{ME_WORKER.name}</div>
            <div className={styles.userRole}>{ME_WORKER.skill} · {ME_WORKER.city}</div>
            <div className={styles.userRating}>{'★'.repeat(Math.floor(ME_WORKER.rating))} {ME_WORKER.rating}</div>
          </div>
        </div>

        <nav className={styles.nav}>
          {tabs.map(tab => (
            <button key={tab.id}
              className={`${styles.navItem} ${activeTab === tab.id ? styles.navActive : ''}`}
              onClick={() => setActiveTab(tab.id)}>
              <span className={styles.navIcon}>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.badge > 0 && <span className={styles.navBadge}>{tab.badge}</span>}
            </button>
          ))}
        </nav>

        <div className={styles.availToggle}>
          <span className={styles.availLabel}>Available for jobs</span>
          <label className={styles.toggle}>
            <input type="checkbox" checked={editForm.available}
              onChange={e => setEditForm(f => ({ ...f, available: e.target.checked }))} />
            <span className={styles.toggleSlider}></span>
          </label>
        </div>

        <button className={styles.logoutBtn} onClick={() => navigate('/')}>← Back to Home</button>
      </aside>

      {/* ── Main Content ── */}
      <main className={styles.main}>

        {/* ── OVERVIEW ── */}
        {activeTab === 'overview' && (
          <div>
            <div className={styles.pageHeader}>
              <div>
                <h1 className={styles.pageTitle}>Welcome back, {ME_WORKER.name.split(' ')[0]} 👋</h1>
                <p className={styles.pageSub}>{ME_WORKER.skill} · {ME_WORKER.city}</p>
              </div>
              <span className={`${styles.availPill} ${editForm.available ? styles.green : styles.gray}`}>
                {editForm.available ? '● Available' : '○ Unavailable'}
              </span>
            </div>

            {/* Stats */}
            <div className={styles.statCards}>
              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: '#D1FAE5' }}>💰</div>
                <div>
                  <div className={styles.statVal}>{formatCurrency(totalEarnings)}</div>
                  <div className={styles.statLabel}>Total Earned</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: '#EBF2FF' }}>⏳</div>
                <div>
                  <div className={styles.statVal}>{formatCurrency(pendingPayment)}</div>
                  <div className={styles.statLabel}>In Escrow</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: '#FFF8E7' }}>🔨</div>
                <div>
                  <div className={styles.statVal}>{completedJobs}</div>
                  <div className={styles.statLabel}>Jobs Completed</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: '#ECFDF5' }}>⭐</div>
                <div>
                  <div className={styles.statVal}>{ME_WORKER.rating}</div>
                  <div className={styles.statLabel}>Avg Rating</div>
                </div>
              </div>
            </div>

            {/* Pending Jobs */}
            {pendingJobs > 0 && (
              <div className={styles.alertBanner}>
                <span className={styles.alertIcon}>📋</span>
                <div>
                  <strong>{pendingJobs} new booking request{pendingJobs > 1 ? 's' : ''}</strong> waiting for your response.
                </div>
                <button className={styles.alertBtn} onClick={() => setActiveTab('jobs')}>
                  View Jobs →
                </button>
              </div>
            )}

            {/* Recent Jobs */}
            <div className={styles.section}>
              <div className={styles.sectionHead}>
                <h2 className={styles.sectionTitle}>Recent Jobs</h2>
                <button className={styles.seeAll} onClick={() => setActiveTab('jobs')}>See all →</button>
              </div>
              <JobsList jobs={myJobs.slice(0, 4)} onAccept={handleAccept} onReject={handleReject} />
            </div>

            {/* Profile Snapshot */}
            <div className={styles.section}>
              <div className={styles.sectionHead}>
                <h2 className={styles.sectionTitle}>Your Profile</h2>
                <button className={styles.seeAll} onClick={() => setActiveTab('profile')}>Edit →</button>
              </div>
              <div className={styles.profileSnap}>
                <div className={styles.snapAvatar} style={{ background: ME_WORKER.avatarGradient }}>
                  {ME_WORKER.initials}
                </div>
                <div className={styles.snapInfo}>
                  <div className={styles.snapName}>{ME_WORKER.name}</div>
                  <div className={styles.snapMeta}>{ME_WORKER.skill} · {ME_WORKER.experience} yrs · {ME_WORKER.city}</div>
                  <div className={styles.snapSkills}>
                    {ME_WORKER.skills.map(s => (
                      <span key={s} className={styles.snapSkill}>{s}</span>
                    ))}
                  </div>
                </div>
                <div className={styles.snapRate}>{formatCurrency(ME_WORKER.hourlyRate)}<span>/hr</span></div>
              </div>
            </div>
          </div>
        )}

        {/* ── MY JOBS ── */}
        {activeTab === 'jobs' && (
          <div>
            <div className={styles.pageHeader}>
              <div>
                <h1 className={styles.pageTitle}>My Jobs</h1>
                <p className={styles.pageSub}>{myJobs.length} total bookings</p>
              </div>
            </div>
            <div className={styles.section}>
              <JobsList jobs={myJobs} onAccept={handleAccept} onReject={handleReject} showActions />
            </div>
          </div>
        )}

        {/* ── EARNINGS ── */}
        {activeTab === 'earnings' && (
          <div>
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>Earnings</h1>
              <p className={styles.pageSub}>Your payment history</p>
            </div>

            <div className={styles.earningsCards}>
              <div className={styles.earnCard} style={{ borderTop: '4px solid #059669' }}>
                <div className={styles.earnIcon}>💰</div>
                <div className={styles.earnVal}>{formatCurrency(totalEarnings)}</div>
                <div className={styles.earnLabel}>Total Released</div>
              </div>
              <div className={styles.earnCard} style={{ borderTop: '4px solid #1A56DB' }}>
                <div className={styles.earnIcon}>⏳</div>
                <div className={styles.earnVal}>{formatCurrency(pendingPayment)}</div>
                <div className={styles.earnLabel}>Held in Escrow</div>
              </div>
              <div className={styles.earnCard} style={{ borderTop: '4px solid #F59E0B' }}>
                <div className={styles.earnIcon}>📊</div>
                <div className={styles.earnVal}>{formatCurrency(ME_WORKER.hourlyRate)}</div>
                <div className={styles.earnLabel}>Current Rate/hr</div>
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Payment History</h2>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Job</th>
                      <th>Date</th>
                      <th>Duration</th>
                      <th>Amount</th>
                      <th>Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myJobs.map(b => (
                      <tr key={b.id}>
                        <td className={styles.tdJob}>{b.jobDescription}</td>
                        <td className={styles.tdDate}>{b.date}</td>
                        <td>{b.duration}h</td>
                        <td className={styles.tdAmount}>{formatCurrency(b.amount)}</td>
                        <td>
                          <span className={styles.payPill} style={{
                            background: b.paymentStatus === 'released' ? '#D1FAE5'
                              : b.paymentStatus === 'held' ? '#EBF2FF'
                              : b.paymentStatus === 'refunded' ? '#FEF2F2' : '#F3F4F6',
                            color: b.paymentStatus === 'released' ? '#065F46'
                              : b.paymentStatus === 'held' ? '#1344B8'
                              : b.paymentStatus === 'refunded' ? '#991B1B' : '#6B7280',
                          }}>
                            {b.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.escrowNote}>
              <span className={styles.escrowIcon}>🔒</span>
              <div>
                <strong>How Escrow Works</strong>
                <p>Employers pay upfront into a secure escrow. Funds are released to you once the job is marked complete. This protects both parties.</p>
              </div>
            </div>
          </div>
        )}

        {/* ── EDIT PROFILE ── */}
        {activeTab === 'profile' && (
          <div>
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>Edit Profile</h1>
              <p className={styles.pageSub}>Employers see this information when browsing workers</p>
            </div>
            <div className={styles.section} style={{ maxWidth: 600 }}>
              {editSuccess && (
                <div className={styles.successBanner}>✓ Profile updated successfully!</div>
              )}
              <form onSubmit={handleEditSave} className={styles.editForm}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Full Name</label>
                  <input className={styles.formInput} value={editForm.name}
                    onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Primary Skill</label>
                    <select className={styles.formSelect} value={editForm.skill}
                      onChange={e => setEditForm(f => ({ ...f, skill: e.target.value }))}>
                      {SKILLS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>City</label>
                    <select className={styles.formSelect} value={editForm.city}
                      onChange={e => setEditForm(f => ({ ...f, city: e.target.value }))}>
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>Hourly Rate (₹)</label>
                  <input type="number" className={styles.formInput} value={editForm.hourlyRate}
                    onChange={e => setEditForm(f => ({ ...f, hourlyRate: +e.target.value }))} />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>About You</label>
                  <textarea className={styles.formTextarea} rows={4} value={editForm.about}
                    onChange={e => setEditForm(f => ({ ...f, about: e.target.value }))} />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>Availability</label>
                  <label className={styles.checkLabel}>
                    <input type="checkbox" checked={editForm.available}
                      onChange={e => setEditForm(f => ({ ...f, available: e.target.checked }))} />
                    Mark me as available for new bookings
                  </label>
                </div>

                <button type="submit"
                  className={`${styles.submitBtn} ${editLoading ? styles.loading : ''}`}
                  disabled={editLoading}>
                  {editLoading ? <span className={styles.spinner} /> : '💾 Save Changes'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── NOTIFICATIONS ── */}
        {activeTab === 'notifications' && (
          <div>
            <div className={styles.pageHeader}>
              <div>
                <h1 className={styles.pageTitle}>Notifications</h1>
                <p className={styles.pageSub}>{unreadCount} unread</p>
              </div>
              {unreadCount > 0 && (
                <button className={styles.markRead}
                  onClick={() => setNotifList(n => n.map(x => ({ ...x, read: true })))}>
                  Mark all as read
                </button>
              )}
            </div>
            <div className={styles.section}>
              {notifList.map(n => (
                <div key={n.id}
                  className={`${styles.notifRow} ${!n.read ? styles.notifUnread : ''}`}
                  onClick={() => setNotifList(list => list.map(x => x.id === n.id ? { ...x, read: true } : x))}>
                  <span className={styles.notifIcon}>{n.icon}</span>
                  <div className={styles.notifText}>
                    <p className={styles.notifMsg}>{n.message}</p>
                    <span className={styles.notifTime}>{n.time}</span>
                  </div>
                  {!n.read && <span className={styles.unreadDot} />}
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  )
}

/* ── Jobs List Sub-Component ── */
const JobsList = ({ jobs, onAccept, onReject, showActions }) => (
  <div className={styles.jobsList}>
    {jobs.map(b => {
      const s = STATUS_COLORS[b.status] || STATUS_COLORS.pending
      return (
        <div key={b.id} className={styles.jobCard}>
          <div className={styles.jobTop}>
            <div className={styles.jobInfo}>
              <div className={styles.jobTitle}>{b.jobDescription}</div>
              <div className={styles.jobMeta}>
                {b.workerName && <span>👤 {b.workerName} (Employer)</span>}
                <span>📅 {b.date} at {b.time}</span>
                <span>⏱ {b.duration}h</span>
              </div>
            </div>
            <div className={styles.jobRight}>
              <div className={styles.jobAmount}>{formatCurrency(b.amount)}</div>
              <span className={styles.statusPill} style={{ background: s.bg, color: s.color }}>{s.label}</span>
            </div>
          </div>
          {showActions && b.status === 'pending' && (
            <div className={styles.jobActions}>
              <button className={styles.acceptBtn} onClick={() => onAccept(b.id)}>✓ Accept</button>
              <button className={styles.rejectBtn} onClick={() => onReject(b.id)}>✕ Decline</button>
            </div>
          )}
        </div>
      )
    })}
  </div>
)

export default WorkerDashboard
