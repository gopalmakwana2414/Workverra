import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { workers, SKILLS_LIST, CITIES, formatCurrency } from '../../utils/dummyData'
import styles from './Search.module.css'

const SORT_OPTIONS = [
  { value: 'rating', label: 'Top Rated' },
  { value: 'rate_low', label: 'Price: Low → High' },
  { value: 'rate_high', label: 'Price: High → Low' },
  { value: 'jobs', label: 'Most Jobs Done' },
]

const PAGE_SIZE = 4

const Search = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [skill, setSkill] = useState(searchParams.get('skill') || '')
  const [city, setCity] = useState(searchParams.get('city') || '')
  const [sort, setSort] = useState('rating')
  const [availableOnly, setAvailableOnly] = useState(false)
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [page, setPage] = useState(1)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Sync query from URL
  useEffect(() => {
    const q = searchParams.get('q')
    if (q) setQuery(q)
  }, [searchParams])

  const filtered = useMemo(() => {
    let result = [...workers]

    if (query) {
      const q = query.toLowerCase()
      result = result.filter(w =>
        w.name.toLowerCase().includes(q) ||
        w.skill.toLowerCase().includes(q) ||
        w.skills.some(s => s.toLowerCase().includes(q))
      )
    }
    if (skill) result = result.filter(w => w.skill === skill)
    if (city) result = result.filter(w => w.city === city)
    if (availableOnly) result = result.filter(w => w.available)
    if (verifiedOnly) result = result.filter(w => w.verified)

    result.sort((a, b) => {
      if (sort === 'rating') return b.rating - a.rating
      if (sort === 'rate_low') return a.hourlyRate - b.hourlyRate
      if (sort === 'rate_high') return b.hourlyRate - a.hourlyRate
      if (sort === 'jobs') return b.jobsDone - a.jobsDone
      return 0
    })

    return result
  }, [query, skill, city, sort, availableOnly, verifiedOnly])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const clearFilters = () => {
    setSkill(''); setCity(''); setQuery('')
    setAvailableOnly(false); setVerifiedOnly(false)
    setPage(1)
  }

  const activeFilterCount = [skill, city, availableOnly, verifiedOnly].filter(Boolean).length

  return (
    <div className={styles.page}>

      {/* ── Search Header ── */}
      <div className={styles.searchHeader}>
        <div className={styles.searchHeaderInner}>
          <form className={styles.searchBar} onSubmit={e => { e.preventDefault(); setPage(1) }}>
            <span className={styles.searchIco}>🔍</span>
            <input
              className={styles.searchInput}
              placeholder="Search by skill, name (e.g. Electrician, Mohan)..."
              value={query}
              onChange={e => { setQuery(e.target.value); setPage(1) }}
            />
            {query && (
              <button type="button" className={styles.clearSearch} onClick={() => setQuery('')}>✕</button>
            )}
          </form>

          <div className={styles.sortRow}>
            <button
              className={`${styles.filterToggle} ${activeFilterCount > 0 ? styles.filterActive : ''}`}
              onClick={() => setSidebarOpen(v => !v)}
            >
              ⚙ Filters {activeFilterCount > 0 && <span className={styles.filterBadge}>{activeFilterCount}</span>}
            </button>
            <select className={styles.sortSelect} value={sort} onChange={e => { setSort(e.target.value); setPage(1) }}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className={styles.layout}>

        {/* ── Sidebar Filters ── */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
          <div className={styles.sidebarHead}>
            <h3>Filters</h3>
            {activeFilterCount > 0 && (
              <button className={styles.clearBtn} onClick={clearFilters}>Clear all</button>
            )}
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Skill</label>
            <select className={styles.filterSelect} value={skill}
              onChange={e => { setSkill(e.target.value); setPage(1) }}>
              <option value="">All Skills</option>
              {SKILLS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>City</label>
            <select className={styles.filterSelect} value={city}
              onChange={e => { setCity(e.target.value); setPage(1) }}>
              <option value="">All Cities</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Availability</label>
            <label className={styles.checkLabel}>
              <input type="checkbox" checked={availableOnly}
                onChange={e => { setAvailableOnly(e.target.checked); setPage(1) }} />
              Available now only
            </label>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Verification</label>
            <label className={styles.checkLabel}>
              <input type="checkbox" checked={verifiedOnly}
                onChange={e => { setVerifiedOnly(e.target.checked); setPage(1) }} />
              Verified workers only
            </label>
          </div>

          <button className={styles.applyBtn} onClick={() => setSidebarOpen(false)}>
            Apply Filters
          </button>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
        )}

        {/* ── Results ── */}
        <main className={styles.results}>
          <div className={styles.resultsHeader}>
            <p className={styles.resultCount}>
              {filtered.length === 0
                ? 'No workers found'
                : `Showing ${Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length} workers`}
              {skill && <span className={styles.activeTag}>{skill}</span>}
              {city && <span className={styles.activeTag}>{city}</span>}
            </p>
          </div>

          {paginated.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🔍</div>
              <h3>No workers found</h3>
              <p>Try adjusting your filters or search terms</p>
              <button className={styles.clearBtn2} onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className={styles.workerGrid}>
              {paginated.map(worker => (
                <WorkerCard key={worker.id} worker={worker} onView={() => navigate(`/worker/${worker.id}`)} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >← Prev</button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  className={`${styles.pageNum} ${p === page ? styles.pageActive : ''}`}
                  onClick={() => setPage(p)}
                >{p}</button>
              ))}

              <button
                className={styles.pageBtn}
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
              >Next →</button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

const WorkerCard = ({ worker, onView }) => (
  <div className={styles.workerCard} onClick={onView}>
    <div className={styles.cardTop}>
      <div className={styles.avatar} style={{ background: worker.avatarGradient }}>
        {worker.initials}
      </div>
      <div className={styles.cardTopRight}>
        <div className={styles.workerName}>{worker.name}</div>
        <div className={styles.workerMeta}>{worker.skill} · {worker.experience}yr exp · 📍 {worker.city}</div>
        <div className={styles.badges}>
          {worker.verified && <span className={styles.verifiedBadge}>✓ Verified</span>}
          {worker.badge && <span className={styles.proBadge}>{worker.badge}</span>}
          <span className={`${styles.availBadge} ${worker.available ? styles.green : styles.gray}`}>
            {worker.available ? '● Available' : '○ Busy'}
          </span>
        </div>
      </div>
      <div className={styles.rateBox}>
        <div className={styles.rateVal}>{formatCurrency(worker.hourlyRate)}</div>
        <div className={styles.rateLabel}>/hr</div>
      </div>
    </div>

    <div className={styles.skillTags}>
      {worker.skills.slice(0, 4).map(s => (
        <span key={s} className={styles.skillTag}>{s}</span>
      ))}
    </div>

    <div className={styles.cardBottom}>
      <div className={styles.ratingRow}>
        <span className={styles.stars}>{'★'.repeat(Math.floor(worker.rating))}</span>
        <span className={styles.ratingVal}>{worker.rating}</span>
        <span className={styles.reviewCount}>({worker.totalReviews} reviews)</span>
        <span className={styles.sep}>·</span>
        <span className={styles.jobsDone}>{worker.jobsDone} jobs done</span>
      </div>
      <button className={styles.viewBtn} onClick={e => { e.stopPropagation(); onView() }}>
        View Profile →
      </button>
    </div>
  </div>
)

export default Search
