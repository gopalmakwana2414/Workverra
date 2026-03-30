import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { bookings, notifications, workers, formatCurrency } from '../../utils/dummyData'
import styles from './WorkerDashboard.module.css'

// Use first worker as the "logged in" worker for demo
const ME = workers[0]

const STATUS_COLORS = {
  pending:   { bg:'#FFF8E7', color:'#92400E', label:'Pending' },
  confirmed: { bg:'#EBF2FF', color:'#1344B8', label:'Confirmed' },
  completed: { bg:'#D1FAE5', color:'#065F46', label:'Completed' },
  rejected:  { bg:'#FEF2F2', color:'#991B1B', label:'Rejected' },
}

const WorkerDashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [notifList, setNotifList] = useState(notifications)

  const myBookings = bookings.filter(b => b.workerId === ME.id)
  const totalEarned = myBookings.filter(b => b.status === 'completed').reduce((s, b) => s + b.amount, 0)
  const pendingCount = myBookings.filter(b => b.status === 'pending').length
  const completedCount = myBookings.filter(b => b.status === 'completed').length
  const unreadCount = notifList.filter(n => !n.read).length

  const markAllRead = () => setNotifList(n => n.map(x => ({ ...x, read: true })))

  const tabs = [
    { id: 'overview',      label: 'Overview',      icon: '📊' },
    { id: 'bookings',      label: 'Bookings',       icon: '📋' },
    { id: 'notifications', label: `Notifications`,  icon: '🔔', badge: unreadCount },
    { id: 'profile',       label: 'My Profile',     icon: '👤' },
  ]

  return (
    <div className={styles.page}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.userAvatar} style={{ background: ME.avatarGradient }}>{ME.initials}</div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{ME.name}</div>
            <div className={styles.userRole}>{ME.skill}</div>
            {ME.verified && <span className={styles.verifiedPill}>✓ Verified</span>}
          </div>
        </div>

        <nav className={styles.nav}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`${styles.navItem} ${activeTab === tab.id ? styles.navActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className={styles.navIcon}>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.badge > 0 && <span className={styles.navBadge}>{tab.badge}</span>}
            </button>
          ))}
        </nav>

        <button className={styles.logoutBtn} onClick={() => navigate('/')}>← Back to Home</button>
      </aside>

      {/* Main content */}
      <main className={styles.main}>
        {/* ── OVERVIEW ── */}
        {activeTab === 'overview' && (
          <div>
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>Good morning, {ME.name.split(' ')[0]} 👋</h1>
              <p className={styles.pageSub}>Here's your dashboard summary</p>
            </div>

            {/* Stat cards */}
            <div className={styles.statCards}>
              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background:'#EBF2FF' }}>💰</div>
                <div className={styles.statInfo}>
                  <div className={styles.statVal}>{formatCurrency(totalEarned)}</div>
                  <div className={styles.statLabel}>Total Earned</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background:'#D1FAE5' }}>✅</div>
                <div className={styles.statInfo}>
                  <div className={styles.statVal}>{completedCount}</div>
                  <div className={styles.statLabel}>Jobs Completed</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background:'#FFF8E7' }}>⏳</div>
                <div className={styles.statInfo}>
                  <div className={styles.statVal}>{pendingCount}</div>
                  <div className={styles.statLabel}>Pending Requests</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background:'#FEF2F2' }}>⭐</div>
                <div className={styles.statInfo}>
                  <div className={styles.statVal}>{ME.rating}</div>
                  <div className={styles.statLabel}>Avg Rating</div>
                </div>
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

            {/* Notifications preview */}
            <div className={styles.section}>
              <div className={styles.sectionHead}>
                <h2 className={styles.sectionTitle}>Recent Notifications</h2>
                <button className={styles.seeAll} onClick={() => setActiveTab('notifications')}>See all →</button>
              </div>
              <div className={styles.notifPreview}>
                {notifList.slice(0, 3).map(n => (
                  <div key={n.id} className={`${styles.notifRow} ${!n.read ? styles.notifUnread : ''}`}>
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
          </div>
        )}

        {/* ── BOOKINGS ── */}
        {activeTab === 'bookings' && (
          <div>
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>My Bookings</h1>
              <p className={styles.pageSub}>{myBookings.length} total bookings</p>
            </div>
            <div className={styles.section}>
              <BookingTable bookings={myBookings} showActions />
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
                <button className={styles.markRead} onClick={markAllRead}>Mark all as read</button>
              )}
            </div>
            <div className={styles.section}>
              <div className={styles.notifList}>
                {notifList.map(n => (
                  <div key={n.id} className={`${styles.notifRow} ${!n.read ? styles.notifUnread : ''}`}
                    onClick={() => setNotifList(list => list.map(x => x.id === n.id ? { ...x, read: true } : x))}>
                    <span className={styles.notifIconLg}>{n.icon}</span>
                    <div className={styles.notifText}>
                      <p className={styles.notifMsg}>{n.message}</p>
                      <span className={styles.notifTime}>{n.time}</span>
                    </div>
                    {!n.read && <span className={styles.unreadDot}></span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PROFILE ── */}
        {activeTab === 'profile' && (
          <div>
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>My Profile</h1>
              <p className={styles.pageSub}>How employers see your profile</p>
            </div>
            <div className={styles.section}>
              <div className={styles.profileView}>
                <div className={styles.profileAvatar} style={{ background: ME.avatarGradient }}>{ME.initials}</div>
                <div className={styles.profileDetails}>
                  <h2 className={styles.profileName}>{ME.name}</h2>
                  <p className={styles.profileSkill}>{ME.skill} · {ME.experience} years experience</p>
                  <p className={styles.profileCity}>📍 {ME.city}, {ME.state}</p>
                  <p className={styles.profileAbout}>{ME.about}</p>
                  <div className={styles.profileStats}>
                    <div className={styles.pStat}><strong>{formatCurrency(ME.hourlyRate)}</strong><span>/hr</span></div>
                    <div className={styles.pStat}><strong>{ME.rating}★</strong><span>rating</span></div>
                    <div className={styles.pStat}><strong>{ME.totalJobs}</strong><span>jobs</span></div>
                  </div>
                  <div className={styles.skillTags}>
                    {ME.skills.map(s => <span key={s} className={styles.skillTag}>{s}</span>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

// Shared booking table component
const BookingTable = ({ bookings, showActions }) => (
  <div className={styles.tableWrap}>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Employer</th>
          <th>Job</th>
          <th>Date</th>
          <th>Amount</th>
          <th>Status</th>
          {showActions && <th>Payment</th>}
        </tr>
      </thead>
      <tbody>
        {bookings.map(b => {
          const s = STATUS_COLORS[b.status] || STATUS_COLORS.pending
          return (
            <tr key={b.id}>
              <td className={styles.tdName}>{b.employerName}</td>
              <td className={styles.tdJob}>{b.jobDescription}</td>
              <td className={styles.tdDate}>{b.date}<br /><span>{b.time}</span></td>
              <td className={styles.tdAmount}>{formatCurrency(b.amount)}</td>
              <td>
                <span className={styles.statusPill} style={{ background: s.bg, color: s.color }}>
                  {s.label}
                </span>
              </td>
              {showActions && (
                <td>
                  <span className={styles.payPill}
                    style={{
                      background: b.paymentStatus === 'released' ? '#D1FAE5' : b.paymentStatus === 'held' ? '#EBF2FF' : '#F3F4F6',
                      color: b.paymentStatus === 'released' ? '#065F46' : b.paymentStatus === 'held' ? '#1344B8' : '#6B7280',
                    }}>
                    {b.paymentStatus}
                  </span>
                </td>
              )}
            </tr>
          )
        })}
      </tbody>
    </table>
  </div>
)

export default WorkerDashboard
