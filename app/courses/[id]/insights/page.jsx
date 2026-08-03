'use client'
import { useState, useEffect } from 'react'
import { use } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import courses from '@/data/courses.json'
import { timeAgo } from '@/lib/timeAgo'
import styles from './insights.module.css'

const TYPES = ['Study advice', 'Instructor tip', 'Workload', 'General']
const YEARS = [2026, 2025, 2024, 2023, 2022]

export default function InsightsPage({ params }) {
  const { id } = use(params)
  const course = courses.find(c => c.id === id)
  const [insights, setInsights] = useState([])
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [likedPosts, setLikedPosts] = useState(() => {
    if (typeof window === 'undefined') return new Set()

    try {
      const saved = JSON.parse(localStorage.getItem('liked_insights') || '[]')
      return new Set(saved)
    } catch {
      return new Set()
    }
  })

  const [form, setForm] = useState({
    content: '',
    type: '',
    instructor: '',
    semester: 'Fall',
    year: 2025,
    quId: ''
  })

  useEffect(() => {
    async function fetchInsights() {
      const { data } = await supabase
        .from('insights')
        .select('*')
        .eq('course_id', id)
        .eq('approved', true)
        .order('helpful_count', { ascending: false })
      setInsights(data || [])
      setLoading(false)
    }
    fetchInsights()
  }, [id])

  const filtered = filter === 'All'
    ? insights
    : insights.filter(i => i.type === filter)

  const handleSubmit = async () => {
    if (!form.content.trim() || !form.type) return
    setSubmitting(true)
    await supabase.from('insights').insert({
      course_id: id,
      content: form.content,
      type: form.type,
      instructor: form.instructor || null,
      semester: form.semester,
      year: form.year,
      qu_id: form.quId || null,
      approved: false
    })
    setSubmitting(false)
    setSubmitted(true)
    setShowForm(false)
    setForm({ content: '', type: '', instructor: '', semester: 'Fall', year: 2025, quId: '' })
  }

  const handleHelpful = async (insightId, current) => {
    const storageKey = `helpful_${insightId}`
    const alreadyLiked = likedPosts.has(insightId) || Boolean(localStorage.getItem(storageKey))

    if (alreadyLiked) return

    const newLiked = new Set(likedPosts)
    newLiked.add(insightId)

    localStorage.setItem(storageKey, 'true')
    localStorage.setItem('liked_insights', JSON.stringify([...newLiked]))
    setLikedPosts(newLiked)

    setInsights(prev =>
      prev.map(i => i.id === insightId ? { ...i, helpful_count: current + 1 } : i)
    )

    await supabase
      .from('insights')
      .update({ helpful_count: current + 1 })
      .eq('id', insightId)
  }


  if (!course) return <h1>Course not found</h1>

  return (
    <main className={styles.page}>
      <Link href={`/courses`} className={styles.back}>
        ← Back to courses
      </Link>

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>What students say about </h1>
          <h4 className={styles.course}>{course.name} ({course.code})</h4>
          <p className={styles.sub}>Real experiences from students who took this course</p>
        </div>
        <button className={styles.addBtn} onClick={() => setShowForm(!showForm)}>
          + Share your insight
        </button>
      </div>

      <div className={styles.hadith}>
        <p className={styles.hadithText}>
          The most beloved of people to Allah are those who are most beneficial to people.
        </p>
        <p className={styles.hadithSource}>Authenticated — Sahih al-Albani</p>
        <p className={styles.hadithCta}>
          Your insight is an act of Nasihah — share what you know and help your fellow students.
        </p>
      </div>

      {showForm && (
        <div className={styles.formCard}>
          <p className={styles.formHadith}>
            Allah helps His servant as long as he helps his brother. — Sahih Muslim 2699
          </p>

          <textarea
            className={styles.textarea}
            rows={4}
            placeholder="What would've helped you before taking this course? Share study tips, instructor recommendations, or anything useful for your fellow students."
            value={form.content}
            onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
          />

          <div>
            <p className={styles.fieldLabel}>Type of insight</p>
            <div className={styles.typeRow}>
              {TYPES.map(t => (
                <button
                  key={t}
                  className={`${styles.typeBtn} ${form.type === t ? styles.typeActive : ''}`}
                  onClick={() => setForm(p => ({ ...p, type: t }))}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <input
            className={styles.inputField}
            type="text"
            placeholder="Instructor name (optional)"
            value={form.instructor}
            onChange={e => setForm(p => ({ ...p, instructor: e.target.value }))}
          />

          <input
            className={styles.inputField}
            type="text"
            placeholder="QU ID (for verification only, not shown publicly)"
            value={form.quId}
            onChange={e => setForm(p => ({ ...p, quId: e.target.value }))}
          />

          <div className={styles.metaRow}>
            <select
              className={styles.select}
              value={form.semester}
              onChange={e => setForm(p => ({ ...p, semester: e.target.value }))}
            >
              <option>Fall</option>
              <option>Spring</option>
            </select>
            <select
              className={styles.select}
              value={form.year}
              onChange={e => setForm(p => ({ ...p, year: Number(e.target.value) }))}
            >
              {YEARS.map(y => <option key={y}>{y}</option>)}
            </select>
            <button
              className={styles.submitBtn}
              onClick={handleSubmit}
              disabled={submitting || !form.content.trim() || !form.type}
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      )}

      {submitted && (
        <p className={styles.successMsg}>
          جزاك الله خيرًا — your insight will appear after review 🌸
        </p>
      )}

      <div className={styles.filterRow}>
        {['All', ...TYPES].map(t => (
          <button
            key={t}
            className={`${styles.filterPill} ${filter === t ? styles.filterActive : ''}`}
            onClick={() => setFilter(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <p className={styles.loading}>Loading insights...</p>
      ) : filtered.length === 0 ? (
        <p className={styles.empty}>No insights yet — be the first to share.</p>
      ) : (
        <div className={styles.posts}>
          {filtered.map(insight => (
            <div key={insight.id} className={styles.postCard}>
              <div className={styles.postTop}>
                <span className={styles.postType}>{insight.type}</span>
                <span className={styles.postMeta}>
                  {insight.semester} {insight.year} · {timeAgo(insight.created_at)}
                </span>
              </div>
              <div className={styles.postContent}>
  {insight.content.split('\n').map((para, i) =>
    para.trim() ? <p key={i} className={styles.para}>{para}</p> : <br key={i} />
  )}
</div>
              <div className={styles.postBottom}>
                <span className={styles.postInstructor}>
                  {insight.instructor ? `👤 ${insight.instructor}` : 'Instructor not specified'}
                </span>
                <button
                  className={`${styles.helpfulBtn} ${likedPosts.has(insight.id) ? styles.helpfulActive : ''}`}
                  onClick={() => handleHelpful(insight.id, insight.helpful_count)}
                >
                  👍 Helpful ({insight.helpful_count})
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}