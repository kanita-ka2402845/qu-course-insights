"use client"
import courses from '@/data/courses.json'
import styles from './page.module.css'
import CourseCard from "../../components/CourseCard"

export default function CoursesPage() {
    return (
        <main className={styles.page}>
            <h2 className={styles.heading}>CS Courses</h2>
            <div className={styles.grid}>
                {courses.map(course => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
        </main>
    )
}
