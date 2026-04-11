import { useState } from 'react'
import styles from './BlogPage.module.css'

const CATEGORIES = ['All', 'For Workers', 'For Employers', 'Platform Updates', 'Tips & Guides']

const FULL_CONTENT = {
  1: `Your Workverra profile is your digital storefront. Workers with fully completed profiles receive 3x more booking requests than those with incomplete ones. Here's exactly what you need:

**Profile Photo**: Upload a clear, professional photo. Profiles with photos get 5x more clicks.

**Primary Skill**: Choose accurately — this determines which employer searches show your profile.

**About Section**: Write 3-4 sentences describing your experience, what you specialize in, and what makes your work stand out. Be specific: "8 years of residential electrical work, specializing in AC installation and inverter setup" beats "experienced electrician."

**Hourly Rate**: Research what others in your city charge. Start competitive, then raise your rate as your reviews build up.

**Skills Tags**: Add up to 5 specific skills beyond your primary. These help you appear in more searches.

**Certifications**: Upload photos of any ITI certificates, trade licenses, or training completions. Employers trust verified credentials.

**Response Time**: Keep it under 15 minutes. Workers who respond quickly get booked first.

The #1 mistake workers make is leaving their "About" section blank. Fill it in today — it takes 5 minutes and could triple your bookings.`,

  2: `Hiring someone you haven't met before requires a system. Here are the five checks that experienced Workverra employers use every time:

**1. The Verification Badge**: Look for the blue "Verified" badge. This means Workverra has reviewed the worker's identity and credentials. Start your search with "Verified Only" filter enabled.

**2. Star Rating & Reviews**: Don't just look at the average — read the actual reviews. Look for patterns. If three separate employers mention "arrived on time" — that's reliable. If two mention "left before finishing" — that's a warning.

**3. Response Time**: Workers who respond quickly are more professional and available. The profile shows average response time. Under 15 minutes is excellent.

**4. Job Success Rate**: Check total bookings vs. completion rate. A worker with 50 bookings and 48 completions (96%) is more reliable than one with 5 bookings.

**5. Escrow Payment**: Always pay through Workverra's escrow. Never pay cash in advance. Your money is protected until you confirm the job is done to your satisfaction.

Bonus: Write a detailed job description. Workers who understand exactly what's needed give better quotes and arrive better prepared.`,

  3: `Workverra has officially expanded into 50 new cities across South India, covering Tamil Nadu, Kerala, Karnataka, Andhra Pradesh, and Telangana.

This expansion brings our platform to major cities including Chennai, Bengaluru, Hyderabad, Kochi, Coimbatore, Madurai, Visakhapatnam, Mangaluru, Mysuru, and Thiruvananthapuram — along with 40 additional Tier 2 cities.

**Why South India?**
South India has one of the highest concentrations of skilled workers in the country, with strong ITI enrollment and vocational training. At the same time, the demand for verified home services in growing urban centers is unmet. Workverra is built for exactly this gap.

**What's available now:**
- Electricians, plumbers, carpenters, painters, AC technicians
- Workers verified and onboarded in Chennai, Bengaluru, and Hyderabad
- Tamil, Telugu, Kannada, and Malayalam language support in profiles

**Coming next:** Goa, Odisha, Jharkhand, and Bihar are in active planning.

If you're a skilled worker in South India, join Workverra today and be among the first verified workers in your city.`,

  4: `Many users ask: "Why do I have to pay upfront if the job isn't done yet?" It's a fair question — and once you understand escrow, you'll never want to pay any other way.

**What is escrow?**
Escrow is a secure holding account. When you pay for a booking, your money goes to Workverra's escrow (managed by Razorpay) — not directly to the worker. The worker only receives it after you confirm the job is complete.

**Why this protects employers:**
- You're never at risk of paying for work that doesn't happen
- If a worker cancels, you get a full refund
- If you're unsatisfied, you can dispute before confirming
- There's a complete payment audit trail for accountability

**Why this protects workers:**
- Payment is guaranteed once work is confirmed
- No risk of employers refusing to pay after work is done
- Builds trust between both parties from the first booking

**The release flow:**
1. Employer pays → funds held in escrow
2. Worker completes job
3. Employer taps "Confirm Completion"
4. Payment released to worker instantly

**What if there's a dispute?**
Contact our team at team.workverra@gmail.com before confirming or declining. We review the evidence and mediate fairly. Most disputes are resolved within 24 hours.

Escrow payments are the backbone of Workverra's trust system. They're what make hiring a stranger feel safe.`,

  5: `Ramesh Patel, a plumber from Indore, was earning ₹200 a day from irregular word-of-mouth work when he joined Workverra six months ago.

Today, he earns ₹1,500+ a day, has a 4.9-star rating, and has completed 120 bookings.

**His journey in his own words:**

"Before Workverra, I would get maybe 2-3 jobs a week from neighbors and referrals. Some weeks nothing. I had no way to show my experience to new customers."

After joining, Ramesh completed his profile with photos of past work, his ITI certificate, and a clear description of his specializations. Within 2 weeks, he had his first booking from an employer he'd never met.

"The first booking was scary. But the escrow system made both of us comfortable. He paid, I did the work, he confirmed — and the money was in my account the same day."

**What changed:**
- 6-7 bookings per week (up from 2-3)
- Built a base of 40 repeat customers
- Raised his hourly rate from ₹280 to ₹420 as reviews accumulated
- Got the "Top Rated Pro" badge after 50 five-star reviews

"My son sees my Workverra profile and feels proud. I have a digital identity now. I'm not just a guy with a phone number — I'm Ramesh Patel, 4.9 stars, 120 jobs."

If you're a skilled worker in any city, your story can be next.`,

  6: `A clear job description is the difference between a smooth booking and a frustrating one. Here's the template our top employers use every time.

**The 4 parts of a great job description:**

**1. What needs to be done (specific)**
Bad: "Fix something electrical"
Good: "Install 2 ceiling fans in bedroom and living room, connect to existing wiring, test operation"

**2. Location details**
"3rd floor apartment, elevator available, no parking issue"

**3. Timeline and urgency**
"Prefer this weekend, Saturday morning is best. Not urgent — flexible by 1 week if needed."

**4. Any special requirements**
"Need someone with AC repair experience as well — might add a servicing if available. Worker should bring their own tools."

**Template to copy:**
"I need [specific task] at [location type] in [area of city]. The work involves [detail 1], [detail 2], [detail 3]. I prefer [date/time]. [Any special notes]. Budget: [₹X/hr or fixed price discussion]."

**Why it matters:**
Workers who receive detailed descriptions show up prepared, work faster, and give more accurate quotes. You'll also attract better applicants — experienced workers prefer clear briefs over vague ones.

Save this template. Your next booking will go twice as smoothly.`
}

