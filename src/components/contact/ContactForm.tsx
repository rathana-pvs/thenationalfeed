'use client'

import React, { useState } from 'react'

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'General Editorial Question',
    subject: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate submission
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 600)
  }

  if (submitted) {
    return (
      <div className="p-6 bg-[var(--surface)] border border-[var(--line)] text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[var(--bbc-red)] text-white flex items-center justify-center mx-auto text-xl font-bold">
          ✓
        </div>
        <h3 className="font-serif text-xl font-bold text-[var(--ink)]">
          Message Received
        </h3>
        <p className="text-sm text-[var(--muted)] leading-relaxed">
          Thank you for reaching out to The National Feed. Your message has been forwarded to the <strong>{formData.department}</strong> desk.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false)
            setFormData({
              name: '',
              email: '',
              department: 'General Editorial Question',
              subject: '',
              message: '',
            })
          }}
          className="inline-block px-4 py-2 bg-[var(--ink)] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#333] transition-colors"
        >
          Send Another Message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-1.5" htmlFor="contact-name">
          Full Name <span className="text-[var(--bbc-red)]">*</span>
        </label>
        <input
          id="contact-name"
          required
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g. Eleanor Vance"
          className="w-full px-3.5 py-2.5 bg-white border border-[var(--line)] text-sm text-[var(--ink)] outline-none focus:border-[var(--ink)] focus:ring-1 focus:ring-[var(--ink)] transition-all"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-1.5" htmlFor="contact-email">
          Email Address <span className="text-[var(--bbc-red)]">*</span>
        </label>
        <input
          id="contact-email"
          required
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="eleanor@example.com"
          className="w-full px-3.5 py-2.5 bg-white border border-[var(--line)] text-sm text-[var(--ink)] outline-none focus:border-[var(--ink)] focus:ring-1 focus:ring-[var(--ink)] transition-all"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-1.5" htmlFor="contact-dept">
          Recipient Desk / Department <span className="text-[var(--bbc-red)]">*</span>
        </label>
        <select
          id="contact-dept"
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          className="w-full px-3.5 py-2.5 bg-white border border-[var(--line)] text-sm text-[var(--ink)] outline-none focus:border-[var(--ink)] focus:ring-1 focus:ring-[var(--ink)] transition-all"
        >
          <option value="General Editorial Question">General Editorial Question</option>
          <option value="Press & Media Inquiry">Press & Media Inquiry</option>
          <option value="Corrections & Fact-Checking">Corrections & Fact-Checking</option>
          <option value="Advertising & Sponsorship">Advertising & Sponsorship</option>
          <option value="Legal & Rights">Legal & Rights</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-1.5" htmlFor="contact-subject">
          Subject Line
        </label>
        <input
          id="contact-subject"
          type="text"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          placeholder="Brief summary of your query"
          className="w-full px-3.5 py-2.5 bg-white border border-[var(--line)] text-sm text-[var(--ink)] outline-none focus:border-[var(--ink)] focus:ring-1 focus:ring-[var(--ink)] transition-all"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-1.5" htmlFor="contact-message">
          Your Message <span className="text-[var(--bbc-red)]">*</span>
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Please provide details, citations, or references..."
          className="w-full px-3.5 py-2.5 bg-white border border-[var(--line)] text-sm text-[var(--ink)] outline-none focus:border-[var(--ink)] focus:ring-1 focus:ring-[var(--ink)] transition-all resize-y"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-[var(--ink)] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#333] transition-colors disabled:opacity-50"
      >
        {loading ? 'Sending Message...' : 'Submit to Newsroom'}
      </button>
    </form>
  )
}
