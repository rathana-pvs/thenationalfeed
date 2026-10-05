import React from 'react'

interface ExecutiveSummaryProps {
  excerpt?: string
  keyPoints?: string[]
}

export default function ExecutiveSummary({ excerpt, keyPoints }: ExecutiveSummaryProps) {
  if (!excerpt && (!keyPoints || keyPoints.length === 0)) return null

  return (
    <div className="article-executive-summary">
      <div className="summary-kicker">EXECUTIVE SUMMARY</div>
      {excerpt && <p className="summary-text">{excerpt}</p>}
      {keyPoints && keyPoints.length > 0 && (
        <ul className="summary-list">
          {keyPoints.map((point, idx) => (
            <li key={idx}>{point}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

