import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import API from '../../api/axios'
import { SKILLS_LIST, CITIES, formatCurrency } from '../../utils/dummyData'
import { SkeletonCard } from '../../components/shared/Skeleton'
import styles from './Search.module.css'

// ── 4 dummy profiles shown when backend has no data ──────────
const DUMMY_WORKERS = [
  {
    _id: 'demo-1',
    name: 'Ramesh Patel',
    skill: 'Electrician',
    skills: ['Wiring', 'Panel Work', 'AC Installation', 'Inverter Setup'],
    city: 'Indore',
    experience: 8,
    hourlyRate: 450,
    jobsDone: 142,
    avgRating: 4.8,
    reviewCount: 67,
    isAvailable: true,
    isVerified: true,
    avatarGradient: 'linear-gradient(135deg,#43e97b,#38f9d7)',
    _isDummy: true,
  },
  {
    _id: 'demo-2',
    name: 'Priya Verma',
    skill: 'Painter',
    skills: ['Wall Painting', 'Texture Work', 'Waterproofing'],
    city: 'Bhopal',
    experience: 5,
    hourlyRate: 380,
    jobsDone: 89,
    avgRating: 4.6,
    reviewCount: 34,
    isAvailable: true,
    isVerified: true,
    avatarGradient: 'linear-gradient(135deg,#f093fb,#f5576c)',
    _isDummy: true,
  },
  {
    _id: 'demo-3',
    name: 'Suresh Kumar',
    skill: 'Plumber',
    skills: ['Pipe Fitting', 'Leakage Fix', 'Bathroom Setup'],
    city: 'Jabalpur',
    experience: 10,
    hourlyRate: 320,
    jobsDone: 210,
    avgRating: 4.9,
    reviewCount: 102,
    isAvailable: false,
    isVerified: true,
    avatarGradient: 'linear-gradient(135deg,#667eea,#764ba2)',
    _isDummy: true,
  },
  {
    _id: 'demo-4',
    name: 'Anjali Singh',
    skill: 'Cook',
    skills: ['North Indian', 'South Indian', 'Continental', 'Catering'],
    city: 'Gwalior',
    experience: 6,
    hourlyRate: 300,
    jobsDone: 55,
    avgRating: 4.7,
    reviewCount: 28,
    isAvailable: true,
    isVerified: false,
    avatarGradient: 'linear-gradient(135deg,#fa709a,#fee140)',
    _isDummy: true,
  },
]

const SORT_OPTIONS = [
  { value: 'rating',    label: 'Top Rated' },
  { value: 'rate_low',  label: 'Price: Low → High' },
  { value: 'rate_high', label: 'Price: High → Low' },
  { value: 'jobs',      label: 'Most Jobs Done' },
]
const PAGE_SIZE = 6

