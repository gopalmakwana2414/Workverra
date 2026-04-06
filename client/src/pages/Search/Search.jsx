import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import API from '../../api/axios'
import { SKILLS_LIST, CITIES, formatCurrency } from '../../utils/dummyData'
import { SkeletonCard } from '../../components/shared/Skeleton'
import styles from './Search.module.css'

const SORT_OPTIONS = [
  { value:'rating',    label:'Top Rated' },
  { value:'rate_low',  label:'Price: Low → High' },
  { value:'rate_high', label:'Price: High → Low' },
  { value:'jobs',      label:'Most Jobs Done' },
]
const PAGE_SIZE = 6

const Search = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()

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
  const [error,         setError]         = useState('')

  // ── Fetch from real backend ──────────────────────────────
  const fetchWorkers = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = {
        ...(query        && { q:           query }),
        ...(skill        && { skill:       skill }),
        ...(city         && { city:        city  }),
        ...(availableOnly && { available:  true  }),
        ...(verifiedOnly  && { verified:   true  }),
        sort,
        page,
        limit: PAGE_SIZE,
      }
      const res = await API.get('/workers/search', { params })
      // handle both { workers, total } and plain array responses
      if (Array.isArray(res.data)) {
        setWorkers(res.data)
        setTotal(res.data.length)
      } else {
        setWorkers(res.data.workers || [])
        setTotal(res.data.total    || 0)
      }
    } catch (err) {
      setError('Could not load workers. Please check your connection.')
      setWorkers([])
      setTotal(0)
    }
    setLoading(false)
  }, [query, skill, city, availableOnly, verifiedOnly, sort, page])

  useEffect(() => { fetchWorkers() }, [fetchWorkers])

  // sync query param from navbar search
  useEffect(() => {
    const q = searchParams.get('q')
    if (q && q !== query) setQuery(q)
  }, [searchParams])

  const totalPages  = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const clearFilters = () => {
    setSkill(''); setCity(''); setQuery(''); setAvailableOnly(false)
    setVerifiedOnly(false); setPage(1)
  }
  const activeFilters = [skill, city, availableOnly, verifiedOnly].filter(Boolean).length

  return (
    <div className={styles.page}>
      {/* Search header */}
      <div className={styles.searchHeader}>
        <div className={styles.searchHeaderInner}>
          <Link to="/" className={styles.backHome}>← Workverra</Link>
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
            <select className={styles.filterSelect} value={skill}
              onChange={e => { setSkill(e.target.value); setPage(1) }}>
              <option value="">All Skills</option>
              {SKILLS_LIST.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>City</label>
            <select className={styles.filterSelect} value={city}
              onChange={e => { setCity(e.target.value); setPage(1) }}>
              <option value="">All Cities</option>
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Sort By</label>
            <select className={styles.filterSelect} value={sort}
              onChange={e => { setSort(e.target.value); setPage(1) }}>
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.toggleLabel}>
              <input type="checkbox" checked={availableOnly}
                onChange={e => { setAvailableOnly(e.target.checked); setPage(1) }} />
              Available Now
            </label>
            <label className={styles.toggleLabel}>
              <input type="checkbox" checked={verifiedOnly}
                onChange={e => { setVerifiedOnly(e.target.checked); setPage(1) }} />
              Verified Only
            </label>
          </div>
        </aside>

        {/* Results */}
        <div className={styles.results}>
          <div className={styles.resultsHeader}>
            <span className={styles.resultCount}>
              {loading ? 'Searching…' : (
                `${total} worker${total !== 1 ? 's' : ''} found`
                + ((skill || city) ? ` for "${[skill, city].filter(Boolean).join(' in ')}"` : '')
              )}
            </span>
          </div>

          {error && (
            <div className={styles.emptyState}>
              <div style={{ fontSize:'2.5rem', marginBottom:12 }}>⚠️</div>
              <h3>Something went wrong</h3>
              <p>{error}</p>
              <button className={styles.clearFiltersBtn} onClick={fetchWorkers}>Retry</button>
            </div>
          )}

          {loading ? (
            <div className={styles.grid}>
              {Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : !error && workers.length === 0 ? (
            <div className={styles.emptyState}>
              <div style={{ fontSize:'3rem', marginBottom:12 }}>🔍</div>
              <h3>No workers found</h3>
              <p>Try adjusting your filters or search query</p>
              <button className={styles.clearFiltersBtn} onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className={styles.grid}>
              {workers.map(w => {
                const initials = (w.name || 'WK').split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()
                const avgRating = w.avgRating ?? w.rating ?? 0
                const reviews   = w.reviewCount ?? w.totalReviews ?? 0
                const rate      = w.hourlyRate ?? w.rate ?? 0
                const jobs      = w.jobsDone ?? w.completedJobs ?? 0
                const exp       = w.experience ?? 0
                const available = w.isAvailable ?? w.available ?? true
                const verified  = w.isVerified  ?? w.verified  ?? false
                const skillName = w.skill ?? (w.skills?.[0] ?? 'Worker')
                const cityName  = w.city ?? ''

                return (
                  <div key={w._id ?? w.id} className={styles.workerCard}>
                    <div className={styles.cardTop}>
                      <div className={styles.avatar}
                        style={{ background: 'linear-gradient(135deg,#667eea,#764ba2)' }}>
                        {initials}
                      </div>
                      <div className={styles.cardInfo}>
                        <div className={styles.workerName}>
                          {w.name}
                          {verified  && <span className={styles.verifiedTag}>✓</span>}
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
                        {w.skills.length > 3 && (
                          <span className={styles.skillTag}>+{w.skills.length - 3}</span>
                        )}
                      </div>
                    )}

                    <div className={styles.cardFooter}>
                      <div className={styles.rate}>
                        {formatCurrency(rate)}<span>/hr</span>
                      </div>
                      <div className={styles.actions}>
                        <button className={styles.viewBtn}
                          onClick={() => navigate(`/worker/${w._id ?? w.id}`)}>
                          View
                        </button>
                        <button className={styles.bookBtn}
                          disabled={!available}
                          onClick={() => isAuthenticated
                            ? navigate(`/booking/${w._id ?? w.id}`)
                            : navigate('/login')
                          }>
                          {available ? 'Book' : 'Busy'}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className={styles.pagination}>
              <button disabled={page === 1}
                onClick={() => setPage(p => p - 1)} className={styles.pageBtn}>← Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p}
                  className={`${styles.pageBtn} ${page === p ? styles.pageActive : ''}`}
                  onClick={() => setPage(p)}>{p}</button>
              ))}
              <button disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)} className={styles.pageBtn}>Next →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Search