const POSTS = [
  { id: 1, category: 'For Workers',       date: '12 Apr 2026', readTime: '5 min read', title: 'How to Build a 5-Star Worker Profile on Workverra',               excerpt: 'Your profile is your digital resume. Workers with complete profiles get 3x more booking requests.', author: 'Meera Sharma',  authorRole: 'Head of Operations',      avatar: 'MS', avatarGradient: 'linear-gradient(135deg,#f093fb,#f5576c)', featured: true,  tags: ['Profile','Tips'] },
  { id: 2, category: 'For Employers',     date: '8 Apr 2026',  readTime: '4 min read', title: '5 Things to Check Before Hiring a Worker Online',                  excerpt: 'These five simple checks will protect you every time you hire on Workverra.',                     author: 'Gopal Makwana', authorRole: 'Founder & CEO',           avatar: 'GM', avatarGradient: 'linear-gradient(135deg,#667eea,#764ba2)', featured: false, tags: ['Hiring','Safety'] },
  { id: 3, category: 'Platform Updates',  date: '2 Apr 2026',  readTime: '2 min read', title: 'Workverra Now Available in 50 New Cities Across South India',       excerpt: 'We\'re excited to announce expansion into Tamil Nadu, Kerala, Karnataka, Andhra Pradesh, and Telangana.', author: 'Arjun Verma',   authorRole: 'CTO',                     avatar: 'AV', avatarGradient: 'linear-gradient(135deg,#43e97b,#38f9d7)', featured: false, tags: ['Expansion','News'] },
  { id: 4, category: 'Tips & Guides',     date: '28 Mar 2026', readTime: '6 min read', title: 'How Escrow Payments Protect Both Workers and Employers',            excerpt: 'Once you understand the escrow system, you\'ll never want to pay any other way.',                author: 'Priya Patel',   authorRole: 'Head of Worker Relations', avatar: 'PP', avatarGradient: 'linear-gradient(135deg,#fa709a,#fee140)', featured: false, tags: ['Payments','Safety'] },
  { id: 5, category: 'For Workers',       date: '22 Mar 2026', readTime: '7 min read', title: 'From ₹200/day to ₹1,500/day: A Plumber\'s Success Story',           excerpt: 'Six months after joining Workverra, Ramesh is earning ₹1,500+ a day with a 4.9-star rating.',     author: 'Meera Sharma',  authorRole: 'Head of Operations',      avatar: 'MS', avatarGradient: 'linear-gradient(135deg,#f093fb,#f5576c)', featured: false, tags: ['Success Story','Workers'] },
  { id: 6, category: 'Tips & Guides',     date: '15 Mar 2026', readTime: '4 min read', title: 'Complete Guide to Writing a Great Job Booking Description',         excerpt: 'A clear job description leads to faster acceptance and better results.',                          author: 'Gopal Makwana', authorRole: 'Founder & CEO',           avatar: 'GM', avatarGradient: 'linear-gradient(135deg,#667eea,#764ba2)', featured: false, tags: ['Guide','Employers'] },
]

