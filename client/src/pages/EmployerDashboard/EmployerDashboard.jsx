import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { bookings, workers, notifications, formatCurrency, SKILLS_LIST, CITIES } from '../../utils/dummyData'
import styles from './EmployerDashboard.module.css'

const ME = { name: 'Rahul Gupta', initials: 'RG', company: 'Sharma Constructions', city: 'Indore' }

const STATUS_COLORS = {
  pending:   { bg:'#FFF8E7', color:'#92400E', label:'Pending' },
  confirmed: { bg:'#EBF2FF', color:'#1344B8', label:'Confirmed' },
  completed: { bg:'#D1FAE5', color:'#065F46', label:'Completed' },
  rejected:  { bg:'#FEF2F2', color:'#991B1B', label:'Rejected' },
}

const EmployerDashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [notifList, setNotifList] = useState(notifications)
  const [postForm, setPostForm] = useState({ skill:'', city:'', date:'', time:'', duration:'2', description:'' })
  const [postSuccess, setPostSuccess] = useState(false)
  const [postLoading, setPostLoading] = useState(false)

  const myBookings = bookings
  const totalSpent = myBookings.filter(b => b.status === 'completed').reduce((s, b) => s + b.amount, 0)
  const activeJobs  = myBookings.filter(b => b.status === 'confirmed').length
  const pendingJobs = myBookings.filter(b => b.status === 'pending').length
  const unreadCount = notifList.filter(n => !n.read).length

  const handlePost = async (e) => {
    e.preventDefault()
    setPostLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    setPostLoading(false)
    setPostSuccess(true)
    setTimeout(() => { setPostSuccess(false); setActiveTab('bookings') }, 1800)
  }

  const tabs = [
    { id:'overview',      label:'Overview',       icon:'📊' },
    { id:'post',          label:'Post a Job',      icon:'➕' },
    { id:'bookings',      label:'My Bookings',     icon:'📋' },
    { id:'workers',       label:'Browse Workers',  icon:'🔍' },
    { id:'notifications', label:'Notifications',   icon:'🔔', badge: unreadCount },
  ]

  return (
    <div className={styles.page}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.userAvatar}>{ME.initials}</div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{ME.name}</div>
            <div className={styles.userRole}>{ME.company}</div>
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

        <button className={styles.logoutBtn} onClick={() => navigate('/')}>← Back to Home</button>
      </aside>

      {/* Main */}
      <main className={styles.main}>

        {/* ── OVERVIEW ── */}
        {activeTab === 'overview' && (
          <div>
            <div className={styles.pageHeader}>
              <div>
                <h1 className={styles.pageTitle}>Welcome back, {ME.name.split(' ')[0]} 👋</h1>
                <p className={styles.pageSub}>{ME.company} · {ME.city}</p>
              </div>
              <button className={styles.postJobBtn} onClick={() => setActiveTab('post')}>+ Post a Job</button>
            </div>

            <div className={styles.statCards}>
              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background:'#EBF2FF' }}>💸</div>
                <div><div className={styles.statVal}>{formatCurrency(totalSpent)}</div><div className={styles.statLabel}>Total Spent</div></div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background:'#D1FAE5' }}>🔨</div>
                <div><div className={styles.statVal}>{activeJobs}</div><div className={styles.statLabel}>Active Jobs</div></div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background:'#FFF8E7' }}>⏳</div>
                <div><div className={styles.statVal}>{pendingJobs}</div><div className={styles.statLabel}>Pending</div></div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background:'#ECFDF5' }}>✅</div>
                <div><div className={styles.statVal}>{myBookings.filter(b=>b.status==='completed').length}</div><div className={styles.statLabel}>Completed</div></div>
              </div>
            </div>

            {/* Recent bookings */}
            <div className={styles.section}>
              <div className={styles.sectionHead}>
                <h2 className={styles.sectionTitle}>Recent Bookings</h2>
                <button className={styles.seeAll} onClick={() => setActiveTab('bookings')}>See all →</button>
              </div>
              <BookingTable bookings={myBookings.slice(0, 3)} />
            </div>

            {/* Suggested workers */}
            <div className={styles.section}>
              <div className={styles.sectionHead}>
                <h2 className={styles.sectionTitle}>Top Workers Near You</h2>
                <button className={styles.seeAll} onClick={() => navigate('/search')}>Browse all →</button>
              </div>
              <div className={styles.workerMiniGrid}>
                {workers.slice(0, 3).map(w => (
                  <div key={w.id} className={styles.workerMini} onClick={() => navigate(`/worker/${w.id}`)}>
                    <div className={styles.wmAvatar} style={{ background:w.avatarGradient }}>{w.initials}</div>
                    <div className={styles.wmInfo}>
                      <div className={styles.wmName}>{w.name}</div>
                      <div className={styles.wmSkill}>{w.skill} · {w.city}</div>
                      <div className={styles.wmRating}>{'★'.repeat(Math.floor(w.rating))} <span>{w.rating}</span></div>
                    </div>
                    <div className={styles.wmRate}>{formatCurrency(w.hourlyRate)}<span>/hr</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── POST A JOB ── */}
        {activeTab === 'post' && (
          <div>
            <div className={styles.pageHeader}>
              <div>
                <h1 className={styles.pageTitle}>Post a Job</h1>
                <p className={styles.pageSub}>Describe what you need — workers will respond</p>
              </div>
            </div>

            <div className={styles.section} style={{ maxWidth: 600 }}>
              {postSuccess ? (
                <div className={styles.successState}>
                  <div className={styles.successIcon}>🎉</div>
                  <h3>Job Posted Successfully!</h3>
                  <p>Redirecting to your bookings...</p>
                </div>
              ) : (
                <form onSubmit={handlePost} className={styles.postForm}>
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Skill Needed</label>
                    <select className={styles.formSelect} required
                      value={postForm.skill} onChange={e => setPostForm(f=>({...f,skill:e.target.value}))}>
                      <option value="">Select a skill</option>
                      {SKILLS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formField}>
                      <label className={styles.formLabel}>City</label>
                      <select className={styles.formSelect} required
                        value={postForm.city} onChange={e => setPostForm(f=>({...f,city:e.target.value}))}>
                        <option value="">Select city</option>
                        {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className={styles.formField}>
                      <label className={styles.formLabel}>Duration (hours)</label>
                      <select className={styles.formSelect}
                        value={postForm.duration} onChange={e => setPostForm(f=>({...f,duration:e.target.value}))}>
                        {[1,2,3,4,6,8].map(h => <option key={h} value={h}>{h} hr{h>1?'s':''}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formField}>
                      <label className={styles.formLabel}>Preferred Date</label>
                      <input type="date" className={styles.formInput} required
                        min={new Date().toISOString().split('T')[0]}
                        value={postForm.date} onChange={e => setPostForm(f=>({...f,date:e.target.value}))} />
                    </div>
                    <div className={styles.formField}>
                      <label className={styles.formLabel}>Preferred Time</label>
                      <select className={styles.formSelect}
                        value={postForm.time} onChange={e => setPostForm(f=>({...f,time:e.target.value}))}>
                        {['09:00 AM','10:00 AM','11:00 AM','12:00 PM','02:00 PM','03:00 PM','04:00 PM','05:00 PM'].map(t =>
                          <option key={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Job Description</label>
                    <textarea className={styles.formTextarea} rows={4} required
                      placeholder="Describe the work in detail — what needs to be done, any special requirements..."
                      value={postForm.description} onChange={e => setPostForm(f=>({...f,description:e.target.value}))} />
                  </div>

                  <button type="submit" className={`${styles.submitBtn} ${postLoading ? styles.loading : ''}`} disabled={postLoading}>
                    {postLoading ? <span className={styles.spinner}></span> : '🚀 Post Job & Find Workers'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ── MY BOOKINGS ── */}
        {activeTab === 'bookings' && (
          <div>
            <div className={styles.pageHeader}>
              <div>
                <h1 className={styles.pageTitle}>My Bookings</h1>
                <p className={styles.pageSub}>{myBookings.length} total</p>
              </div>
              <button className={styles.postJobBtn} onClick={() => setActiveTab('post')}>+ Post New Job</button>
            </div>
            <div className={styles.section}>
              <BookingTable bookings={myBookings} showWorker />
            </div>
          </div>
        )}

        {/* ── BROWSE WORKERS ── */}
        {activeTab === 'workers' && (
          <div>
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>Browse Workers</h1>
              <p className={styles.pageSub}>Find the right person for your job</p>
            </div>
            <div className={styles.workerFullGrid}>
              {workers.map(w => (
                <div key={w.id} className={styles.workerCard} onClick={() => navigate(`/worker/${w.id}`)}>
                  <div className={styles.wcTop}>
                    <div className={styles.wcAvatar} style={{ background:w.avatarGradient }}>{w.initials}</div>
                    <div className={styles.wcRate}>{formatCurrency(w.hourlyRate)}<span>/hr</span></div>
                  </div>
                  <div className={styles.wcName}>{w.name}</div>
                  <div className={styles.wcMeta}>{w.skill} · {w.experience}yr · {w.city}</div>
                  <div className={styles.wcRating}>
                    <span className={styles.stars}>{'★'.repeat(Math.floor(w.rating))}</span>
                    <span className={styles.rVal}>{w.rating}</span>
                    <span className={styles.rCount}>({w.totalReviews})</span>
                  </div>
                  <div className={styles.wcBadges}>
                    {w.verified && <span className={styles.vBadge}>✓ Verified</span>}
                    {w.badge && <span className={styles.pBadge}>{w.badge}</span>}
                    <span className={`${styles.aBadge} ${w.available ? styles.aGreen : styles.aGray}`}>
                      {w.available ? '● Available' : '○ Busy'}
                    </span>
                  </div>
                  <button className={styles.viewBtn} onClick={e => { e.stopPropagation(); navigate(`/worker/${w.id}`) }}>
                    View Profile →
                  </button>
                </div>
              ))}
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
                  onClick={() => setNotifList(n => n.map(x => ({ ...x, read:true })))}>
                  Mark all as read
                </button>
              )}
            </div>
            <div className={styles.section}>
              {notifList.map(n => (
                <div key={n.id}
                  className={`${styles.notifRow} ${!n.read ? styles.notifUnread : ''}`}
                  onClick={() => setNotifList(list => list.map(x => x.id===n.id ? {...x,read:true} : x))}>
                  <span className={styles.notifIcon}>{n.icon}</span>
                  <div className={styles.notifText}>
                    <p className={styles.notifMsg}>{n.message}</p>
                    <span className={styles.notifTime}>{n.time}</span>
                  </div>
                  {!n.read && <span className={styles.unreadDot}></span>}
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  )
}

const BookingTable = ({ bookings, showWorker }) => (
  <div className={styles.tableWrap}>
    <table className={styles.table}>
      <thead>
        <tr>
          {showWorker && <th>Worker</th>}
          <th>Job</th>
          <th>Date</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Payment</th>
        </tr>
      </thead>
      <tbody>
        {bookings.map(b => {
          const s = STATUS_COLORS[b.status] || STATUS_COLORS.pending
          return (
            <tr key={b.id}>
              {showWorker && <td className={styles.tdName}>{b.workerName}<br /><span className={styles.tdSub}>{b.workerSkill}</span></td>}
              <td className={styles.tdJob}>{b.jobDescription}</td>
              <td className={styles.tdDate}>{b.date}<br /><span>{b.time}</span></td>
              <td className={styles.tdAmount}>{formatCurrency(b.amount)}</td>
              <td><span className={styles.statusPill} style={{ background:s.bg, color:s.color }}>{s.label}</span></td>
              <td><span className={styles.payPill}
                style={{
                  background: b.paymentStatus==='released'?'#D1FAE5': b.paymentStatus==='held'?'#EBF2FF':'#F3F4F6',
                  color: b.paymentStatus==='released'?'#065F46': b.paymentStatus==='held'?'#1344B8':'#6B7280',
                }}>
                {b.paymentStatus}
              </span></td>
            </tr>
          )
        })}
      </tbody>
    </table>
  </div>
)

export default EmployerDashboard
