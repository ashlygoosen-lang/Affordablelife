import React from 'react'

/** Adds shortcuts to the custom dashboards in the Payload admin sidebar. */
export function OpsLink() {
  return (
    <div style={{ padding: '12px 0', display: 'grid', gap: 6 }}>
      <a
        href="/ops"
        style={{
          display: 'block',
          borderRadius: 8,
          background: '#0e2a3b',
          color: '#fff',
          padding: '10px 12px',
          fontWeight: 700,
          fontSize: 13,
          textDecoration: 'none',
        }}
      >
        Operations dashboard →
      </a>
      <a href="/" style={{ fontSize: 12, color: 'inherit', opacity: 0.7, padding: '2px 12px' }}>
        View website
      </a>
    </div>
  )
}
