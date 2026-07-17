'use client'
import { useState } from 'react'
import styles from './GradeCalculator.module.css'

const formatLabel = (key) =>
  key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')

function AssessmentInput({ label, assessment, value, onChange }) {
  if (assessment.dropLowest && assessment.total) {
    return (
      <div className={styles.multiRow}>
        <span className={styles.label}>
          {label}
          <span className={styles.weight}> — {assessment.weight}%</span>
          <span className={styles.rule}>best {assessment.counted} of {assessment.total}</span>
        </span>
        <div className={styles.scoreInputs}>
          {Array.from({ length: assessment.total }).map((_, i) => (
            <input
              key={i}
              type="number"
              min="0"
              max={assessment.maxMarksEach || 100}
              placeholder="—"
              value={value?.[i] ?? ''}
              onChange={e => {
                const updated = [...(value || Array(assessment.total).fill(''))]
                updated[i] = e.target.value === '' ? '' : Number(e.target.value)
                onChange(updated)
              }}
              className={styles.smallInput}
            />
          ))}
          <span className={styles.outOf}>
            /{assessment.maxMarksEach || 100} each
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.singleRow}>
      <span className={styles.label}>
        {label}
        <span className={styles.weight}> — {assessment.weight}%</span>
      </span>
      <div className={styles.singleInput}>
        <input
          type="number"
          min="0"
          max={assessment.maxMarks || 100}
          placeholder="—"
          value={value ?? ''}
          onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          className={styles.input}
        />
        <span className={styles.outOf}>/{assessment.maxMarks || 100}</span>
      </div>
    </div>
  )
}

function calculateContribution(assessment, value) {
  if (assessment.dropLowest && Array.isArray(value)) {
    const filled = value.filter(v => v !== '' && v !== undefined && v !== null)
    if (filled.length === 0) return null
    const sorted = [...filled].sort((a, b) => a - b)
    const counted = sorted.slice(sorted.length - assessment.counted)
    const maxTotal = (assessment.maxMarksEach || 100) * assessment.counted
    const scored = counted.reduce((s, v) => s + v, 0)
    return (scored / maxTotal) * assessment.weight
  }

  if (value === '' || value === undefined || value === null) return null
  const max = assessment.maxMarks || 100
  return (value / max) * assessment.weight
}

export default function GradeCalculator({ assessment, courseColor, onClose }) {
  const [scores, setScores] = useState({})
  const [weights, setWeights] = useState({})
  const [editingWeights, setEditingWeights] = useState(false)

  if (!assessment) return null

  const allItems = {
    ...(assessment.theory || {}),
    ...(assessment.lab ? Object.fromEntries(
      Object.entries(assessment.lab).map(([k, v]) => [`lab_${k}`, v])
    ) : {})
  }

  const effectiveWeights = Object.fromEntries(
    Object.entries(allItems).map(([k, v]) => [
      k,
      weights[k] !== undefined ? weights[k] : v.weight
    ])
  )

  const contributions = Object.entries(allItems).map(([key, val]) => {
    const effective = { ...val, weight: effectiveWeights[key] }
    return calculateContribution(effective, scores[key])
  })

  const filledCount = contributions.filter(c => c !== null).length
  const total = contributions.reduce((s, c) => s + (c || 0), 0)

  const totalWeight = Object.values(effectiveWeights).reduce((s, w) => s + Number(w), 0)
  const weightedTotal = filledCount > 0 && totalWeight > 0
    ? (total / Object.entries(allItems)
        .filter((_, i) => contributions[i] !== null)
        .reduce((s, [k]) => s + Number(effectiveWeights[k]), 0)) * 100
    : 0

  const gradeColor = total >= 90 ? '#1D9E75'
    : total >= 80 ? '#7F77DD'
    : total >= 70 ? '#BA7517'
    : total >= 60 ? '#D85A30'
    : '#E24B4A'

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        <div className={styles.modalHeader} style={{ background: courseColor }}>
          <div>
            <p className={styles.modalTitle}>Grade Calculator</p>
            <p className={styles.modalSub}>Enter your scores to see your running grade</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.disclaimer}>
          Pre-filled with the typical breakdown for this course.
          If your instructor announced different weights, toggle
          <button
            className={styles.editToggle}
            onClick={() => setEditingWeights(!editingWeights)}
          >
            {editingWeights ? 'done editing' : 'edit weights'}
          </button>
          to update them.
        </div>

        <div className={styles.body}>
          {assessment.theory && (
            <div className={styles.section}>
              <p className={styles.sectionTitle}>Theory</p>
              {Object.entries(assessment.theory).map(([key, val]) => (
                <div key={key}>
                  <AssessmentInput
                    label={formatLabel(key)}
                    assessment={{ ...val, weight: effectiveWeights[key] }}
                    value={scores[key]}
                    onChange={v => setScores(p => ({ ...p, [key]: v }))}
                  />
                  {editingWeights && (
                    <div className={styles.weightEdit}>
                      <span className={styles.weightEditLabel}>Actual weight %</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={effectiveWeights[key]}
                        onChange={e => setWeights(p => ({ ...p, [key]: Number(e.target.value) }))}
                        className={styles.weightInput}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {assessment.lab && (
            <div className={styles.section}>
              <p className={styles.sectionTitle}>Lab</p>
              {Object.entries(assessment.lab).map(([key, val]) => {
                const prefixedKey = `lab_${key}`
                return (
                  <div key={key}>
                    <AssessmentInput
                      label={formatLabel(key)}
                      assessment={{ ...val, weight: effectiveWeights[prefixedKey] }}
                      value={scores[prefixedKey]}
                      onChange={v => setScores(p => ({ ...p, [prefixedKey]: v }))}
                    />
                    {editingWeights && (
                      <div className={styles.weightEdit}>
                        <span className={styles.weightEditLabel}>Actual weight %</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={effectiveWeights[prefixedKey]}
                          onChange={e => setWeights(p => ({ ...p, [prefixedKey]: Number(e.target.value) }))}
                          className={styles.weightInput}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className={styles.result}>
          <div className={styles.resultLeft}>
            <p className={styles.resultLabel}>Current grade</p>
            <p className={styles.resultSub}>
              {filledCount === 0
                ? 'Enter scores above to calculate'
                : `Based on ${filledCount} of ${Object.keys(allItems).length} assessments`}
            </p>
          </div>
          <p className={styles.resultVal} style={{ color: gradeColor }}>
            {filledCount === 0 ? '—' : `${total.toFixed(1)}%`}
          </p>
        </div>

        <p className={styles.finalDisclaimer}>
          This calculator is a personal planning tool only. Results are not official
          and may not reflect mid-semester changes made by your instructor.
        </p>

      </div>
    </div>
  )
}