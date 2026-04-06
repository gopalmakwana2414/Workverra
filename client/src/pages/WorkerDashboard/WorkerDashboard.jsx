
import { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import API from '../../api/axios'
import { bookings, workerNotifications, workers, formatCurrency, SKILLS_LIST, CITIES } from '../../utils/dummyData'
import styles from './WorkerDashboard.module.css'

const ME = workers[0]
const STATUS_META = {
  pending:   { bg:'#FFF8E7', color:'#92400E', label:'Pending' },
  confirmed: { bg:'#EBF2FF', color:'#1344B8', label:'Confirmed' },
  completed: { bg:'#D1FAE5', color:'#065F46', label:'Completed' },
  rejected:  { bg:'#FEF2F2', color:'#991B1B', label:'Rejected' },
}

const WorkerDashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [tab, setTab] = useState('overview')
  const [notifList, setNotifList] = useState(workerNotifications)
  const [jobsList, setJobsList] = useState(bookings)
  const [menuOpen, setMenuOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    name: user?.name || ME.name,
    skill: ME.skill, city: user?.city || ME.city,
    about: ME.about, hourlyRate: ME.hourlyRate, available: ME.available,
  })
  const [editLoading, setEditLoading] = useState(false)
  const [editSuccess, setEditSuccess] = useState(false)

  const totalEarnings = jobsList.filter(b=>b.paymentStatus==='released').reduce((s,b)=>s+b.amount,0)
  const pendingPay = jobsList.filter(b=>b.paymentStatus==='held').reduce((s,b)=>s+b.amount,0)
  const completedJobs = jobsList.filter(b=>b.status==='completed').length
  const pendingJobs = jobsList.filter(b=>b.status==='pending').length
  const unread = notifList.filter(n=>!n.read).length

  const handleAccept = async (id) => {
    try { await API.put(`/bookings/${id}/status`, { action:'accept' }) } catch (_) {}
    setJobsList(j => j.map(b => (b.id===id||b._id===id) ? { ...b, status:'confirmed' } : b))
  }

  const handleReject = async (id) => {
    if (!confirm('Reject this booking request?')) return
    try { await API.put(`/bookings/${id}/status`, { action:'reject' }) } catch (_) {}
    setJobsList(j => j.map(b => (b.id===id||b._id===id) ? { ...b, status:'rejected' } : b))
  }

  const handleEditSave = async (e) => {
    e.preventDefault()
    setEditLoading(true)
    try { await API.put('/workers/profile', editForm) } catch (_) {}
    await new Promise(r => setTimeout(r, 1000))
    setEditLoading(false)
    setEditSuccess(true)
    setTimeout(() => setEditSuccess(false), 2500)
  }

  const [profileData, setProfileData] = useState(null)

