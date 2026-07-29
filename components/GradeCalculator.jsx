'use client'
import { useState } from 'react'
import styles from './GradeCalculator.module.css'

const formatLabel = (key) =>
  key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')

function SingleInput({ label, assessment, effectiveWeight, value, outOf, onScoreChange, onOutOfChange, onWeightChange, editingWeights }) {
  return (
    <div className={styles.rowWrap}>
      <div className={styles.singleRow}>
        <span className={styles.label}>{label}</span>
        <div className={styles.inputGroup}>
          <input
            type="number"
            min="0"
            placeholder="score"
            value={value ?? ''}
            onChange={e => onScoreChange(e.target.value === '' ? '' : Number(e.target.value))}
            className={styles.input}
          />
          <span className={styles.slash}>/</span>
          <input
            type="number"
            min="1"
            placeholder={String(assessment.maxMarks || 100)}
            value={outOf ?? ''}
            onChange={e => onOutOfChange(e.target.value === '' ? '' : Number(e.target.value))}
            className={styles.inputSmall}
          />
          <span className={styles.weightTag}>{effectiveWeight}%</span>
        </div>
      </div>
      {editingWeights && (
        <div className={styles.weightEditRow}>
          <span className={styles.weightEditLabel}>Actual weight %</span>
          <input
            type="number"
            min="0"
            max="100"
            value={effectiveWeight}
            onChange={e => onWeightChange(Number(e.target.value))}
            className={styles.weightInput}
          />
        </div>
      )}
    </div>
  )
}

function MultiInput({ label, assessment, effectiveWeight, scores, onScoreChange, onWeightChange, editingWeights }) {
  const total = assessment.total || 1
  const counted = assessment.counted || total
  const defaultMax = assessment.maxMarksEach || 100

  return (
    <div className={styles.rowWrap}>
      <div className={styles.multiHeader}>
        <span className={styles.label}>{label}</span>
        <span className={styles.multiRule}>
          best {counted} of {total} · each out of {scores.map(s => s.outOf || defaultMax).join('/')}
        </span>
        <span className={styles.weightTag}>{effectiveWeight}%</span>
      </div>
      <div className={styles.quizGrid}>
        {Array.from({ length: total }).map((_, i) => {
          const isDropped = (() => {
            const filled = scores
              .map((s, idx) => ({ idx, score: s.score, outOf: s.outOf || defaultMax }))
              .filter(s => s.score !== '' && s.score !== undefined)
            if (filled.length < total) return false
            const pct = filled.map(s => ({ idx: s.idx, pct: s.score / s.outOf }))
            const sorted = [...pct].sort((a, b) => a.pct - b.pct)
            const droppedIdxs = sorted.slice(0, total - counted).map(s => s.idx)
            return droppedIdxs.includes(i)
          })()

          return (
            <div key={i} className={`${styles.quizEntry} ${isDropped ? styles.dropped : ''}`}>
              <span className={styles.quizLabel}>
                {label} {i + 1}
                {isDropped && <span className={styles.droppedTag}>dropped</span>}
              </span>
              <div className={styles.quizInputs}>
                <input
                  type="number"
                  min="0"
                  placeholder="score"
                  value={scores[i]?.score ?? ''}
                  onChange={e => {
                    const updated = [...scores]
                    updated[i] = { ...updated[i], score: e.target.value === '' ? '' : Number(e.target.value) }
                    onScoreChange(updated)
                  }}
                  className={`${styles.input} ${isDropped ? styles.droppedInput : ''}`}
                />
                <span className={styles.slash}>/</span>
                <input
                  type="number"
                  min="1"
                  placeholder={String(defaultMax)}
                  value={scores[i]?.outOf ?? ''}
                  onChange={e => {
                    const updated = [...scores]
                    updated[i] = { ...updated[i], outOf: e.target.value === '' ? '' : Number(e.target.value) }
                    onScoreChange(updated)
                  }}
                  className={styles.inputSmall}
                />
              </div>
            </div>
          )
        })}
      </div>
      {editingWeights && (
        <div className={styles.weightEditRow}>
          <span className={styles.weightEditLabel}>Actual weight %</span>
          <input
            type="number"
            min="0"
            max="100"
            value={effectiveWeight}
            onChange={e => onWeightChange(Number(e.target.value))}
            className={styles.weightInput}
          />
        </div>
      )}
    </div>
  )
}

function computeGrade(allItems, scores, weights) {
  let totalEarned = 0
  let totalWeight = 0

  Object.entries(allItems).forEach(([key, val]) => {
    const weight = weights[key] ?? val.weight
    const s = scores[key]

    if (val.total) {
      // multi quiz type
      const defaultMax = val.maxMarksEach || 100
      const filled = (s || [])
        .map((entry, i) => ({
          score: entry?.score,
          outOf: entry?.outOf || defaultMax,
          idx: i
        }))
        .filter(e => e.score !== '' && e.score !== undefined)

      if (filled.length === 0) return

      const counted = val.counted || val.total
      const pct = filled.map(e => ({ ...e, pct: e.score / e.outOf }))
      const sorted = [...pct].sort((a, b) => b.pct - a.pct)
      const kept = sorted.slice(0, counted)

      const earnedPct = kept.reduce((sum, e) => sum + e.pct, 0) / counted
      totalEarned += earnedPct * weight
      totalWeight += weight
    } else {
      // single type
      if (s?.score === '' || s?.score === undefined) return
      const outOf = s?.outOf || val.maxMarks || 100
      totalEarned += (s.score / outOf) * weight
      totalWeight += weight
    }
  })

  return { totalEarned, totalWeight }
}

