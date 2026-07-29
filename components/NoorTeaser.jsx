import styles from './NoorTeaser.module.css'

export default function NoorTeaser() {
  return (
    <div className={styles.wrap}>
      <div className={styles.top}>
        <span className={styles.icon}>✦</span>
        <div>
          <p className={styles.title}>Noor is coming</p>
          <p className={styles.sub}>
            Your AI semester planning and course Q&A companion
          </p>
        </div>
      </div>

      <p className={styles.body}>
        The more students contribute insights and spread the word,
        the smarter Noor gets. She'll be ready when the data is.
      </p>

      <div className={styles.entryPoints}>
        <div className={styles.entry}>
          <span className={styles.entryIcon}>🗓</span>
          <div>
            <p className={styles.entryTitle}>Plan my semester</p>
            <p className={styles.entrySub}>
              Get recommendations on which courses to take together
              and which to avoid pairing
            </p>
          </div>
        </div>
        <div className={styles.divider} />
        <div className={styles.entry}>
          <span className={styles.entryIcon}>💬</span>
          <div>
            <p className={styles.entryTitle}>Ask about a course</p>
            <p className={styles.entrySub}>
              "Is CMPS 323 harder than CMPS 351?" or
              "Which courses have lab exams?" — ask anything
            </p>
          </div>
        </div>
      </div>

      <div className={styles.cta}>
        <p className={styles.ctaText}>
          Help us get there — share QU Course Insights with your classmates
        </p>
        <button
          className={styles.ctaBtn}
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'QU Course Insights',
                text: 'Know before you enroll — real course info from QU students',
                url: window.location.origin
              })
            } else {
              navigator.clipboard.writeText(window.location.origin)
              alert('Link copied!')
            }
          }}
        >
          Share the website →
        </button>
      </div>
    </div>
  )
}