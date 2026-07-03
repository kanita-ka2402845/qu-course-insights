"use client"
import styles from "./CourseCard.module.css"
import Link from "next/link"

export default function CourseCard({ course }) {
    return (
        <div className={styles.card}>
            <div className={styles.top}>
                <span className={styles.code}>{course.code}</span>
                <h3 className={styles.name}>{course.name}</h3>
                <p className={styles.bottomLine}>{course.bottomLine}</p>
            </div>

            <div className={styles.cardActions}>
            <Link href={`/courses/${course.id}`} className={styles.btn}>
                    View details
                </Link>
                <Link href={`/courses/${course.id}/insights`} className={styles.btnOutline}>
                     Student Insights
                 </Link>
            </div>
        </div>
    )
}