export default function GradeCalculator({ assessment, courseColor, onClose }) {
  const [scores, setScores] = useState({})
  const [weights, setWeights] = useState({})
  const [editingWeights, setEditingWeights] = useState(false)

  if (!assessment) return null

  const allItems = {
    ...(assessment.theory || {}),
    ...(assessment.lab
      ? Object.fromEntries(Object.entries(assessment.lab).map(([k, v]) => [`lab_${k}`, v]))
      : {})
  }

  const effectiveWeights = Object.fromEntries(
    Object.entries(allItems).map(([k, v]) => [k, weights[k] ?? v.weight])
  )

  const { totalEarned, totalWeight } = computeGrade(allItems, scores, effectiveWeights)
  const filledCount = Object.entries(allItems).filter(([key, val]) => {
    const s = scores[key]
    if (val.total) return (s || []).some(e => e?.score !== '' && e?.score !== undefined)
    return s?.score !== '' && s?.score !== undefined
  }).length

  const gradeColor = totalEarned >= 90 ? '#1D9E75'
    : totalEarned >= 80 ? '#534AB7'
    : totalEarned >= 70 ? '#BA7517'
    : totalEarned >= 60 ? '#D85A30'
    : '#E24B4A'

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        <div className={styles.modalHeader} style={{ background: courseColor }}>
          <div>
            <p className={styles.modalTitle}>Grade Calculator 🧮</p>
            <p className={styles.modalSub}>Enter your scores — we'll handle the math</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.disclaimer}>
          Pre-filled with typical weights. If your instructor changed them,
          <button className={styles.editToggle} onClick={() => setEditingWeights(!editingWeights)}>
            {editingWeights ? 'done editing' : 'edit weights'}
          </button>
        </div>

        <div className={styles.inputHint}>
          Enter your score and what each assessment is out of.
          For quizzes, the lowest will be dropped automatically.
        </div>

        <div className={styles.body}>
          {assessment.theory && (
            <div className={styles.section}>
              <p className={styles.sectionTitle}>Theory</p>
              {Object.entries(assessment.theory).map(([key, val]) => (
                val.total ? (
                  <MultiInput
                    key={key}
                    label={formatLabel(key)}
                    assessment={val}
                    effectiveWeight={effectiveWeights[key]}
                    scores={scores[key] || Array(val.total).fill({})}
                    onScoreChange={v => setScores(p => ({ ...p, [key]: v }))}
                    onWeightChange={v => setWeights(p => ({ ...p, [key]: v }))}
                    editingWeights={editingWeights}
                  />
                ) : (
                  <SingleInput
                    key={key}
                    label={formatLabel(key)}
                    assessment={val}
                    effectiveWeight={effectiveWeights[key]}
                    value={scores[key]?.score}
                    outOf={scores[key]?.outOf}
                    onScoreChange={v => setScores(p => ({ ...p, [key]: { ...p[key], score: v } }))}
                    onOutOfChange={v => setScores(p => ({ ...p, [key]: { ...p[key], outOf: v } }))}
                    onWeightChange={v => setWeights(p => ({ ...p, [key]: v }))}
                    editingWeights={editingWeights}
                  />
                )
              ))}
            </div>
          )}

          {assessment.lab && (
            <div className={styles.section}>
              <p className={styles.sectionTitle}>Lab</p>
              {Object.entries(assessment.lab).map(([key, val]) => {
                const prefixedKey = `lab_${key}`
                return val.total ? (
                  <MultiInput
                    key={key}
                    label={formatLabel(key)}
                    assessment={val}
                    effectiveWeight={effectiveWeights[prefixedKey]}
                    scores={scores[prefixedKey] || Array(val.total).fill({})}
                    onScoreChange={v => setScores(p => ({ ...p, [prefixedKey]: v }))}
                    onWeightChange={v => setWeights(p => ({ ...p, [prefixedKey]: v }))}
                    editingWeights={editingWeights}
                  />
                ) : (
                  <SingleInput
                    key={key}
                    label={formatLabel(key)}
                    assessment={val}
                    effectiveWeight={effectiveWeights[prefixedKey]}
                    value={scores[prefixedKey]?.score}
                    outOf={scores[prefixedKey]?.outOf}
                    onScoreChange={v => setScores(p => ({ ...p, [prefixedKey]: { ...p[prefixedKey], score: v } }))}
                    onOutOfChange={v => setScores(p => ({ ...p, [prefixedKey]: { ...p[prefixedKey], outOf: v } }))}
                    onWeightChange={v => setWeights(p => ({ ...p, [prefixedKey]: v }))}
                    editingWeights={editingWeights}
                  />
                )
              })}
            </div>
          )}
        </div>

        <div className={styles.result}>
          <div>
            <p className={styles.resultLabel}>Current grade</p>
            <p className={styles.resultSub}>
              {filledCount === 0
                ? 'Enter scores above to calculate'
                : `Based on ${filledCount} of ${Object.keys(allItems).length} assessments`}
            </p>
          </div>
          <p className={styles.resultVal} style={{ color: filledCount > 0 ? gradeColor : '#ccc' }}>
            {filledCount === 0 ? '—' : `${totalEarned.toFixed(1)}%`}
          </p>
        </div>

        <p className={styles.finalDisclaimer}>
          Personal planning tool only — not official. Results may not reflect
          mid-semester changes made by your instructor.
        </p>

      </div>
    </div>
  )
}