const BlogPage = () => {
  const [activeCat, setActiveCat]     = useState('All')
  const [openPost, setOpenPost]       = useState(null)
  const [showWrite, setShowWrite]     = useState(false)
  const [writeForm, setWriteForm]     = useState({ title:'', category:'For Workers', content:'' })
  const [submitted, setSubmitted]     = useState(false)

  const filtered  = activeCat === 'All' ? POSTS : POSTS.filter(p => p.category === activeCat)
  const featured  = POSTS.find(p => p.featured)
  const rest      = filtered.filter(p => !p.featured || activeCat !== 'All')

  const handleWriteSubmit = (e) => {
    e.preventDefault()
    if (!writeForm.title.trim() || !writeForm.content.trim()) return
    setSubmitted(true)
  }

  const renderContent = (text) =>
    text.split('\n\n').map((para, i) => {
      if (para.startsWith('**') && para.endsWith('**')) {
        return <h4 key={i} className={styles.articleH4}>{para.slice(2, -2)}</h4>
      }
      if (para.includes('**')) {
        const parts = para.split(/\*\*(.*?)\*\*/g)
        return <p key={i} className={styles.articlePara}>
          {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
        </p>
      }
      if (para.startsWith('- ')) {
        return <ul key={i} className={styles.articleList}>
          {para.split('\n').filter(l => l.startsWith('- ')).map((l, j) => <li key={j}>{l.slice(2)}</li>)}
        </ul>
      }
      return <p key={i} className={styles.articlePara}>{para}</p>
    })

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <span className={styles.badge}>Workverra Blog</span>
          <h1 className={styles.title}>Insights for Workers &amp; Employers</h1>
          <p className={styles.sub}>Tips, guides, platform updates, and success stories.</p>
          {/* FIX #10: Write article button */}
          <button className={styles.writeBtn} onClick={() => setShowWrite(true)}>✍ Write an Article</button>
        </div>
      </div>

      {/* Featured */}
      {activeCat === 'All' && featured && (
        <div className={styles.featuredWrap}>
          <div className={styles.featuredInner}>
            <div className={styles.featuredCard}>
              <div className={styles.featuredLeft}>
                <div className={styles.featuredMeta}>
                  <span className={styles.featuredTag}>Featured</span>
                  <span className={styles.catChip}>{featured.category}</span>
                  <span className={styles.metaDate}>{featured.date} · {featured.readTime}</span>
                </div>
                <h2 className={styles.featuredTitle}>{featured.title}</h2>
                <p className={styles.featuredExcerpt}>{featured.excerpt}</p>
                <div className={styles.authorRow}>
                  <div className={styles.authorAvatar} style={{ background: featured.avatarGradient }}>{featured.avatar}</div>
                  <div>
                    <div className={styles.authorName}>{featured.author}</div>
                    <div className={styles.authorRole}>{featured.authorRole}</div>
                  </div>
                </div>
                {/* FIX #10: open full article */}
                <button className={styles.readBtn} onClick={() => setOpenPost(featured)}>Read Full Article →</button>
              </div>
              <div className={styles.featuredRight}>
                <div className={styles.featuredVisual}>
                  <div style={{ fontSize:'4rem', marginBottom:16 }}>✍️</div>
                  <div style={{ fontSize:'1.1rem', fontWeight:700, color:'#fff', opacity:.85 }}>Worker Tips</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.catRow}>
        {CATEGORIES.map(c => (
          <button key={c} className={`${styles.catBtn} ${activeCat === c ? styles.catActive : ''}`}
            onClick={() => setActiveCat(c)}>{c}</button>
        ))}
      </div>

      <div className={styles.body}>
        <div className={styles.grid}>
          {rest.map(post => (
            <div key={post.id} className={styles.postCard}>
              <div className={styles.postVisual} style={{ background: post.avatarGradient }}>
                <span className={styles.postCatLabel}>{post.category}</span>
              </div>
              <div className={styles.postContent}>
                <div className={styles.postMeta}>{post.date} · {post.readTime}</div>
                <h3 className={styles.postTitle}>{post.title}</h3>
                <p className={styles.postExcerpt}>{post.excerpt}</p>
                <div className={styles.postFooter}>
                  <div className={styles.postAuthor}>
                    <div className={styles.postAvatar} style={{ background: post.avatarGradient }}>{post.avatar}</div>
                    <span className={styles.postAuthorName}>{post.author}</span>
                  </div>
                  <div className={styles.tagRow}>
                    {post.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
                  </div>
                </div>
                {/* FIX #10: read article button */}
                <button className={styles.readMoreBtn} onClick={() => setOpenPost(post)}>Read Article →</button>
              </div>
            </div>
          ))}
        </div>
        {rest.length === 0 && (
          <div className={styles.empty}>
            <div style={{ fontSize:'2.5rem', marginBottom:12 }}>📝</div>
            <h3>No posts in this category yet</h3>
            <p>Check back soon — we publish new content every week.</p>
          </div>
        )}
      </div>

      {/* Newsletter */}
      <div className={styles.newsletter}>
        <div className={styles.newsletterInner}>
          <h2 className={styles.nlTitle}>Stay in the loop</h2>
          <p className={styles.nlSub}>Get the latest tips delivered to your inbox.</p>
          <div className={styles.nlForm}>
            <input className={styles.nlInput} type="email" placeholder="Enter your email address" />
            <button className={styles.nlBtn}>Subscribe →</button>
          </div>
          <p className={styles.nlNote}>No spam. Unsubscribe anytime.</p>
        </div>
      </div>

      {/* FIX #10: Full Article Modal */}
      {openPost && (
        <div className={styles.modalOverlay} onClick={() => setOpenPost(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setOpenPost(null)}>✕</button>
            <div className={styles.modalHeader}>
              <span className={styles.catChip}>{openPost.category}</span>
              <span className={styles.metaDate}>{openPost.date} · {openPost.readTime}</span>
            </div>
            <h2 className={styles.modalTitle}>{openPost.title}</h2>
            <div className={styles.modalAuthor}>
              <div className={styles.authorAvatar} style={{ background: openPost.avatarGradient }}>{openPost.avatar}</div>
              <div>
                <div className={styles.authorName}>{openPost.author}</div>
                <div className={styles.authorRole}>{openPost.authorRole}</div>
              </div>
            </div>
            <div className={styles.modalContent}>
              {FULL_CONTENT[openPost.id]
                ? renderContent(FULL_CONTENT[openPost.id])
                : <p className={styles.articlePara}>{openPost.excerpt}</p>
              }
            </div>
          </div>
        </div>
      )}

      {/* FIX #10: Write Article Modal */}
      {showWrite && (
        <div className={styles.modalOverlay} onClick={() => setShowWrite(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setShowWrite(false)}>✕</button>
            {submitted ? (
              <div className={styles.submitSuccess}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎉</div>
                <h3>Article Submitted!</h3>
                <p>Thank you for contributing. Our team will review your article and publish it within 2–3 business days if it meets our guidelines.</p>
                <button className={styles.readBtn} onClick={() => { setShowWrite(false); setSubmitted(false); setWriteForm({ title:'', category:'For Workers', content:'' }) }}>
                  Close
                </button>
              </div>
            ) : (
              <>
                <h2 className={styles.modalTitle}>Write an Article</h2>
                <p className={styles.writeNote}>
                  📋 Articles are reviewed by our team before publishing. We typically respond within 2–3 business days.
                </p>
                <form onSubmit={handleWriteSubmit} className={styles.writeForm}>
                  <div className={styles.writeField}>
                    <label className={styles.writeLabel}>Article Title *</label>
                    <input className={styles.writeInput}
                      placeholder="e.g. My Tips for Getting More Bookings"
                      value={writeForm.title}
                      onChange={e => setWriteForm(f => ({ ...f, title: e.target.value }))} />
                  </div>
                  <div className={styles.writeField}>
                    <label className={styles.writeLabel}>Category *</label>
                    <select className={styles.writeInput}
                      value={writeForm.category}
                      onChange={e => setWriteForm(f => ({ ...f, category: e.target.value }))}>
                      {['For Workers', 'For Employers', 'Tips & Guides', 'Success Story'].map(c =>
                        <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className={styles.writeField}>
                    <label className={styles.writeLabel}>Your Article *</label>
                    <textarea className={styles.writeTextarea} rows={10}
                      placeholder="Write your article here. Share your experience, tips, or story..."
                      value={writeForm.content}
                      onChange={e => setWriteForm(f => ({ ...f, content: e.target.value }))} />
                  </div>
                  <button type="submit" className={styles.readBtn}>Submit for Review →</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default BlogPage
