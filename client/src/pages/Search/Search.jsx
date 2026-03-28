import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  workers,
  SKILLS_LIST,
  CITIES,
  getWorkersBySkill,
  getWorkersByCity,
  formatCurrency,
} from '../../utils/dummyData'
import styles from './Search.module.css'

const SORT_OPTIONS = [
  { value: 'rating', label: 'Top Rated' },
  { value: 'rate_low', label: 'Price: Low to High' },
  { value: 'rate_high', label: 'Price: High to Low' },
  { value: 'reviews', label: 'Most Reviewed' },
  { value: 'experience', label: 'Most Experienced' },
]

const Search = () => {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selectedSkill, setSelectedSkill] = useState('All')
  const [selectedCity, setSelectedCity] = useState('All')
  const [sortBy, setSortBy] = useState('rating')
  const [minRating, setMinRating] = useState(0)
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [availableOnly, setAvailableOnly] = useState(false)
  const [maxRate, setMaxRate] = useState(1000)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const filtered = useMemo(() => {
    let result = [...workers]

    // Text search
    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          w.skill.toLowerCase().includes(q) ||
          w.skills.some((s) => s.toLowerCase().includes(q)) ||
          w.city.toLowerCase().includes(q)
      )
    }

    // Skill filter
    if (selectedSkill !== 'All') {
      result = result.filter((w) => w.skill === selectedSkill)
    }

    // City filter
    if (selectedCity !== 'All') {
      result = result.filter((w) => w.city === selectedCity)
    }

    // Rating filter
    if (minRating > 0) {
      result = result.filter((w) => w.rating >= minRating)
    }

    // Verified filter
    if (verifiedOnly) {
      result = result.filter((w) => w.verified)
    }

    // Available filter
    if (availableOnly) {
      result = result.filter((w) => w.available)
    }

    // Max rate filter
    result = result.filter((w) => w.hourlyRate <= maxRate)

    // Sort
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'rate_low':
        result.sort((a, b) => a.hourlyRate - b.hourlyRate)
        break
      case 'rate_high':
        result.sort((a, b) => b.hourlyRate - a.hourlyRate)
        break
      case 'reviews':
        result.sort((a, b) => b.totalReviews - a.totalReviews)
        break
      case 'experience':
        result.sort((a, b) => b.experience - a.experience)
        break
      default:
        break
    }

    return result
  }, [query, selectedSkill, selectedCity, sortBy, minRating, verifiedOnly, availableOnly, maxRate])

  const resetFilters = () => {
    setQuery('')
    setSelectedSkill('All')
    setSelectedCity('All')
    setSortBy('rating')
    setMinRating(0)
    setVerifiedOnly(false)
    setAvailableOnly(false)
    setMaxRate(1000)
  }

  const activeFilterCount = [
    selectedSkill !== 'All',
    selectedCity !== 'All',
    minRating > 0,
    verifiedOnly,
    availableOnly,
    maxRate < 1000,
  ].filter(Boolean).length

  return (
    <div className={styles.page}>
      {/* Search Header */}
      <div className={styles.searchHeader}>
        <div className={styles.searchHeaderInner}>
          <div className={styles.searchBarWrap}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              className={styles.searchBar}
              placeholder="Search by skill, name, or city..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button className={styles.clearSearch} onClick={() => setQuery('')}>✕</button>
            )}
          </div>

          <div className={styles.headerRight}>
            <select
              className={styles.sortSelect}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <button
              className={`${styles.filterToggle} ${sidebarOpen ? styles.filterActive : ''}`}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ⚙ Filters {activeFilterCount > 0 && <span className={styles.filterBadge}>{activeFilterCount}</span>}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.mainLayout}>
        {/* Sidebar Filters */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
          <div className={styles.sidebarHeader}>
            <h3 className={styles.sidebarTitle}>Filters</h3>
            {activeFilterCount > 0 && (
              <button className={styles.resetBtn} onClick={resetFilters}>Reset all</button>
            )}
          </div>

          {/* Skill */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Skill / Category</label>
            <div className={styles.skillGrid}>
              <button
                className={`${styles.skillPill} ${selectedSkill === 'All' ? styles.skillActive : ''}`}
                onClick={() => setSelectedSkill('All')}
              >
                All
              </button>
              {SKILLS_LIST.map((skill) => (
                <button
                  key={skill}
                  className={`${styles.skillPill} ${selectedSkill === skill ? styles.skillActive : ''}`}
                  onClick={() => setSelectedSkill(skill)}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* City */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>City</label>
            <select
              className={styles.filterSelect}
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="All">All Cities</option>
              {CITIES.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Min Rating */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>
              Minimum Rating: <strong>{minRating > 0 ? `${minRating}★` : 'Any'}</strong>
            </label>
            <div className={styles.ratingBtns}>
              {[0, 4, 4.5, 4.8].map((r) => (
                <button
                  key={r}
                  className={`${styles.ratingBtn} ${minRating === r ? styles.ratingActive : ''}`}
                  onClick={() => setMinRating(r)}
                >
                  {r === 0 ? 'Any' : `${r}★+`}
                </button>
              ))}
            </div>
          </div>

          {/* Max Rate */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>
              Max Rate: <strong>{maxRate >= 1000 ? 'Any' : `₹${maxRate}/hr`}</strong>
            </label>
            <input
              type="range"
              min={100}
              max={1000}
              step={50}
              value={maxRate}
              onChange={(e) => setMaxRate(Number(e.target.value))}
              className={styles.rangeSlider}
            />
            <div className={styles.rangeLabels}>
              <span>₹100</span><span>₹1000+</span>
            </div>
          </div>

          {/* Toggles */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Other Filters</label>
            <div className={styles.toggleList}>
              <label className={styles.toggleRow}>
                <div className={styles.toggleTrack} data-on={verifiedOnly}>
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className={styles.toggleInput}
                  />
                  <div className={styles.toggleThumb}></div>
                </div>
                <span>Verified workers only</span>
              </label>

              <label className={styles.toggleRow}>
                <div className={styles.toggleTrack} data-on={availableOnly}>
                  <input
                    type="checkbox"
                    checked={availableOnly}
                    onChange={(e) => setAvailableOnly(e.target.checked)}
                    className={styles.toggleInput}
                  />
                  <div className={styles.toggleThumb}></div>
                </div>
                <span>Available now</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Results */}
        <main className={styles.results}>
          <div className={styles.resultsHeader}>
            <p className={styles.resultsCount}>
              <strong>{filtered.length}</strong> worker{filtered.length !== 1 ? 's' : ''} found
              {selectedSkill !== 'All' && ` for "${selectedSkill}"`}
              {selectedCity !== 'All' && ` in ${selectedCity}`}
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🔍</div>
              <h3>No workers found</h3>
              <p>Try adjusting your filters or search term</p>
              <button className={styles.resetBtn2} onClick={resetFilters}>Clear all filters</button>
            </div>
          ) : (
            <div className={styles.workerGrid}>
              {filtered.map((worker) => (
                <WorkerCard
                  key={worker.id}
                  worker={worker}
                  onClick={() => navigate(`/worker/${worker.id}`)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

// ── Worker Card Component ──
const WorkerCard = ({ worker, onClick }) => {
  return (
    <div className={styles.workerCard} onClick={onClick}>
      {/* Availability dot */}
      <div className={styles.cardTop}>
        <div className={styles.avatarWrap}>
          <div className={styles.avatar} style={{ background: worker.avatarGradient }}>
            {worker.initials}
          </div>
          <span className={`${styles.availDot} ${worker.available ? styles.availGreen : styles.availGray}`}></span>
        </div>

        <div className={styles.cardTopRight}>
          <div className={styles.workerRate}>{formatCurrency(worker.hourlyRate)}<span>/hr</span></div>
          <div className={styles.workerDistance}>📍 {worker.distance}</div>
        </div>
      </div>

      <div className={styles.workerName}>{worker.name}</div>
      <div className={styles.workerMeta}>
        <span className={styles.workerSkill}>{worker.skill}</span>
        <span className={styles.dot}>·</span>
        <span>{worker.experience} yrs exp</span>
        <span className={styles.dot}>·</span>
        <span>{worker.city}</span>
      </div>

      <div className={styles.ratingRow}>
        <span className={styles.stars}>{'★'.repeat(Math.floor(worker.rating))}{'☆'.repeat(5 - Math.floor(worker.rating))}</span>
        <span className={styles.ratingVal}>{worker.rating}</span>
        <span className={styles.reviewCount}>({worker.totalReviews} reviews)</span>
      </div>

      <div className={styles.badges}>
        {worker.verified && (
          <span className={styles.verifiedBadge}>✓ Verified</span>
        )}
        {worker.badge && (
          <span className={styles.proBadge}>{worker.badge}</span>
        )}
        {!worker.available && (
          <span className={styles.unavailBadge}>Unavailable</span>
        )}
      </div>

      <div className={styles.skillTags}>
        {worker.skills.slice(0, 3).map((s) => (
          <span key={s} className={styles.skillTag}>{s}</span>
        ))}
        {worker.skills.length > 3 && (
          <span className={styles.skillTagMore}>+{worker.skills.length - 3}</span>
        )}
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.responseTime}>⚡ Responds {worker.responseTime}</div>
        <button className={styles.bookBtn} onClick={(e) => { e.stopPropagation(); onClick() }}>
          Book Now
        </button>
      </div>
    </div>
  )
}

export default Search
