"use client"
import courses from '@/data/courses.json'
import styles from './page.module.css'
import CourseCard from "../../components/CourseCard"
import { useState, useMemo } from 'react'

function extractNumber(code) {
  const match = code.match(/\d+/)
  return match ? parseInt(match[0]) : 0
}



export default function CoursesPage() {
  const [search, setSearch] = useState('')
  const [semester, setSemester] = useState('All')
  const [category, setCategory] = useState('All')
  const [tag, setTag] = useState('All')

  const allTags = useMemo(() => {
    const set = new Set()
    courses.forEach(c => c.standardTags.forEach(t => set.add(t)))
    return ['All', ...Array.from(set).sort()]
  }, [])

  const filtered = useMemo(() => {
    return courses
      .filter(c => {
        const matchesSearch =
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.code.toLowerCase().includes(search.toLowerCase())
        const matchesSemester = semester === 'All' || c.semesters.includes(semester)
        const matchesCategory = category === 'All' || c.category === category
        const matchesTag = tag === 'All' || c.standardTags.includes(tag)
        return matchesSearch && matchesSemester && matchesCategory && matchesTag
      })
      .sort((a, b) => extractNumber(a.code) - extractNumber(b.code))
  }, [search, semester, category, tag])

  return (
    <main className={styles.page}>
      <div className={styles.pageHeader}>
        <h2 className={styles.heading}>CS Courses</h2>
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSdq-uvYbBi1MxUlstF_XhkejtBGyPNxw0zd4PSxjjGrwmdoNA/viewform?usp=publish-editor"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.contributeBtn}
        >
          + Help us add more courses
        </a>
      </div>

      <div className={styles.filterBar}>
        <input
          type="text"
          placeholder="Search by name or code..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={styles.searchInput}
        />

        <select value={semester} onChange={e => setSemester(e.target.value)} className={styles.select}>
          <option value="All">All semesters</option>
          <option value="Fall">Fall</option>
          <option value="Spring">Spring</option>
          <option value="Fall & Spring">Fall & Spring</option>
          <option value="Summer">Summer</option>
        </select>

        <select value={category} onChange={e => setCategory(e.target.value)} className={styles.select}>
          <option value="All">All categories</option>
          <option value="CS">CS</option>
          <option value="CE">CE</option>
        </select>

        <select value={tag} onChange={e => setTag(e.target.value)} className={styles.select}>
          {allTags.map(t => (
            <option key={t} value={t}>{t === 'All' ? 'All tags' : t}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className={styles.noResults}>No courses match your filters.</p>
      ) : (
        <div className={styles.grid}>
          {filtered.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}

      <div className={styles.comingSoon}>
  <p className={styles.comingSoonText}>More CS courses coming soon!! Stay tuned!</p>
</div>

<div className={styles.majorRequest}>
  <p className={styles.majorTitle}>Don't see your major?</p>
  <p className={styles.majorSub}>
    We're expanding beyond CS. If you'd like to see your major on QU Course Insights — 
    or want to contribute course info for your department — let us know.
  </p>
  
  <a
    href="https://docs.google.com/forms/d/e/1FAIpQLSfrXipA8bTMI15YUM4dJlYsuh3w4cxo6ZWHgo91e2uGTwvppg/viewform?usp=publish-editor"
    target="_blank"
    rel="noopener noreferrer"
    className={styles.majorBtn}
  >
    Request your major →
  </a>
</div>

    </main>
  )
}
