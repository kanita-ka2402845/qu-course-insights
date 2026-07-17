"use client"
import courses from '@/data/courses.json'
import styles from './page.module.css'
import CourseCard from "../../components/CourseCard"
import { useState, useMemo } from 'react'
import Link from 'next/link'

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
<nav className={styles.navbar}>
  <span className={styles.navLogo}>QU Course Insights 🌸</span>
  <Link href="/planner" className={styles.navNoor}>ن &nbsp; Plan with Noor</Link>
</nav>
<div className={styles.prayer}>
    <p>🌙 &nbsp; Remember us in your prayers &nbsp; 🌙</p>
  </div>  
      
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

<footer className={styles.footer}>
  <div className={styles.footerBtns}>
    <a
      href="https://forms.gle/hjHbayc4wKfLvWwq7"
      target="_blank"
      rel="noopener noreferrer"
      className={styles.footerBtn}
    >
      💌 Help us improve
    </a>
    <a
      href="https://forms.gle/i9uzJD4625YExhng8"
      target="_blank"
      rel="noopener noreferrer"
      className={styles.footerBtn}
    >
      📚 Don't see your major?
    </a>
  </div>
  <p className={styles.footerMsg}>
    built by students who've been there — for students who are getting there 💕
  </p>
  <p className={styles.footerArabic}>بارك الله فيكم</p>
</footer>

    </main>
  )
}
