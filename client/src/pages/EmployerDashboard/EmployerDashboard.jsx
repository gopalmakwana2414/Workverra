import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import API from '../../api/axios'
import { workers, bookings as demoBookings, formatCurrency, SKILLS_LIST, CITIES } from '../../utils/dummyData'
import styles from './EmployerDashboard.module.css'

const STATUS_META = {
  pending:   { bg:'#FFF8E7', color:'#92400E', label:'Pending' },
  confirmed: { bg:'#EBF2FF', color:'#1344B8', label:'Confirmed' },
  completed: { bg:'#D1FAE5', color:'#065F46', label:'Completed' },
  rejected:  { bg:'#FEF2F2', color:'#991B1B', label:'Rejected' },
}

const EmployerDashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [tab, setTab] = useState('overview')
  const [bookingsList, setBookingsList] = useState(demoBookings)
  const [searchSkill, setSearchSkill] = useState('')
  const [searchCity, setSearchCity] = useState('')
  const [workerResults, setWorkerResults] = useState(workers)
  const [searching, setSearching] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const pendingCount = bookingsList.filter(b => b.status === 'pending').length
  const confirmedCount = bookingsList.filter(b => b.status === 'confirmed').length
  const completedCount = bookingsList.filter(b => b.status === 'completed').length
  const totalSpent = bookingsList.filter(b => b.paymentStatus === 'released').reduce((s, b) => s + b.amount, 0)

  const handleSearch = async () => {
    setSearching(true)
    try {
      const res = await API.get('/workers/search', { params: { skill: searchSkill, city: searchCity } })
      setWorkerResults(res.data.workers || res.data)
    } catch (_) {
      // demo filter
      let r = [...workers]
      if (searchSkill) r = r.filter(w => w.skill === searchSkill)
      if (searchCity) r = r.filter(w => w.city === searchCity)
      setWorkerResults(r)
    }
    setSearching(false)
  }

  const handleCancelBooking = async (id) => {
    if (!confirm('Cancel this booking?')) return
    try {
      await API.put(`/bookings/${id}/cancel`)
    } catch (_) {}
    setBookingsList(b => b.map(x => x.id === id || x._id === id ? { ...x, status:'rejected' } : x))
  }

  const tabs = [
    { id:'overview', label:'Overview', icon:'📊' },
    { id:'search',   label:'Find Workers', icon:'🔍' },
    { id:'bookings', label:'My Bookings', icon:'📋', badge: pendingCount + confirmedCount },
    { id:'payments', label:'Payments', icon:'💳' },
  ]

  return (
    <div className={styles.page}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarTop}>
          <div className={styles.userAvatar} style={{ background:'linear-gradient(135deg,#1A56DB,#4338CA)' }}>
            {(user?.name || 'E').charAt(0).toUpperCase()}
          </div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{user?.name || 'Employer'}</div>
            <div className={styles.userRole}>Employer · {user?.city || 'India'}</div>
            <div className={styles.userBadge}>✓ Verified</div>
          </div>
        </div>

        <nav className={styles.nav}>
          {tabs.map(t => (
            <button key={t.id} className={`${styles.navItem} ${tab === t.id ? styles.navActive : ''}`}
              onClick={() => { setTab(t.id); setMenuOpen(false) }}>
              <span className={styles.navIcon}>{t.icon}</span>
              <span>{t.label}</span>
              {t.badge > 0 && <span className={styles.navBadge}>{t.badge}</span>}
            </button>
          ))}
        </nav>

        <button className={styles.logoutBtn} onClick={logout}>🚪 Sign Out</button>
      </aside>

      {/* Mobile header */}
      <div className={styles.mobileHeader}>
        <button className={styles.menuBtn} onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        <span className={styles.mobileTitle}>Skill<strong>Bridge</strong></span>
      </div>

      {/* Main */}
      <main className={styles.main}>
        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h1 className={styles.pageTitle}>Welcome back, {user?.name?.split(' ')[0] || 'there'} 👋</h1>
              <p className={styles.pageSub}>Here's your hiring activity at a glance</p>
            </div>
            <div className={styles.statsGrid}>
              {[
                { label:'Total Bookings', val: bookingsList.length, icon:'📋', color:'#1A56DB' },
                { label:'Confirmed Jobs', val: confirmedCount, icon:'✅', color:'#059669' },
                { label:'Completed Jobs', val: completedCount, icon:'🏆', color:'#7C3AED' },
                { label:'Total Spent', val: formatCurrency(totalSpent), icon:'💰', color:'#D97706' },
              ].map(s => (
                <div key={s.label} className={styles.statCard}>
                  <div className={styles.statIcon} style={{ color: s.color }}>{s.icon}</div>
                  <div className={styles.statVal}>{s.val}</div>
                  <div className={styles.statLabel}>{s.label}</div>
                </div>
              ))}
            </div>
            <div className={styles.quickActions}>
              <h3 className={styles.subTitle}>Quick Actions</h3>
              <div className={styles.actionCards}>
                <button className={styles.actionCard} onClick={() => setTab('search')}>
                  <span>🔍</span><div><strong>Find a Worker</strong><p>Search by skill & location</p></div>
                </button>
                <button className={styles.actionCard} onClick={() => setTab('bookings')}>
                  <span>📋</span><div><strong>View Bookings</strong><p>{pendingCount} pending action</p></div>
                </button>
                <button className={styles.actionCard} onClick={() => navigate('/search')}>
                  <span>🌐</span><div><strong>Browse All Workers</strong><p>Explore full marketplace</p></div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SEARCH WORKERS */}
        {tab === 'search' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h1 className={styles.pageTitle}>Find Workers</h1>
              <p className={styles.pageSub}>Search verified skilled workers in your area</p>
            </div>
            <div className={styles.searchBar}>
              <select className={styles.searchSelect} value={searchSkill} onChange={e=>setSearchSkill(e.target.value)}>
                <option value="">All Skills</option>
                {SKILLS_LIST.map(s=><option key={s}>{s}</option>)}
              </select>
              <select className={styles.searchSelect} value={searchCity} onChange={e=>setSearchCity(e.target.value)}>
                <option value="">All Cities</option>
                {CITIES.map(c=><option key={c}>{c}</option>)}
              </select>
              <button className={styles.searchBtn} onClick={handleSearch} disabled={searching}>
                {searching ? '…' : '🔍 Search'}
              </button>
            </div>
            <div className={styles.workerGrid}>
              {workerResults.map(w => (
                <div key={w.id} className={styles.workerCard}>
                  <div className={styles.workerHeader}>
                    <div className={styles.workerAvatar} style={{ background: w.avatarGradient }}>{w.initials}</div>
                    <div>
                      <div className={styles.workerName}>{w.name} {w.verified && <span className={styles.badge}>✓</span>}</div>
                      <div className={styles.workerSkill}>{w.skill} · {w.city}</div>
                      <div className={styles.workerRating}>{'★'.repeat(Math.floor(w.rating))} {w.rating} ({w.totalReviews})</div>
                    </div>
                  </div>
                  <div className={styles.workerMeta}>
                    <span>💼 {w.jobsDone} jobs</span>
                    <span>⏱ {w.experience}y exp</span>
                    <span className={w.available ? styles.availBadge : styles.unavailBadge}>
                      {w.available ? '● Available' : '○ Busy'}
                    </span>
                  </div>
                  <div className={styles.workerRate}>{formatCurrency(w.hourlyRate)}<small>/hr</small></div>
                  <div className={styles.workerActions}>
                    <button className={styles.viewBtn} onClick={() => navigate(`/worker/${w.id}`)}>View Profile</button>
                    <button className={styles.bookBtn} onClick={() => navigate(`/booking/${w.id}`)} disabled={!w.available}>
                      {w.available ? 'Book Now' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              ))}
              {workerResults.length === 0 && (
                <div className={styles.emptyState}><span>🔍</span><p>No workers found. Try different filters.</p></div>
              )}
            </div>
          </div>
        )}

        {/* BOOKINGS */}
        {tab === 'bookings' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h1 className={styles.pageTitle}>My Bookings</h1>
              <p className={styles.pageSub}>Track and manage all your job requests</p>
            </div>
            <div className={styles.bookingsList}>
              {bookingsList.map(b => {
                const meta = STATUS_META[b.status] || STATUS_META.pending
                return (
                  <div key={b.id} className={styles.bookingCard}>
                    <div className={styles.bookingLeft}>
                      <div className={styles.bookingWorker}>
                        <div className={styles.bookingAvatar}>{b.workerName?.charAt(0) || 'W'}</div>
                        <div>
                          <div className={styles.bookingWorkerName}>{b.workerName}</div>
                          <div className={styles.bookingSkill}>{b.skill}</div>
                        </div>
                      </div>
                      <div className={styles.bookingDetails}>
                        <span>📅 {b.date} · {b.time}</span>
                        <span>⏱ {b.duration}h</span>
                        <span>💰 {formatCurrency(b.amount)}</span>
                      </div>
                      {b.description && <p className={styles.bookingDesc}>{b.description}</p>}
                    </div>
                    <div className={styles.bookingRight}>
                      <span className={styles.statusBadge} style={{ background:meta.bg, color:meta.color }}>
                        {meta.label}
                      </span>
                      {b.status === 'pending' && (
                        <button className={styles.cancelBtn} onClick={() => handleCancelBooking(b.id)}>Cancel</button>
                      )}
                      {b.status === 'confirmed' && b.paymentStatus !== 'released' && (
                        <button className={styles.payBtn} onClick={() => navigate(`/payment/${b.id}`)}>Pay Now</button>
                      )}
                    </div>
                  </div>
                )
              })}
              {bookingsList.length === 0 && (
                <div className={styles.emptyState}><span>📋</span><p>No bookings yet. Find a worker to get started!</p></div>
              )}
            </div>
          </div>
        )}

        {/* PAYMENTS */}
        {tab === 'payments' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h1 className={styles.pageTitle}>Payment History</h1>
              <p className={styles.pageSub}>Track all your payments</p>
            </div>
            <div className={styles.paymentSummary}>
              <div className={styles.payCard}><div className={styles.payCardLabel}>Total Spent</div><div className={styles.payCardVal}>{formatCurrency(totalSpent)}</div></div>
              <div className={styles.payCard}><div className={styles.payCardLabel}>Pending</div><div className={styles.payCardVal}>{formatCurrency(bookingsList.filter(b=>b.paymentStatus==='held').reduce((s,b)=>s+b.amount,0))}</div></div>
            </div>
            <div className={styles.bookingsList}>
              {bookingsList.filter(b=>b.paymentStatus).map(b=>(
                <div key={b.id} className={styles.bookingCard}>
                  <div className={styles.bookingLeft}>
                    <div className={styles.bookingWorkerName}>{b.workerName} – {b.skill}</div>
                    <div className={styles.bookingDetails}><span>📅 {b.date}</span></div>
                  </div>
                  <div className={styles.bookingRight}>
                    <div className={styles.payAmount}>{formatCurrency(b.amount)}</div>
                    <span className={styles.statusBadge}
                      style={{ background: b.paymentStatus==='released'?'#D1FAE5':'#FFF8E7',
                               color: b.paymentStatus==='released'?'#065F46':'#92400E' }}>
                      {b.paymentStatus === 'released' ? 'Paid' : 'Held'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default EmployerDashboard
