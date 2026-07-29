'use client'
import Link from 'next/link'
import styles from './planner.module.css'

function ShareButton() {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'QU Course Insights',
        text: 'Know before you enroll — real course info from QU students',
        url: window.location.origin
      })
    } else {
      navigator.clipboard.writeText(window.location.origin)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <button className={styles.shareBtn} onClick={handleShare}>
      Share QU Course Insights 🌸
    </button>
  )
}

export default function PlannerPage() {
  return (
    <main className={styles.page}>
      <Link href="/courses" className={styles.back}>← Back to courses</Link>

      <div className={styles.header}>
        <span className={styles.icon}>✦</span>
        <h1 className={styles.title}>Noor</h1>
        <p className={styles.sub}>
          Your AI semester planning and course Q&A companion
        </p>
      </div>

      <div className={styles.teaser}>
        <p className={styles.teaserBody}>
          The more students contribute insights and spread the word,
          the smarter Noor gets. She'll be ready when the data is.
        </p>

        <div className={styles.entryPoints}>
          <div className={styles.entry}>
            <span className={styles.entryIcon}>🗓</span>
            <div className={styles.entryText}>
              <p className={styles.entryTitle}>Plan my semester</p>
              <p className={styles.entrySub}>
                Get recommendations on which courses to take together
                and which combinations to avoid
              </p>
            </div>
            <span className={styles.comingSoon}>coming soon</span>
          </div>

          <div className={styles.divider} />

          <div className={styles.entry}>
            <span className={styles.entryIcon}>💬</span>
            <div className={styles.entryText}>
              <p className={styles.entryTitle}>Ask about a course</p>
              <p className={styles.entrySub}>
                "Is CMPS 323 harder than CMPS 351?" or
                "Which courses have lab exams?" — ask anything
              </p>
            </div>
            <span className={styles.comingSoon}>coming soon</span>
          </div>
        </div>

        <div className={styles.hadith}>
          <p className={styles.hadithText}>
            "The most beloved of people to Allah are those who are most beneficial to people."
          </p>
          <p className={styles.hadithSource}>Authenticated — Sahih al-Albani</p>
        </div>

        <div className={styles.cta}>
          <div className={styles.ctaTop}>
            <p className={styles.ctaTitle}>Help us get Noor ready</p>
            <p className={styles.ctaBody}>
              Noor's recommendations are only as good as the data behind them.
              Every insight you share, every course rating you submit, and every
              classmate you tell about this website brings her closer to being
              genuinely useful.
            </p>
          </div>

          <div className={styles.ctaActions}>
            <Link href="/courses" className={styles.ctaBtn}>
              Browse courses & share insights →
            </Link>
            <ShareButton />
          </div>
        </div>
      </div>

    </main>
  )
}