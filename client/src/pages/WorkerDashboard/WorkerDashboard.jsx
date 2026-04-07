import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import API from '../../api/axios'
import { formatCurrency, SKILLS_LIST, CITIES, BOOKING_STATUS } from '../../utils/dummyData'
import styles from './WorkerDashboard.module.css'

const STATUS_META = BOOKING_STATUS

const WorkerDashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  // ── All hooks at top level in correct order ──────────────
  const [tab,         setTab]         = useState('overview')
  const [notifList,   setNotifList]   = useState([])
  const [jobsList,    setJobsList]    = useState([])
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [profileData, setProfileData] = useState(null)
  const [editLoading, setEditLoading] = useState(false)
  const [editSuccess, setEditSuccess] = useState(false)
  const [editForm, setEditForm] = useState({
    name:      user?.name  || '',
    skill:     user?.skill || '',
    city:      user?.city  || '',
    about:     '',
    hourlyRate: 0,
    available: true,
  })

  // ── Fetch real data on mount ─────────────────────────────
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [profileRes, bookingsRes, notifRes] = await Promise.all([
          API.get('/workers/profile'),
          API.get('/workers/bookings'),
          API.get('/notifications').catch(() => ({ data: [] })),
        ])
        const p = profileRes.data
        setProfileData(p)
        setEditForm({
          name:       p.name       || user?.name  || '',
          skill:      p.skill      || '',
          city:       p.city       || user?.city  || '',
          about:      p.about      || '',
          hourlyRate: p.hourlyRate || 0,
          available:  p.isAvailable ?? true,
        })
        setJobsList(bookingsRes.data || [])
        setNotifList(notifRes.data   || [])
      } catch (err) {
        console.warn('Dashboard load:', err.message)
      }
    }
    fetchDashboard()
  }, [])

  // ── Derived stats ────────────────────────────────────────
  const totalEarnings  = jobsList.filter(b => b.paymentStatus === 'released').reduce((s, b) => s + (b.amount || 0), 0)
  const pendingPay     = jobsList.filter(b => b.paymentStatus === 'held').reduce((s, b) => s + (b.amount || 0), 0)
  const completedJobs  = jobsList.filter(b => b.status === 'completed').length
  const pendingJobs    = jobsList.filter(b => b.status === 'pending').length
  const unread         = notifList.filter(n => !n.isRead && !n.read).length
  const avgRating      = profileData?.avgRating ?? 0

  // ── Handlers ─────────────────────────────────────────────
  const handleAccept = async (id) => {
    try { await API.put(`/bookings/${id}/status`, { action: 'accept' }) } catch (_) {}
    setJobsList(j => j.map(b => (b._id === id || b.id === id) ? { ...b, status: 'confirmed' } : b))
  }

  const handleReject = async (id) => {
    if (!window.confirm('Reject this booking request?')) return
    try { await API.put(`/bookings/${id}/status`, { action: 'reject' }) } catch (_) {}
    setJobsList(j => j.map(b => (b._id === id || b.id === id) ? { ...b, status: 'rejected' } : b))
  }

  const handleEditSave = async (e) => {
    e.preventDefault()
    setEditLoading(true)
    try {
      await API.put('/workers/profile', editForm)
      setEditSuccess(true)
      setTimeout(() => setEditSuccess(false), 2500)
    } catch (_) {}
    setEditLoading(false)
  }

  const markAllRead = () => setNotifList(n => n.map(x => ({ ...x, read: true, isRead: true })))

  const displayName = profileData?.name || user?.name || 'Worker'
  const displaySkill = profileData?.skill || user?.skill || ''
  const displayCity  = profileData?.city  || user?.city  || ''
  const initials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  const tabs = [
    { id: 'overview',      label: 'Overview',      icon: '📊' },
    { id: 'jobs',          label: 'My Jobs',        icon: '🔨', badge: pendingJobs },
    { id: 'earnings',      label: 'Earnings',       icon: '💰' },
    { id: 'profile',       label: 'Edit Profile',   icon: '👤' },
    { id: 'notifications', label: 'Notifications',  icon: '🔔', badge: unread },
  ]

  return (
    <div className={styles.page}>

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarTop}>
          <div className={styles.userAvatar}
            style={{ background: 'linear-gradient(135deg,#667eea,#764ba2)' }}>
            {initials}
          </div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{displayName}</div>
            <div className={styles.userRole}>{displaySkill}{displayCity ? ` · ${displayCity}` : ''}</div>
            {avgRating > 0 && (
              <div className={styles.userRating}>{'★'.repeat(Math.floor(avgRating))} {avgRating.toFixed(1)}</div>
            )}
          </div>
        </div>
        <nav className={styles.nav}>
          {tabs.map(t => (
            <button key={t.id}
              className={`${styles.navItem} ${tab === t.id ? styles.navActive : ''}`}
              onClick={() => { setTab(t.id); setMenuOpen(false) }}>
              <span className={styles.navIcon}>{t.icon}</span>
              <span>{t.label}</span>
              {t.badge > 0 && <span className={styles.navBadge}>{t.badge}</span>}
            </button>
          ))}
        </nav>
        <div className={styles.availToggleWrap}>
          <label className={styles.availLabel}>Available for work</label>
          <div className={`${styles.toggle} ${editForm.available ? styles.toggleOn : ''}`}
            onClick={() => setEditForm(f => ({ ...f, available: !f.available }))}>
            <div className={styles.toggleKnob} />
          </div>
        </div>
        <button className={styles.logoutBtn} onClick={logout}>🚪 Sign Out</button>
      </aside>

      {/* Mobile header */}
      <div className={styles.mobileHeader}>
        <button className={styles.menuBtn} onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        <span className={styles.mobileTitle}>Work<strong>verra</strong></span>
      </div>

      <main className={styles.main}>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h1 className={styles.pageTitle}>Hey {displayName.split(' ')[0]} 👋</h1>
              <p className={styles.pageSub}>Here's your work summary today</p>
            </div>
            <div className={styles.statsGrid}>
              {[
                { label: 'Total Earnings',  val: formatCurrency(totalEarnings), icon: '💰', color: '#059669' },
                { label: 'Pending Payout',  val: formatCurrency(pendingPay),    icon: '⏳', color: '#D97706' },
                { label: 'Jobs Completed',  val: completedJobs,                 icon: '✅', color: '#1A56DB' },
                { label: 'Avg Rating',      val: avgRating > 0 ? `${avgRating.toFixed(1)}★` : 'N/A', icon: '⭐', color: '#7C3AED' },
              ].map(s => (
                <div key={s.label} className={styles.statCard}>
                  <div className={styles.statIcon} style={{ color: s.color }}>{s.icon}</div>
                  <div className={styles.statVal}>{s.val}</div>
                  <div className={styles.statLabel}>{s.label}</div>
                </div>
              ))}
            </div>
            {pendingJobs > 0 && (
              <div className={styles.alertBanner}>
                <span>🔔</span>
                <div>
                  <strong>You have {pendingJobs} pending job request{pendingJobs > 1 ? 's' : ''}!</strong>
                  <p>Review and respond to them promptly to maintain your rating.</p>
                </div>
                <button className={styles.alertBtn} onClick={() => setTab('jobs')}>Review Jobs →</button>
              </div>
            )}
          </div>
        )}

        {/* JOBS */}
        {tab === 'jobs' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h1 className={styles.pageTitle}>My Jobs</h1>
              <p className={styles.pageSub}>Manage incoming and ongoing bookings</p>
            </div>
            <div className={styles.bookingsList}>
              {jobsList.map(b => {
                const meta = STATUS_META[b.status] || STATUS_META.pending
                const id = b._id || b.id
                return (
                  <div key={id} className={styles.bookingCard}>
                    <div className={styles.bookingInfo}>
                      <div className={styles.bookingEmployer}>
                        {b.employer?.name || b.employerName || 'Employer'}
                      </div>
                      <div className={styles.bookingMeta}>
                        {b.date && <span>📅 {b.date}</span>}
                        {b.duration && <span>⏱ {b.duration}h</span>}
                        {b.amount && <span>💰 {formatCurrency(b.amount)}</span>}
                      </div>
                      {b.description && <p className={styles.bookingDesc}>{b.description}</p>}
                    </div>
                    <div className={styles.bookingActions}>
                      <span className={styles.statusBadge}
                        style={{ background: meta.bg, color: meta.color }}>
                        {meta.label}
                      </span>
                      {b.status === 'pending' && (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className={styles.acceptBtn} onClick={() => handleAccept(id)}>✓ Accept</button>
                          <button className={styles.rejectBtn} onClick={() => handleReject(id)}>✕ Reject</button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
              {jobsList.length === 0 && (
                <div className={styles.emptyState}>
                  <span>🔨</span>
                  <p>No job requests yet. Make sure you're set to available!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* EARNINGS */}
        {tab === 'earnings' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h1 className={styles.pageTitle}>Earnings</h1>
              <p className={styles.pageSub}>Track your income and payments</p>
            </div>
            <div className={styles.earningsCards}>
              <div className={styles.earnCard} style={{ background: 'linear-gradient(135deg,#1A56DB,#4338CA)' }}>
                <div className={styles.earnLabel}>Total Earned</div>
                <div className={styles.earnVal}>{formatCurrency(totalEarnings)}</div>
              </div>
              <div className={styles.earnCard} style={{ background: 'linear-gradient(135deg,#059669,#047857)' }}>
                <div className={styles.earnLabel}>Completed Jobs</div>
                <div className={styles.earnVal}>{completedJobs}</div>
              </div>
              <div className={styles.earnCard} style={{ background: 'linear-gradient(135deg,#D97706,#B45309)' }}>
                <div className={styles.earnLabel}>Pending Payout</div>
                <div className={styles.earnVal}>{formatCurrency(pendingPay)}</div>
              </div>
            </div>
            <h3 className={styles.subTitle}>Transaction History</h3>
            <div className={styles.bookingsList}>
              {jobsList.filter(b => b.paymentStatus).map(b => (
                <div key={b._id || b.id} className={styles.bookingCard}>
                  <div className={styles.bookingInfo}>
                    <div className={styles.bookingEmployer}>
                      {b.employer?.name || b.employerName || 'Employer'}
                    </div>
                    <div className={styles.bookingMeta}>
                      {b.date && <span>📅 {b.date}</span>}
                    </div>
                  </div>
                  <div className={styles.bookingActions}>
                    <div className={styles.payAmount}>{formatCurrency(b.amount || 0)}</div>
                    <span className={styles.statusBadge}
                      style={{
                        background: b.paymentStatus === 'released' ? '#D1FAE5' : '#FFF8E7',
                        color:      b.paymentStatus === 'released' ? '#065F46' : '#92400E',
                      }}>
                      {b.paymentStatus === 'released' ? '✓ Received' : '⏳ Held'}
                    </span>
                  </div>
                </div>
              ))}
              {jobsList.filter(b => b.paymentStatus).length === 0 && (
                <div className={styles.emptyState}><span>💰</span><p>No transactions yet.</p></div>
              )}
            </div>
          </div>
        )}

        {/* EDIT PROFILE */}
        {tab === 'profile' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h1 className={styles.pageTitle}>Edit Profile</h1>
              <p className={styles.pageSub}>Keep your profile updated to attract more bookings</p>
            </div>
            <form onSubmit={handleEditSave} className={styles.profileForm}>
              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Full Name</label>
                  <input className={styles.input} value={editForm.name}
                    onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Primary Skill</label>
                  <select className={styles.input} value={editForm.skill}
                    onChange={e => setEditForm(f => ({ ...f, skill: e.target.value }))}>
                    <option value="">Select skill</option>
                    {SKILLS_LIST.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>City</label>
                  <select className={styles.input} value={editForm.city}
                    onChange={e => setEditForm(f => ({ ...f, city: e.target.value }))}>
                    <option value="">Select city</option>
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Hourly Rate (₹)</label>
                  <input type="number" className={styles.input} value={editForm.hourlyRate}
                    onChange={e => setEditForm(f => ({ ...f, hourlyRate: Number(e.target.value) }))} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>About You</label>
                <textarea className={`${styles.input} ${styles.textarea}`} rows={4}
                  value={editForm.about}
                  onChange={e => setEditForm(f => ({ ...f, about: e.target.value }))} />
              </div>
              <button type="submit"
                className={`${styles.saveBtn} ${editSuccess ? styles.saveBtnSuccess : ''}`}
                disabled={editLoading}>
                {editLoading ? 'Saving…' : editSuccess ? '✓ Saved!' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {/* NOTIFICATIONS */}
        {tab === 'notifications' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h1 className={styles.pageTitle}>Notifications</h1>
                <p className={styles.pageSub}>{unread} unread</p>
              </div>
              {unread > 0 && (
                <button className={styles.markAllBtn} onClick={markAllRead}>Mark all read</button>
              )}
            </div>
            <div className={styles.notifList}>
              {notifList.map(n => (
                <div key={n._id || n.id}
                  className={`${styles.notifCard} ${(!n.isRead && !n.read) ? styles.notifUnread : ''}`}
                  onClick={() => setNotifList(list =>
                    list.map(x => (x._id === n._id || x.id === n.id) ? { ...x, read: true, isRead: true } : x)
                  )}>
                  <div className={styles.notifIcon}>
                    {n.type === 'booking' ? '📋' : n.type === 'payment' ? '💰' : '⭐'}
                  </div>
                  <div className={styles.notifBody}>
                    <div className={styles.notifTitle}>{n.title || n.type}</div>
                    <div className={styles.notifMsg}>{n.message}</div>
                    <div className={styles.notifTime}>{n.createdAt ? new Date(n.createdAt).toLocaleDateString('en-IN') : ''}</div>
                  </div>
                  {(!n.isRead && !n.read) && <div className={styles.notifDot} />}
                </div>
              ))}
              {notifList.length === 0 && (
                <div className={styles.emptyState}><span>🔔</span><p>No notifications yet.</p></div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default WorkerDashboard
