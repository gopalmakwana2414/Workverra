import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import API from '../../api/axios'
import { formatCurrency, SKILLS_LIST, CITIES, BOOKING_STATUS } from '../../utils/dummyData'
import styles from './EmployerDashboard.module.css'

const STATUS_META = BOOKING_STATUS

const EmployerDashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [tab,           setTab]           = useState('overview')
  const [bookingsList,  setBookingsList]  = useState([])
  const [workerResults, setWorkerResults] = useState([])
  const [searchSkill,   setSearchSkill]   = useState('')
  const [searchCity,    setSearchCity]    = useState('')
  const [searching,     setSearching]     = useState(false)
  const [menuOpen,      setMenuOpen]      = useState(false)
  const [loadingData,   setLoadingData]   = useState(true)

  // ── Fetch real bookings on mount ─────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true)
      try {
        const res = await API.get('/bookings/employer')
        setBookingsList(res.data || [])
      } catch (_) {
        setBookingsList([])
      }
      setLoadingData(false)
    }
    fetchData()
  }, [])

  // ── Derived counts ───────────────────────────────────────
  const pendingCount   = bookingsList.filter(b => b.status === 'pending').length
  const confirmedCount = bookingsList.filter(b => b.status === 'confirmed').length
  const completedCount = bookingsList.filter(b => b.status === 'completed').length
  const totalSpent     = bookingsList
    .filter(b => b.paymentStatus === 'released')
    .reduce((s, b) => s + (b.amount || 0), 0)

  // ── Search workers from real API ─────────────────────────
  const handleSearch = async () => {
    setSearching(true)
    try {
      const res = await API.get('/workers/search', {
        params: {
          ...(searchSkill && { skill: searchSkill }),
          ...(searchCity  && { city:  searchCity }),
        }
      })
      const data = Array.isArray(res.data) ? res.data : (res.data.workers || [])
      setWorkerResults(data)
    } catch (_) {
      setWorkerResults([])
    }
    setSearching(false)
  }

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Cancel this booking?')) return
    try { await API.put(`/bookings/${id}/cancel`) } catch (_) {}
    setBookingsList(b => b.map(x =>
      (x._id === id || x.id === id) ? { ...x, status: 'rejected' } : x
    ))
  }

  const tabs = [
    { id: 'overview', label: 'Overview',      icon: '📊' },
    { id: 'search',   label: 'Find Workers',  icon: '🔍' },
    { id: 'bookings', label: 'My Bookings',   icon: '📋', badge: pendingCount + confirmedCount },
    { id: 'payments', label: 'Payments',      icon: '💳' },
  ]

  const displayName = user?.name || 'Employer'
  const initials    = displayName.charAt(0).toUpperCase()

  return (
    <div className={styles.page}>

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarTop}>
          <div className={styles.userAvatar}
            style={{ background: 'linear-gradient(135deg,#1A56DB,#4338CA)' }}>
            {initials}
          </div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{displayName}</div>
            <div className={styles.userRole}>Employer · {user?.city || 'India'}</div>
            <div className={styles.userBadge}>✓ Verified</div>
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

        <button className={styles.logoutBtn} onClick={logout}>🚪 Sign Out</button>
      </aside>

      {/* Mobile header */}
      <div className={styles.mobileHeader}>
        <button className={styles.menuBtn} onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        <span className={styles.mobileTitle}>Work<strong>verra</strong></span>
      </div>

      {/* Main */}
      <main className={styles.main}>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h1 className={styles.pageTitle}>
                Welcome back, {displayName.split(' ')[0]} 👋
              </h1>
              <p className={styles.pageSub}>Here's your hiring activity at a glance</p>
            </div>
            <div className={styles.statsGrid}>
              {[
                { label: 'Total Bookings', val: bookingsList.length, icon: '📋', color: '#1A56DB' },
                { label: 'Confirmed Jobs', val: confirmedCount,      icon: '✅', color: '#059669' },
                { label: 'Completed Jobs', val: completedCount,      icon: '🏆', color: '#7C3AED' },
                { label: 'Total Spent',    val: formatCurrency(totalSpent), icon: '💰', color: '#D97706' },
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
                  <span>🔍</span>
                  <div><strong>Find a Worker</strong><p>Search by skill &amp; location</p></div>
                </button>
                <button className={styles.actionCard} onClick={() => setTab('bookings')}>
                  <span>📋</span>
                  <div><strong>View Bookings</strong><p>{pendingCount} pending action{pendingCount !== 1 ? 's' : ''}</p></div>
                </button>
                <button className={styles.actionCard} onClick={() => navigate('/search')}>
                  <span>🌐</span>
                  <div><strong>Browse All Workers</strong><p>Explore full marketplace</p></div>
                </button>
                <button className={styles.actionCard} onClick={() => navigate('/chat')}>
                  <span>💬</span>
                  <div><strong>Messages</strong><p>Chat with your workers</p></div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FIND WORKERS */}
        {tab === 'search' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h1 className={styles.pageTitle}>Find Workers</h1>
              <p className={styles.pageSub}>Search verified skilled workers in your area</p>
            </div>
            <div className={styles.searchBar}>
              <select className={styles.searchSelect}
                value={searchSkill} onChange={e => setSearchSkill(e.target.value)}>
                <option value="">All Skills</option>
                {SKILLS_LIST.map(s => <option key={s}>{s}</option>)}
              </select>
              <select className={styles.searchSelect}
                value={searchCity} onChange={e => setSearchCity(e.target.value)}>
                <option value="">All Cities</option>
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <button className={styles.searchBtn} onClick={handleSearch} disabled={searching}>
                {searching ? '…' : '🔍 Search'}
              </button>
            </div>

            {!searching && workerResults.length === 0 && (
              <div className={styles.emptyState}>
                <span>🔍</span>
                <p>Select skill or city and click Search to find workers.</p>
              </div>
            )}

            <div className={styles.workerGrid}>
              {workerResults.map(w => {
                const id        = w._id || w.id
                const initials  = (w.name || 'WK').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                const rating    = w.avgRating ?? w.rating ?? 0
                const reviews   = w.reviewCount ?? w.totalReviews ?? 0
                const rate      = w.hourlyRate ?? 0
                const jobs      = w.jobsDone ?? w.completedJobs ?? 0
                const exp       = w.experience ?? 0
                const available = w.isAvailable ?? w.available ?? true
                const verified  = w.isVerified  ?? w.verified  ?? false
                const skillName = w.skill ?? (w.skills?.[0] ?? 'Worker')

                return (
                  <div key={id} className={styles.workerCard}>
                    <div className={styles.workerHeader}>
                      <div className={styles.workerAvatar}
                        style={{ background: 'linear-gradient(135deg,#667eea,#764ba2)' }}>
                        {initials}
                      </div>
                      <div>
                        <div className={styles.workerName}>
                          {w.name}
                          {verified && <span className={styles.badge}>✓</span>}
                        </div>
                        <div className={styles.workerSkill}>{skillName} · {w.city || ''}</div>
                        <div className={styles.workerRating}>
                          {'★'.repeat(Math.floor(rating))} {rating.toFixed(1)} ({reviews})
                        </div>
                      </div>
                    </div>
                    <div className={styles.workerMeta}>
                      <span>💼 {jobs} jobs</span>
                      <span>⏱ {exp}y exp</span>
                      <span className={available ? styles.availBadge : styles.unavailBadge}>
                        {available ? '● Available' : '○ Busy'}
                      </span>
                    </div>
                    <div className={styles.workerRate}>
                      {formatCurrency(rate)}<small>/hr</small>
                    </div>
                    <div className={styles.workerActions}>
                      <button className={styles.viewBtn}
                        onClick={() => navigate(`/worker/${id}`)}>
                        View Profile
                      </button>
                      <button className={styles.bookBtn}
                        onClick={() => navigate(`/booking/${id}`)}
                        disabled={!available}>
                        {available ? 'Book Now' : 'Unavailable'}
                      </button>
                    </div>
                  </div>
                )
              })}
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
            {loadingData ? (
              <div className={styles.emptyState}><span>⏳</span><p>Loading bookings…</p></div>
            ) : (
              <div className={styles.bookingsList}>
                {bookingsList.map(b => {
                  const meta = STATUS_META[b.status] || STATUS_META.pending
                  const id   = b._id || b.id
                  const workerName = b.worker?.name || b.workerName || 'Worker'
                  const skillName  = b.worker?.skill || b.skill || ''
                  return (
                    <div key={id} className={styles.bookingCard}>
                      <div className={styles.bookingLeft}>
                        <div className={styles.bookingWorker}>
                          <div className={styles.bookingAvatar}>
                            {workerName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className={styles.bookingWorkerName}>{workerName}</div>
                            <div className={styles.bookingSkill}>{skillName}</div>
                          </div>
                        </div>
                        <div className={styles.bookingDetails}>
                          {b.date        && <span>📅 {b.date}</span>}
                          {b.time        && <span>🕐 {b.time}</span>}
                          {b.duration    && <span>⏱ {b.duration}h</span>}
                          {b.amount      && <span>💰 {formatCurrency(b.amount)}</span>}
                        </div>
                        {b.description && <p className={styles.bookingDesc}>{b.description}</p>}
                      </div>
                      <div className={styles.bookingRight}>
                        <span className={styles.statusBadge}
                          style={{ background: meta.bg, color: meta.color }}>
                          {meta.label}
                        </span>
                        {b.status === 'pending' && (
                          <button className={styles.cancelBtn}
                            onClick={() => handleCancelBooking(id)}>
                            Cancel
                          </button>
                        )}
                        {b.status === 'confirmed' && b.paymentStatus !== 'released' && (
                          <button className={styles.payBtn}
                            onClick={() => navigate(`/payment/${id}`)}>
                            Pay Now
                          </button>
                        )}
                        <button className={styles.chatBtn}
                          onClick={() => navigate(`/chat/${b.worker?._id || b.workerId}`)}>
                          💬 Chat
                        </button>
                      </div>
                    </div>
                  )
                })}
                {bookingsList.length === 0 && (
                  <div className={styles.emptyState}>
                    <span>📋</span>
                    <p>No bookings yet. Find a worker to get started!</p>
                    <button className={styles.findBtn} onClick={() => setTab('search')}>
                      Find Workers →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* PAYMENTS */}
        {tab === 'payments' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h1 className={styles.pageTitle}>Payment History</h1>
              <p className={styles.pageSub}>Track all your payments and transactions</p>
            </div>
            <div className={styles.paymentSummary}>
              <div className={styles.payCard}>
                <div className={styles.payCardLabel}>Total Spent</div>
                <div className={styles.payCardVal}>{formatCurrency(totalSpent)}</div>
              </div>
              <div className={styles.payCard}>
                <div className={styles.payCardLabel}>Pending</div>
                <div className={styles.payCardVal}>
                  {formatCurrency(
                    bookingsList
                      .filter(b => b.paymentStatus === 'held')
                      .reduce((s, b) => s + (b.amount || 0), 0)
                  )}
                </div>
              </div>
              <div className={styles.payCard}>
                <div className={styles.payCardLabel}>Completed Jobs</div>
                <div className={styles.payCardVal}>{completedCount}</div>
              </div>
            </div>
            <div className={styles.bookingsList}>
              {bookingsList.filter(b => b.paymentStatus).map(b => (
                <div key={b._id || b.id} className={styles.bookingCard}>
                  <div className={styles.bookingLeft}>
                    <div className={styles.bookingWorkerName}>
                      {b.worker?.name || b.workerName || 'Worker'}
                      {b.worker?.skill || b.skill ? ` — ${b.worker?.skill || b.skill}` : ''}
                    </div>
                    <div className={styles.bookingDetails}>
                      {b.date && <span>📅 {b.date}</span>}
                    </div>
                  </div>
                  <div className={styles.bookingRight}>
                    <div className={styles.payAmount}>{formatCurrency(b.amount || 0)}</div>
                    <span className={styles.statusBadge}
                      style={{
                        background: b.paymentStatus === 'released' ? '#D1FAE5' : '#FFF8E7',
                        color:      b.paymentStatus === 'released' ? '#065F46' : '#92400E',
                      }}>
                      {b.paymentStatus === 'released' ? '✓ Paid' : '⏳ Held'}
                    </span>
                  </div>
                </div>
              ))}
              {bookingsList.filter(b => b.paymentStatus).length === 0 && (
                <div className={styles.emptyState}>
                  <span>💳</span><p>No payment records yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default EmployerDashboard
