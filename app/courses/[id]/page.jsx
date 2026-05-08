import courses from '@/data/courses.json'
import styles from './details.module.css'
import Link from 'next/link'

export default async function CourseDetailPage({ params }) {
    const { id } = await params
    const course = courses.find(c => c.id === id)

    if (!course) return <h1>Course not found</h1>

    return (
        <main className={styles.page}>

            <div className={styles.hero} style={{ background: course.color }}>
                <Link href="/courses" className={styles.back}>← Back to courses</Link>
                <p className={styles.code}>{course.code}</p>
                <h1 className={styles.name}>{course.name}</h1>
                <p className={styles.bottomLine}>{course.bottomLine}</p>
                <div className={styles.tags}>
                    {course.tags.map(tag => (
                        <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                </div>
            </div>

            <div className={styles.content}>

                <div className={styles.card}>
                    <p className={styles.sectionTitle}>Grade breakdown — Theory</p>
                    {Object.entries(course.assessment.theory).map(([key, val]) => (
                        <div key={key} className={styles.gradeRow}>
                            <span className={styles.gradeLabel}>
                                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                            </span>
                            <span className={styles.gradeVal}>
                                {val.weight}%
                                {val.counted && (
                                    <span className={styles.gradeNote}>best {val.counted} of {val.total}</span>
                                )}
                            </span>
                        </div>
                    ))}
                </div>

                {course.assessment.lab && (
                    <div className={styles.card}>
                        <p className={styles.sectionTitle}>Grade breakdown — Lab</p>
                        {Object.entries(course.assessment.lab).map(([key, val]) => (
                            <div key={key} className={styles.gradeRow}>
                                <span className={styles.gradeLabel}>
                                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                                </span>
                                <span className={styles.gradeVal}>{val.weight}%</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className={styles.card}>
                    <p className={styles.sectionTitle}>What to expect</p>
                    {course.whatToExpect.map((point, i) => (
                        <div key={i} className={styles.bullet}>{point}</div>
                    ))}
                </div>

                <div className={styles.card}>
                    <p className={styles.sectionTitle}>Insider stuff</p>
                    {course.insiderStuff.map((point, i) => (
                        <div key={i} className={styles.bullet}>{point}</div>
                    ))}
                </div>

                <div className={`${styles.card} ${styles.semesterCard}`}>
                    <p className={styles.sectionTitle}>Offered in</p>
                    <div className={styles.semesters}>
                        {course.semesters.map(sem => (
                            <span key={sem} className={styles.semPill}>{sem}</span>
                        ))}
                    </div>
                </div>

            </div>
        </main>
    )
}