useEffect(() => {
  const fetchDashboard = async () => {
    try {
      const [profileRes, bookingsRes] = await Promise.all([
        API.get('/workers/profile'),
        API.get('/workers/bookings'),
      ])
      setProfileData(profileRes.data)
      if (bookingsRes.data?.length > 0) setJobsList(bookingsRes.data)
    } catch (err) {
      // stays on dummy data if API fails — acceptable for demo
      console.warn('Dashboard load:', err.message)
    }
  }
  fetchDashboard()
}, [])

  const markAllRead = () => setNotifList(n => n.map(x => ({ ...x, read:true })))

  const tabs = [
    { id:'overview',      label:'Overview',      icon:'📊' },
    { id:'jobs',          label:'My Jobs',        icon:'🔨', badge:pendingJobs },
    { id:'earnings',      label:'Earnings',       icon:'💰' },
    { id:'profile',       label:'Edit Profile',   icon:'👤' },
    { id:'notifications', label:'Notifications',  icon:'🔔', badge:unread },
  ]

  return (
    <div className={styles.page}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarTop}>
          <div className={styles.userAvatar} style={{ background: ME.avatarGradient }}>{ME.initials}</div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{user?.name || ME.name}</div>
            <div className={styles.userRole}>{ME.skill} · {user?.city || ME.city}</div>
            <div className={styles.userRating}>{'★'.repeat(Math.floor(ME.rating))} {ME.rating}</div>
          </div>
        </div>
        <nav className={styles.nav}>
          {tabs.map(t => (
            <button key={t.id} className={`${styles.navItem} ${tab===t.id?styles.navActive:''}`}
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
            onClick={() => setEditForm(f => ({ ...f, available:!f.available }))}>
            <div className={styles.toggleKnob} />
          </div>
        </div>
        <button className={styles.logoutBtn} onClick={logout}>🚪 Sign Out</button>
      </aside>

      {/* Mobile header */}
      <div className={styles.mobileHeader}>
        <button className={styles.menuBtn} onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        <span className={styles.mobileTitle}>Skill<strong>Bridge</strong></span>
      </div>

      <main className={styles.main}>
        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h1 className={styles.pageTitle}>Hey {(user?.name || ME.name).split(' ')[0]} 👋</h1>
              <p className={styles.pageSub}>Here's your work summary today</p>
            </div>
            <div className={styles.statsGrid}>
              {[
                { label:'Total Earnings', val:formatCurrency(totalEarnings), icon:'💰', color:'#059669' },
                { label:'Pending Payout', val:formatCurrency(pendingPay),    icon:'⏳', color:'#D97706' },
                { label:'Jobs Completed', val:completedJobs,                 icon:'✅', color:'#1A56DB' },
                { label:'Avg Rating',     val:`${ME.rating}★`,               icon:'⭐', color:'#7C3AED' },
              ].map(s => (
                <div key={s.label} className={styles.statCard}>
                  <div className={styles.statIcon} style={{ color:s.color }}>{s.icon}</div>
                  <div className={styles.statVal}>{s.val}</div>
                  <div className={styles.statLabel}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Pending requests callout */}
            {pendingJobs > 0 && (
              <div className={styles.alertBanner}>
                <span>🔔</span>
                <div>
                  <strong>You have {pendingJobs} pending job request{pendingJobs>1?'s':''}!</strong>
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
                return (
                  <div key={b.id} className={styles.bookingCard}>
                    <div className={styles.bookingInfo}>
                      <div className={styles.bookingEmployer}>{b.employerName || 'Employer'}</div>
                      <div className={styles.bookingMeta}>
                        <span>📅 {b.date} · {b.time}</span>
                        <span>⏱ {b.duration}h</span>
                        <span>💰 {formatCurrency(b.amount)}</span>
                      </div>
                      {b.description && <p className={styles.bookingDesc}>{b.description}</p>}
                    </div>
                    <div className={styles.bookingActions}>
                      <span className={styles.statusBadge} style={{ background:meta.bg, color:meta.color }}>
                        {meta.label}
                      </span>
                      {b.status === 'pending' && (
                        <div style={{ display:'flex', gap:8 }}>
                          <button className={styles.acceptBtn} onClick={() => handleAccept(b.id)}>✓ Accept</button>
                          <button className={styles.rejectBtn} onClick={() => handleReject(b.id)}>✕ Reject</button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
              {jobsList.length === 0 && (
                <div className={styles.emptyState}><span>🔨</span><p>No job requests yet. Make sure you're set to available!</p></div>
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
              <div className={styles.earnCard} style={{ background:'linear-gradient(135deg,#1A56DB,#4338CA)' }}>
                <div className={styles.earnLabel}>Total Earned</div>
                <div className={styles.earnVal}>{formatCurrency(totalEarnings)}</div>
              </div>
              <div className={styles.earnCard} style={{ background:'linear-gradient(135deg,#059669,#047857)' }}>
                <div className={styles.earnLabel}>This Month</div>
                <div className={styles.earnVal}>{formatCurrency(Math.round(totalEarnings * 0.4))}</div>
              </div>
              <div className={styles.earnCard} style={{ background:'linear-gradient(135deg,#D97706,#B45309)' }}>
                <div className={styles.earnLabel}>Pending Payout</div>
                <div className={styles.earnVal}>{formatCurrency(pendingPay)}</div>
              </div>
            </div>
            <h3 className={styles.subTitle}>Transaction History</h3>
            <div className={styles.bookingsList}>
              {jobsList.filter(b=>b.paymentStatus).map(b=>(
                <div key={b.id} className={styles.bookingCard}>
                  <div className={styles.bookingInfo}>
                    <div className={styles.bookingEmployer}>{b.employerName || 'Employer'} — {b.skill || 'Work'}</div>
                    <div className={styles.bookingMeta}><span>📅 {b.date}</span></div>
                  </div>
                  <div className={styles.bookingActions}>
                    <div className={styles.payAmount}>{formatCurrency(b.amount)}</div>
                    <span className={styles.statusBadge}
                      style={{ background:b.paymentStatus==='released'?'#D1FAE5':'#FFF8E7',
                               color:b.paymentStatus==='released'?'#065F46':'#92400E' }}>
                      {b.paymentStatus==='released'?'✓ Received':'⏳ Held'}
                    </span>
                  </div>
                </div>
              ))}
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
                    onChange={e => setEditForm(f=>({...f,name:e.target.value}))} />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Primary Skill</label>
                  <select className={styles.input} value={editForm.skill}
                    onChange={e => setEditForm(f=>({...f,skill:e.target.value}))}>
                    {SKILLS_LIST.map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>City</label>
                  <select className={styles.input} value={editForm.city}
                    onChange={e => setEditForm(f=>({...f,city:e.target.value}))}>
                    {CITIES.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Hourly Rate (₹)</label>
                  <input type="number" className={styles.input} value={editForm.hourlyRate}
                    onChange={e => setEditForm(f=>({...f,hourlyRate:Number(e.target.value)}))} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>About You</label>
                <textarea className={`${styles.input} ${styles.textarea}`} rows={4}
                  value={editForm.about} onChange={e => setEditForm(f=>({...f,about:e.target.value}))} />
              </div>
              <button type="submit" className={`${styles.saveBtn} ${editSuccess ? styles.saveBtnSuccess : ''}`} disabled={editLoading}>
                {editLoading ? 'Saving…' : editSuccess ? '✓ Saved!' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {/* NOTIFICATIONS */}
        {tab === 'notifications' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader} style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start' }}>
              <div>
                <h1 className={styles.pageTitle}>Notifications</h1>
                <p className={styles.pageSub}>{unread} unread</p>
              </div>
              {unread > 0 && <button className={styles.markAllBtn} onClick={markAllRead}>Mark all read</button>}
            </div>
            <div className={styles.notifList}>
              {notifList.map(n => (
                <div key={n.id} className={`${styles.notifCard} ${!n.read ? styles.notifUnread : ''}`}
                  onClick={() => setNotifList(list => list.map(x => x.id===n.id ? {...x,read:true} : x))}>
                  <div className={styles.notifIcon}>{n.type==='booking'?'📋':n.type==='payment'?'💰':'⭐'}</div>
                  <div className={styles.notifBody}>
                    <div className={styles.notifTitle}>{n.title}</div>
                    <div className={styles.notifMsg}>{n.message}</div>
                    <div className={styles.notifTime}>{n.time}</div>
                  </div>
                  {!n.read && <div className={styles.notifDot} />}
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
