import Link from "next/link"
import styles from "./page.module.css"
export default function Home() {
  return (
    <main className={styles.hero}>
      <h1 className={styles.title}>Know before you enroll</h1>
      <p className={styles.subtitle}>Real course info - no surprises.</p>
      <Link href="/courses" className={styles.btn}>
        {"Let's get started"}
      </Link>
    </main>
  )
}