const Search = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [searchParams] = useSearchParams()

  const [skill,         setSkill]         = useState(searchParams.get('skill') || '')
  const [city,          setCity]          = useState(searchParams.get('city')  || '')
  const [sort,          setSort]          = useState('rating')
  const [availableOnly, setAvailableOnly] = useState(false)
  const [verifiedOnly,  setVerifiedOnly]  = useState(false)
  const [query,         setQuery]         = useState(searchParams.get('q') || '')
  const [page,          setPage]          = useState(1)
  const [sidebarOpen,   setSidebarOpen]   = useState(false)
  const [loading,       setLoading]       = useState(false)
  const [workers,       setWorkers]       = useState([])
  const [total,         setTotal]         = useState(0)
  const [usingDummy,    setUsingDummy]    = useState(false)

  // ── Filter dummy data locally ────────────────────────────
  const getFilteredDummy = useCallback(() => {
    let result = [...DUMMY_WORKERS]
    if (query)         result = result.filter(w =>
      w.name.toLowerCase().includes(query.toLowerCase()) ||
      w.skill.toLowerCase().includes(query.toLowerCase()) ||
      w.skills.some(s => s.toLowerCase().includes(query.toLowerCase()))
    )
    if (skill)         result = result.filter(w => w.skill === skill)
    if (city)          result = result.filter(w => w.city === city)
    if (availableOnly) result = result.filter(w => w.isAvailable)
    if (verifiedOnly)  result = result.filter(w => w.isVerified)
    result.sort((a, b) => {
      if (sort === 'rating')    return b.avgRating   - a.avgRating
      if (sort === 'rate_low')  return a.hourlyRate  - b.hourlyRate
      if (sort === 'rate_high') return b.hourlyRate  - a.hourlyRate
      if (sort === 'jobs')      return b.jobsDone    - a.jobsDone
      return 0
    })
    return result
  }, [query, skill, city, availableOnly, verifiedOnly, sort])

  // ── Fetch real workers; fall back to dummy ───────────────
  const fetchWorkers = useCallback(async () => {
    setLoading(true)
    try {
      const params = {
        ...(query         && { q:         query }),
        ...(skill         && { skill }),
        ...(city          && { city }),
        ...(availableOnly && { available: true }),
        ...(verifiedOnly  && { verified:  true }),
        sort, page, limit: PAGE_SIZE,
      }
      const res = await API.get('/workers/search', { params })
      const data    = Array.isArray(res.data) ? res.data : (res.data.workers || [])
      const count   = Array.isArray(res.data) ? res.data.length : (res.data.total || 0)

      // If backend returns workers → use them, hide dummy notice
      if (data.length > 0) {
        setWorkers(data)
        setTotal(count)
        setUsingDummy(false)
      } else {
        // No real workers yet → show filtered dummy
        const filtered = getFilteredDummy()
        setWorkers(filtered)
        setTotal(filtered.length)
        setUsingDummy(true)
      }
    } catch {
      // Backend not connected → show dummy
      const filtered = getFilteredDummy()
      setWorkers(filtered)
      setTotal(filtered.length)
      setUsingDummy(true)
    }
    setLoading(false)
  }, [query, skill, city, availableOnly, verifiedOnly, sort, page, getFilteredDummy])

  useEffect(() => { fetchWorkers() }, [fetchWorkers])

  const totalPages   = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const clearFilters = () => { setSkill(''); setCity(''); setQuery(''); setAvailableOnly(false); setVerifiedOnly(false); setPage(1) }
  const activeFilters = [skill, city, availableOnly, verifiedOnly].filter(Boolean).length

  // Gradient picker for real workers
  const gradients = [
    'linear-gradient(135deg,#667eea,#764ba2)',
    'linear-gradient(135deg,#f093fb,#f5576c)',
    'linear-gradient(135deg,#43e97b,#38f9d7)',
    'linear-gradient(135deg,#fa709a,#fee140)',
    'linear-gradient(135deg,#4facfe,#00f2fe)',
    'linear-gradient(135deg,#a18cd1,#fbc2eb)',
  ]

  return (
    <div className={styles.page}>
      {/* Search header */}
      <div className={styles.searchHeader}>
        <div className={styles.searchHeaderInner}>
          <form className={styles.searchBar} onSubmit={e => { e.preventDefault(); setPage(1) }}>
            <span className={styles.searchIco}>🔍</span>
            <input className={styles.searchInput}
              placeholder="Search workers, skills, e.g. Plumber in Indore"
              value={query}
              onChange={e => { setQuery(e.target.value); setPage(1) }} />
            {query && (
              <button type="button" className={styles.clearQ} onClick={() => setQuery('')}>✕</button>
            )}
          </form>
          <button
            className={`${styles.filterToggle} ${activeFilters > 0 ? styles.filterActive : ''}`}
            onClick={() => setSidebarOpen(!sidebarOpen)}>
            ⚙ Filters {activeFilters > 0 && <span className={styles.filterCount}>{activeFilters}</span>}
          </button>
        </div>
      </div>

      <div className={styles.body}>
        {/* Sidebar */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
          <div className={styles.sidebarHead}>
            <span>Filters</span>
            {activeFilters > 0 && (
              <button className={styles.clearBtn} onClick={clearFilters}>Clear all</button>
            )}
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Skill</label>
            <select className={styles.filterSelect} value={skill} onChange={e => { setSkill(e.target.value); setPage(1) }}>
              <option value="">All Skills</option>
              {SKILLS_LIST.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>City</label>
            <select className={styles.filterSelect} value={city} onChange={e => { setCity(e.target.value); setPage(1) }}>
              <option value="">All Cities</option>
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Sort By</label>
            <select className={styles.filterSelect} value={sort} onChange={e => { setSort(e.target.value); setPage(1) }}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.toggleLabel}>
              <input type="checkbox" checked={availableOnly} onChange={e => { setAvailableOnly(e.target.checked); setPage(1) }} />
              Available Now
            </label>
            <label className={styles.toggleLabel}>
              <input type="checkbox" checked={verifiedOnly} onChange={e => { setVerifiedOnly(e.target.checked); setPage(1) }} />
              Verified Only
            </label>
          </div>
        </aside>

        {/* Results */}
        <div className={styles.results}>
          <div className={styles.resultsHeader}>
            <span className={styles.resultCount}>
              {loading ? 'Searching…' : `${total} worker${total !== 1 ? 's' : ''} found`}
            </span>
            {usingDummy && !loading && (
              <span className={styles.dummyNote}>
                📌 Showing sample profiles — real workers will appear once registered
              </span>
            )}
          </div>

          {loading ? (
            <div className={styles.grid}>
              {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : workers.length === 0 ? (
            <div className={styles.emptyState}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔍</div>
              <h3>No workers found</h3>
              <p>Try adjusting your filters or search query</p>
              <button className={styles.clearFiltersBtn} onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className={styles.grid}>
              {workers.map((w, idx) => {
                const initials  = (w.name || 'WK').split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()
                const avgRating = w.avgRating ?? w.rating ?? 0
                const reviews   = w.reviewCount ?? w.totalReviews ?? 0
                const rate      = w.hourlyRate ?? 0
                const jobs      = w.jobsDone ?? w.completedJobs ?? 0
                const exp       = w.experience ?? 0
                const available = w.isAvailable ?? w.available ?? true
                const verified  = w.isVerified  ?? w.verified  ?? false
                const skillName = w.skill ?? (w.skills?.[0] ?? 'Worker')
                const cityName  = w.city ?? ''
                const gradient  = w.avatarGradient || gradients[idx % gradients.length]
                const workerId  = w._id ?? w.id

                return (
                  <div key={workerId} className={styles.workerCard}>
                    {w._isDummy && (
                      <div className={styles.dummyTag}>Sample</div>
                    )}
                    <div className={styles.cardTop}>
                      <div className={styles.avatar} style={{ background: gradient }}>
                        {initials}
                      </div>
                      <div className={styles.cardInfo}>
                        <div className={styles.workerName}>
                          {w.name}
                          {verified && <span className={styles.verifiedTag}>✓</span>}
                        </div>
                        <div className={styles.workerSkill}>{skillName} · {cityName}</div>
                        <div className={styles.workerRating}>
                          <span className={styles.stars}>{'★'.repeat(Math.floor(avgRating))}</span>
                          <strong>{avgRating.toFixed(1)}</strong>
                          <span>({reviews})</span>
                        </div>
                      </div>
                      <div className={`${styles.availDot} ${available ? styles.dotOn : styles.dotOff}`}
                        title={available ? 'Available' : 'Busy'} />
                    </div>

                    <div className={styles.cardMeta}>
                      <span>💼 {jobs} jobs</span>
                      <span>⏱ {exp}y exp</span>
                    </div>

                    {w.skills?.length > 0 && (
                      <div className={styles.skillTags}>
                        {w.skills.slice(0, 3).map(s => (
                          <span key={s} className={styles.skillTag}>{s}</span>
                        ))}
                        {w.skills.length > 3 && <span className={styles.skillTag}>+{w.skills.length - 3}</span>}
                      </div>
                    )}

                    <div className={styles.cardFooter}>
                      <div className={styles.rateBlock}>
                        <div className={styles.rate}>{formatCurrency(rate)}<span>/hr</span></div>
                        <div className={styles.rateDay}>{formatCurrency(rate * 8)}<span>/day</span></div>
                      </div>
                      <div className={styles.actions}>
                        <button className={styles.viewBtn}
                          onClick={() => w._isDummy ? alert('This is a sample profile. Real profiles appear when workers register.') : navigate(`/worker/${workerId}`)}>
                          View
                        </button>
                        <button className={styles.bookBtn}
                          disabled={!available}
                          onClick={() => {
                            if (w._isDummy) { alert('Register to book real workers!'); return }
                            isAuthenticated ? navigate(`/booking/${workerId}`) : navigate('/login')
                          }}>
                          {available ? 'Book' : 'Busy'}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Pagination — only for real data */}
          {!loading && !usingDummy && totalPages > 1 && (
            <div className={styles.pagination}>
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className={styles.pageBtn}>← Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} className={`${styles.pageBtn} ${page === p ? styles.pageActive : ''}`}
                  onClick={() => setPage(p)}>{p}</button>
              ))}
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className={styles.pageBtn}>Next →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Search
