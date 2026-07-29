
"use client"
import { useEffect, useState, use} from 'react'
import courses from '@/data/courses.json'
import styles from './details.module.css'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import GradeCalculator from '@/components/GradeCalculator'

export default function CourseDetailPage({ params }) {
    const { id } = use(params)

    const [ratings, setRatings] = useState(null)
    const [showCalculator, setShowCalculator] = useState(false)

    const course = courses.find(c => c.id === id)

    const [pendingVote, setPendingVote] = useState({ workload: null, difficulty: null })
const [voteSubmitted, setVoteSubmitted] = useState(false)

const selectVote = (type, value) => {
  if (voteSubmitted) return
  setPendingVote(p => ({ ...p, [type]: value }))
}

const submitVote = async () => {
  if (!pendingVote.workload && !pendingVote.difficulty) return
  setVoteSubmitted(true)

  const current = ratings || { workload: {}, difficulty: {} }

  const updatedWorkload = pendingVote.workload ? {
    ...current.workload,
    [pendingVote.workload]: ((current.workload?.[pendingVote.workload] || 0) + 1)
  } : current.workload

  const updatedDifficulty = pendingVote.difficulty ? {
    ...current.difficulty,
    [pendingVote.difficulty]: ((current.difficulty?.[pendingVote.difficulty] || 0) + 1)
  } : current.difficulty

  await supabase
    .from('course_ratings')
    .upsert({
      course_id: id,
      workload: updatedWorkload,
      difficulty: updatedDifficulty
    })

  setRatings(p => ({
    ...p,
    workload: updatedWorkload,
    difficulty: updatedDifficulty
  }))
}


    if (!course) return <h1>Course not found</h1>

    return (
        <main className={styles.page}>

           
<div className={styles.hero} style={{ background: course.color }}>
    <Link href="/courses" className={styles.back}>← Back to courses</Link>
    <p className={styles.code}>{course.code}</p>
    
    <div className={styles.nameRow}>
        <h1 className={styles.name}>{course.name}</h1>
        {course.assessment && (
            <button
                className={styles.calcBtn}
                onClick={() => setShowCalculator(true)}
            >
                🧮 Grade Calculator
            </button>
        )}
    </div>

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

                <div className={styles.card}>
  <p className={styles.sectionTitle}>How would you rate this course?</p>

  <p className={styles.voteLabel}>Workload</p>
  <div className={styles.voteRow}>
    {['light', 'moderate', 'heavy'].map(v => (
      <button
        key={v}
        className={`${styles.voteBtn} ${pendingVote.workload === v ? styles.voteActive : ''}`}
        onClick={() => selectVote('workload', v)}
        disabled={voteSubmitted}
      >
        {v}
        {ratings?.workload?.[v] > 0 && (
          <span className={styles.voteCount}>{ratings.workload[v]}</span>
        )}
      </button>
    ))}
  </div>

  <p className={styles.voteLabel} style={{ marginTop: '10px' }}>Difficulty</p>
  <div className={styles.voteRow}>
    {['easy', 'moderate', 'hard'].map(v => (
      <button
        key={v}
        className={`${styles.voteBtn} ${pendingVote.difficulty === v ? styles.voteActive : ''}`}
        onClick={() => selectVote('difficulty', v)}
        disabled={voteSubmitted}
      >
        {v}
        {ratings?.difficulty?.[v] > 0 && (
          <span className={styles.voteCount}>{ratings.difficulty[v]}</span>
        )}
      </button>
    ))}
  </div>

  {!voteSubmitted ? (
    <button
      className={styles.voteSubmitBtn}
      onClick={submitVote}
      disabled={!pendingVote.workload && !pendingVote.difficulty}
    >
      Submit rating
    </button>
  ) : (
    <p className={styles.voteThanks}>جزاك الله خيرًا — your rating helps future students 🌸</p>
  )}
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

            {showCalculator && (
  <GradeCalculator
    assessment={course.assessment}
    courseColor={course.color}
    onClose={() => setShowCalculator(false)}
  />
)}
        </main>
    )
}

