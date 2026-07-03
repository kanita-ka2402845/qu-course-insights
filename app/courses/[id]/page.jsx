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
                     <div className={styles.quickFacts}>
                        <span className={styles.fact}>{course.CH} credit hours</span>
                        <span className={styles.fact}>{course.category} Course</span>
                        {course.prerequsites && course.prerequsites.length > 0 && (
                            <span className={styles.fact}>
                            Prereq: {course.prerequsites.join(', ')}
                            </span>
                        )}
                        </div>
                <div className={styles.tags}>
                    {course.tags.map(tag => (
                        <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                </div>
           <p className={styles.disclaimer}>
                    Disclaimer: This reflects a typical course structure. Grade breakdown and content may vary by instructor and semester.
                    </p> 

            </div>
                   
            <div className={styles.content}>

                 <div className={`${styles.card} ${styles.semesterCard}`}>
                    <p className={styles.sectionTitle}>Offered in</p>
                    <div className={styles.semesters}>
                        {course.semesters.map(sem => (
                            <span key={sem} className={styles.semPill}>{sem}</span>
                        ))}
                    </div>
                </div>

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
                                <span className={styles.gradeVal}>{val.weight}%{val.counted && (
                                    <span className={styles.gradeNote}>best {val.counted} of {val.total}</span>
                                )}</span>
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
                    <p className={styles.sectionTitle}>Insider Info</p>
                    {course.insiderInfo.map((point, i) => (
                        <div key={i} className={styles.bullet}>{point}</div>
                    ))}
                </div>

               <div className={styles.reportSection}>
  <p className={styles.reportText}>
    Noticed something different this semester?
  </p>
  <a
    href={`https://docs.google.com/forms/d/e/1FAIpQLSeRjnBNnv8z2LMs4EHJYG81GCdWRJO9eH7JF5bw6gM-ZCVKig/viewform?usp=pp_url&entry.111894480=${course.code}`}
    target="_blank"
    rel="noopener noreferrer"
    className={styles.reportLink}
  >
    Let us know →
  </a>
</div>

            </div>
        </main>
    )
}

