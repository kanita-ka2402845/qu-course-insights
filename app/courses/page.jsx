"use client"
import courses from '@/data/courses.json'
import styles from './page.module.css'
import CourseCard from "../../components/CourseCard"

function extractNumber(code) {
  const match = code.match(/\d+/)
  return match ? parseInt(match[0]) : 0
}

export default function CoursesPage() {
 const csCourses = courses
    .filter(c => c.category === 'CS Course')
    .sort((a, b) => extractNumber(a.code) - extractNumber(b.code))

  const csceCourses = courses
    .filter(c => c.category === 'CE Course')
    .sort((a, b) => extractNumber(a.code) - extractNumber(b.code))

  return (
    <main className={styles.page}>
      <h2 className={styles.heading}>CS Courses</h2>
      <div className={styles.grid}>
        {csCourses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {csceCourses.length > 0 && (
        <>
          <h2 className={styles.heading} style={{ marginTop: '2rem' }}>
            CS/CE Shared Courses
          </h2>
          <div className={styles.grid}>
            {csceCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </>
      )}
    </main>
  )
}
