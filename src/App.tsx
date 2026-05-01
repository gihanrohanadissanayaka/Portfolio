import { useState, useEffect, useRef } from 'react'
import './App.css'

// ── Scroll-reveal hook ────────────────────────────────────
function useScrollReveal() {
  const ref = useRef<HTMLElement | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
          }
        })
      },
      { threshold: 0.12 }
    )
    el.querySelectorAll('.reveal').forEach(child => obs.observe(child))
    return () => obs.disconnect()
  }, [])
  return ref
}

// ── Theme hook ─────────────────────────────────────────────
function useTheme() {
  const [dark, setDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('portfolio-theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light')
  }, [dark])

  return { dark, toggle: () => setDark(d => !d) }
}

// ── Icons (inline SVG, no deps needed) ────────────────────
const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4.5"/>
    <line x1="12" y1="2"    x2="12" y2="4"/>
    <line x1="12" y1="20"   x2="12" y2="22"/>
    <line x1="4.22" y1="4.22"   x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="2" y1="12"  x2="4"  y2="12"/>
    <line x1="20" y1="12" x2="22" y2="12"/>
    <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36"/>
    <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"/>
  </svg>
)

const MoonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

// ── Code particle background ─────────────────────────────
const PARTICLES: { t: string; x: number; dur: number; del: number }[] = [
  { t: '</>', x: 4,  dur: 20, del: 0    },
  { t: 'const', x: 11, dur: 26, del: 3.5  },
  { t: '{ }', x: 20, dur: 19, del: 7    },
  { t: 'async/await', x: 30, dur: 23, del: 1    },
  { t: '=>', x: 42, dur: 29, del: 5    },
  { t: 'useState()', x: 53, dur: 20, del: 9    },
  { t: '@Component', x: 62, dur: 25, del: 2    },
  { t: 'import', x: 73, dur: 22, del: 6    },
  { t: 'function()', x: 83, dur: 27, del: 11   },
  { t: '@SpringBoot', x: 93, dur: 18, del: 4    },
  { t: 'return()', x: 7,  dur: 24, del: 14   },
  { t: '.map()', x: 17, dur: 21, del: 8    },
  { t: 'interface{}', x: 27, dur: 28, del: 12   },
  { t: 'REST API', x: 37, dur: 17, del: 3    },
  { t: 'npm run dev', x: 48, dur: 25, del: 16   },
  { t: 'git push', x: 58, dur: 23, del: 10   },
  { t: 'docker run', x: 68, dur: 20, del: 7    },
  { t: 'type Props', x: 78, dur: 26, del: 13   },
  { t: 'export default', x: 88, dur: 22, del: 18   },
  { t: '.then()', x: 46, dur: 19, del: 15   },
]

function CodeBackground() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="code-particle"
          style={{ left: `${p.x}%`, animationDuration: `${p.dur}s`, animationDelay: `${p.del}s` }}
        >
          {p.t}
        </span>
      ))}
    </div>
  )
}

// ── Hero visual — scattered decorative badges ────────────
const TECH_BADGES = [
  { label: 'React',       color: '#61dafb', pos: { top: '22%',    left:  '4%'  } },
  { label: 'Angular',    color: '#dd0031', pos: { top: '62%',    left:  '6%'  } },
  { label: 'Spring',     color: '#6db33f', pos: { top: '22%',    right: '4%'  } },
  { label: 'TypeScript', color: '#3178c6', pos: { top: '62%',    right: '5%'  } },
  { label: 'Node.js',    color: '#8cc84b', pos: { bottom: '18%', left:  '14%' } },
  { label: 'Express',    color: '#888',    pos: { bottom: '18%', right: '13%' } },
]

function HeroVisual() {
  return (
    <>
      {TECH_BADGES.map(({ label, color, pos }, i) => (
        <div key={label} className="hero-tech-badge glass" style={{ ...pos, animationDelay: `${i * 0.35}s` }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
          {label}
        </div>
      ))}
    </>
  )
}

// ── Skills Section ─────────────────────────────────────────
const SKILL_CATEGORIES = [
  {
    title: 'Backend',
    color: 'var(--tint-teal)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/>
        <line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>
      </svg>
    ),
    skills: ['Java', 'Spring Boot', 'JPA + Hibernate', 'Maven', 'Node.js', 'Express.js'],
  },
  {
    title: 'Frontend',
    color: 'var(--tint)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
    skills: ['Angular 2+', 'Angular Material', 'React', 'TypeScript', 'JavaScript', 'HTML5', 'SCSS', 'Bootstrap'],
  },
  {
    title: 'Databases',
    color: 'var(--tint-indigo)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      </svg>
    ),
    skills: ['MySQL', 'Oracle', 'MongoDB', 'Redis'],
  },
  {
    title: 'Testing',
    color: 'var(--tint-pink)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
    skills: ['JUnit & Mockito', 'Integration Testing', 'SonarQube'],
  },
  {
    title: 'Security',
    color: 'var(--tint-purple)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    skills: ['Spring Security', 'JWT'],
  },
  {
    title: 'DevOps & Tools',
    color: 'var(--tint-teal)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
    skills: ['GitHub', 'GitLab', 'Splunk', 'Agile', 'Tomcat'],
  },
  {
    title: 'Workspace',
    color: 'var(--text-secondary)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    skills: ['IntelliJ', 'VSCode', 'Cursor', 'WebStorm', 'Jira', 'Google Workspace', 'Slack', 'GitHub Copilot'],
  },
]

function SkillsSection() {
  const sectionRef = useScrollReveal()

  return (
    <section id="skills" style={{ paddingTop: 100 }} ref={sectionRef as React.RefObject<HTMLElement>}>
      {/* Section header */}
      <div className="reveal skills-header" style={{ marginBottom: 32 }}>
        <span className="about-eyebrow">What I work with</span>
        <h2 className="gradient-text" style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, letterSpacing: '-0.6px', margin: '8px 0 0' }}>
          Skills &amp; Technologies
        </h2>
      </div>

      {/* Category cards grid */}
      <div className="skills-grid">
        {SKILL_CATEGORIES.map(({ title, color, icon, skills }, i) => (
          <div
            key={title}
            className="reveal skills-card glass-card"
            style={{ '--reveal-delay': `${i * 0.12}s` } as React.CSSProperties}
          >
            {/* Card header */}
            <div className="skills-card-header">
              <span className="skills-cat-icon" style={{ color }}>{icon}</span>
              <span className="skills-cat-title" style={{ color }}>{title}</span>
            </div>
            {/* Pill badges */}
            <div className="skills-tags">
              {skills.map(skill => (
                <span key={skill} className="skill-tag" style={{ '--tag-color': color } as React.CSSProperties}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Experience Section ─────────────────────────────────────
const EXPERIENCES = [
  {
    period: 'Nov 2025 – Present',
    role: 'Senior Software Engineer',
    company: 'Zincat Technology',
    location: 'Rathmalana, Sri Lanka',
    project: 'Tea ERP Platform',
    color: 'var(--tint)',
    current: true,
    highlights: [
      'Designed and developed a comprehensive tea industry ERP system tailored to manage end-to-end business operations.',
      'Led full lifecycle development and maintenance as the primary contributor, ensuring scalability, performance, and reliability.',
      'Integrated the ERP with Ceylon Tea Traders Association (CTTA) systems to align with regulatory and industry standards.',
      'Adopted a rapid "vibe coding" approach to accelerate feature delivery while maintaining code quality and consistency.',
    ],
    tech: ['React', 'Express.js', 'Node.js', 'GitLab', 'GitHub', 'SonarQube', 'GitHub Copilot', 'Agile'],
  },
  {
    period: 'May 2025 – Oct 2025',
    role: 'Senior Software Engineer',
    company: 'CodeGen International (Pvt) Ltd',
    location: 'Colombo, Sri Lanka',
    project: 'FCTG — TravelBox',
    color: 'var(--tint-indigo)',
    current: false,
    highlights: [
      'Led enhancements for TravelBox Enterprise — a multi-channel travel sales platform with advanced price formulation and GDS/API integrations.',
      'Contributed to TravelBox Central, migrating setup modules for accommodations, flights, rail, cruises, car hires, transfers, and more.',
      'Collaborated with architects on solution design and delivered client-focused product demos to integration teams.',
      'Maintained Agile and Scrum best practices across 50+ sprints, ensuring consistent on-time releases.',
    ],
    tech: ['Java', 'Spring', 'JPA', 'TypeScript', 'Angular', 'Oracle', 'GitLab', 'Jira'],
  },
  {
    period: 'Feb 2023 – Apr 2025',
    role: 'Software Engineer',
    company: 'CodeGen International (Pvt) Ltd',
    location: 'Colombo, Sri Lanka',
    project: 'FCTG — TravelBox',
    color: 'var(--tint-indigo)',
    current: false,
    highlights: [
      'Developed enhancements for TravelBox Enterprise — a travel distribution platform supporting multi-channel sales and third-party integrations.',
      'Supported advanced travel packaging, seamless GDS integrations, and high-volume search and booking flows.',
      'Contributed to TravelBox Central product management suite with advanced contract and rate management capabilities.',
      'Diagnosed and resolved production and client issues, improving overall system reliability.',
    ],
    tech: ['Java', 'Spring Boot', 'JUnit', 'Mockito', 'TypeScript', 'Angular', 'Oracle', 'Maven'],
  },
  {
    period: 'Aug 2022 – Feb 2023',
    role: 'Software Engineer Intern',
    company: 'CodeGen International (Pvt) Ltd',
    location: 'Colombo, Sri Lanka',
    project: 'FCTG — TravelBox',
    color: 'var(--tint-teal)',
    current: false,
    highlights: [
      'Completed the DEV Training Program by building a robust online hotel booking solution from scratch.',
      'Gained practical experience with Agile architecture, ensuring efficient and timely project delivery.',
      'Acquired hands-on experience with Jira, SonarQube, and GitLab for work management, code quality, and version control.',
    ],
    tech: ['Angular', 'Spring Boot', 'Java', 'TypeScript', 'SCSS'],
  },
]

// ── Highlights Section ────────────────────────────────────
const HIGHLIGHTS = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
      </svg>
    ),
    color: 'var(--tint-purple)',
    title: 'MSc in Advanced SE',
    desc: 'Postgraduate degree in Advanced Software Engineering, combining academic rigour with industry-grade engineering practices.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
        <line x1="12" y1="12" x2="12" y2="16"/>
        <line x1="10" y1="14" x2="14" y2="14"/>
      </svg>
    ),
    color: 'var(--tint-indigo)',
    title: 'Enterprise Experience',
    desc: 'Built and maintained multi-region enterprise applications in the travel domain, serving high volumes of searches and bookings globally.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 1 21 5 17 9"/>
        <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
        <polyline points="7 23 3 19 7 15"/>
        <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
      </svg>
    ),
    color: 'var(--tint-teal)',
    title: '50+ Agile Sprints',
    desc: 'Sustained delivery excellence across 50+ Scrum sprints with consistent on-time releases, following Agile best practices end-to-end.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    color: 'var(--tint)',
    title: 'Performance & Scale',
    desc: 'Optimised system performance and reliability across distributed platforms, diagnosing and resolving production issues in high-load environments.',
  },
]

function HighlightsSection() {
  const sectionRef = useScrollReveal()

  return (
    <section id="highlights" style={{ paddingTop: 100 }} ref={sectionRef as React.RefObject<HTMLElement>}>
      {/* Header */}
      <div className="reveal" style={{ marginBottom: 36 }}>
        <span className="about-eyebrow">What sets me apart</span>
        <h2 className="gradient-text" style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, letterSpacing: '-0.6px', margin: '8px 0 0' }}>
          Key Highlights
        </h2>
      </div>

      {/* Cards */}
      <div className="highlights-grid">
        {HIGHLIGHTS.map(({ icon, color, title, desc }, i) => (
          <div
            key={title}
            className="reveal highlight-card glass-card"
            style={{ '--reveal-delay': `${i * 0.1}s`, '--hl-color': color } as React.CSSProperties}
          >
            <span className="highlight-icon" style={{ color }}>{icon}</span>
            <h3 className="highlight-title">{title}</h3>
            <p className="highlight-desc">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function ExperienceSection() {
  const sectionRef = useScrollReveal()

  return (
    <section id="experience" style={{ paddingTop: 100 }} ref={sectionRef as React.RefObject<HTMLElement>}>
      {/* Header */}
      <div className="reveal" style={{ marginBottom: 48 }}>
        <span className="about-eyebrow">Career history</span>
        <h2 className="gradient-text" style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, letterSpacing: '-0.6px', margin: '8px 0 0' }}>
          Experience
        </h2>
      </div>

      {/* Timeline */}
      <div className="exp-timeline" ref={sectionRef as React.RefObject<HTMLDivElement>}>
        {EXPERIENCES.map((exp, i) => (
          <div
            key={i}
            className="reveal exp-item"
            style={{ '--reveal-delay': `${i * 0.12}s` } as React.CSSProperties}
          >
            {/* Dot + connector line */}
            <div className="exp-line-col">
              <div className="exp-dot" style={{ background: exp.color, boxShadow: `0 0 0 4px color-mix(in srgb, ${exp.color} 22%, transparent)` }}>
                {exp.current && <span className="exp-dot-pulse" style={{ '--pulse-color': exp.color } as React.CSSProperties} />}
              </div>
              {i < EXPERIENCES.length - 1 && <div className="exp-connector" />}
            </div>

            {/* Card */}
            <div className="exp-card glass-card" style={{ '--exp-accent': exp.color } as React.CSSProperties}>
              {/* Period */}
              <span className="exp-period">
                {exp.current && <span className="status-dot" style={{ width: 6, height: 6, marginRight: 6 }} />}
                {exp.period}
              </span>

              {/* Role & company */}
              <h3 className="exp-role">{exp.role}</h3>
              <div className="exp-company-row">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                <span>{exp.company}</span>
                <span className="exp-sep">·</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <span style={{ color: 'var(--text-muted)' }}>{exp.location}</span>
              </div>

              {/* Project tag */}
              <span className="exp-project-tag" style={{ color: exp.color, borderColor: `color-mix(in srgb, ${exp.color} 35%, transparent)`, background: `color-mix(in srgb, ${exp.color} 10%, transparent)` }}>
                {exp.project}
              </span>

              {/* Highlights */}
              <ul className="exp-highlights">
                {exp.highlights.map((h, j) => (
                  <li key={j}>
                    <span className="exp-bullet" style={{ background: exp.color }} />
                    {h}
                  </li>
                ))}
              </ul>

              {/* Tech chips */}
              <div className="exp-tech-row">
                {exp.tech.map(t => (
                  <span key={t} className="skill-tag" style={{ '--tag-color': exp.color } as React.CSSProperties}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Contact Section ────────────────────────────────────────
const CONTACT_ITEMS = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    label: 'Email',
    value: 'dissanayaka.gihanrohana@gmail.com',
    href: 'mailto:dissanayaka.gihanrohana@gmail.com',
    color: 'var(--tint)',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 12 19.79 19.79 0 0 1 1 3.18 2 2 0 0 1 3 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z"/>
      </svg>
    ),
    label: 'Phone',
    value: '+94 71 165 1378 / +94 78 165 1378',
    href: 'tel:+94711651378',
    color: 'var(--tint-teal)',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
      </svg>
    ),
    label: 'LinkedIn',
    value: 'linkedin.com/in/gihandissanayaka',
    href: 'https://www.linkedin.com/in/gihandissanayaka/',
    color: 'var(--tint-indigo)',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
      </svg>
    ),
    label: 'GitHub',
    value: 'github.com/gihanrohanadissanayaka',
    href: 'https://github.com/gihanrohanadissanayaka',
    color: 'var(--text-secondary)',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    label: 'Address',
    value: 'Athmaga, Weerasinghe Rd, Puwakdandawa, Beliatta, Sri Lanka',
    href: null,
    color: 'var(--tint-pink)',
  },
]

function ContactSection() {
  const sectionRef = useScrollReveal()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const { name, email, message } = form
    const subject = encodeURIComponent(`Portfolio Contact from ${name}`)
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)
    window.location.href = `mailto:dissanayaka.gihanrohana@gmail.com?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <section id="contact" style={{ paddingTop: 100 }} ref={sectionRef as React.RefObject<HTMLElement>}>
      {/* Header */}
      <div className="reveal" style={{ marginBottom: 36 }}>
        <span className="about-eyebrow">Say hello</span>
        <h2 className="gradient-text" style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, letterSpacing: '-0.6px', margin: '8px 0 0' }}>
          Get In Touch
        </h2>
      </div>

      <div className="contact-grid">
        {/* ── Left: Contact info ──────────────────────── */}
        <div className="reveal contact-info glass-card" style={{ '--reveal-delay': '0.05s' } as React.CSSProperties}>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.75, margin: '0 0 28px' }}>
            I'm open to new opportunities, collaborations, or just a friendly chat about tech. Feel free to reach out through any of the channels below.
          </p>

          <ul className="contact-list">
            {CONTACT_ITEMS.map(({ icon, label, value, href, color }) => (
              <li key={label} className="contact-item">
                <span className="contact-item-icon" style={{ color, background: `color-mix(in srgb, ${color} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 24%, transparent)` }}>
                  {icon}
                </span>
                <div className="contact-item-body">
                  <span className="contact-item-label">{label}</span>
                  {href ? (
                    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="contact-item-value contact-link">
                      {value}
                    </a>
                  ) : (
                    <span className="contact-item-value">{value}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Right: Contact form ─────────────────────── */}
        <div className="reveal contact-form-wrap glass-card" style={{ '--reveal-delay': '0.15s' } as React.CSSProperties}>
          {sent ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16, padding: '40px 0', textAlign: 'center' }}>
              <span style={{ fontSize: 48 }}>✉️</span>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>Message sent!</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 14 }}>Your email client should have opened. I'll get back to you soon.</p>
              <button className="ios-btn ios-btn-ghost" style={{ marginTop: 8 }} onClick={() => setSent(false)}>Send another</button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <h3 style={{ margin: '0 0 24px', fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>Send a message</h3>

              <div className="contact-field">
                <label className="contact-label" htmlFor="cf-name">Name</label>
                <input
                  id="cf-name"
                  className="contact-input"
                  type="text"
                  placeholder="Gihan Dissanayaka"
                  required
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>

              <div className="contact-field">
                <label className="contact-label" htmlFor="cf-email">Email</label>
                <input
                  id="cf-email"
                  className="contact-input"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                />
              </div>

              <div className="contact-field">
                <label className="contact-label" htmlFor="cf-message">Message</label>
                <textarea
                  id="cf-message"
                  className="contact-input contact-textarea"
                  placeholder="Hi Gihan, I'd love to discuss…"
                  required
                  rows={5}
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                />
              </div>

              <button type="submit" className="ios-btn ios-btn-primary contact-submit">
                Send Message
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

// ── App ────────────────────────────────────────────────────
export default function App() {
  const { dark, toggle } = useTheme()

  const navLinks = [
    { id: 'about',      label: 'About'      },
    { id: 'skills',     label: 'Skills'     },
    { id: 'experience', label: 'Experience' },
    { id: 'projects',   label: 'Projects'   },
    { id: 'contact',    label: 'Contact'    },
  ]

  return (
    <div style={{
      minHeight: '100svh',
      background: 'var(--bg)',
      color: 'var(--text)',
      fontFamily: 'var(--font-sans)',
      position: 'relative',
      overflowX: 'hidden',
      transition: 'background 0.35s, color 0.35s',
    }}>

      <CodeBackground />

      {/* ── Ambient background blobs ─────────────────────── */}
      <div className="blob" style={{
        width: 560, height: 560, top: -140, left: -100,
        background: 'var(--tint)',
        animationDelay: '0s',
      }}/>
      <div className="blob" style={{
        width: 440, height: 440, top: '28%', right: -120,
        background: 'var(--tint-purple)',
        animationDelay: '3.5s',
      }}/>
      <div className="blob" style={{
        width: 380, height: 380, bottom: '8%', left: '18%',
        background: 'var(--tint-indigo)',
        animationDelay: '6s',
      }}/>

      {/* ── Navbar ───────────────────────────────────────── */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '10px 24px 0' }}>
        <div className="glass-thick" style={{
          maxWidth: 1440,
          margin: '0 auto',
          borderRadius: 20,
          padding: '0 28px',
        }}>
          <nav style={{
            height: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}>
            {/* Logo */}
            <span className="gradient-text" style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-0.5px', flexShrink: 0 }}>
              Gihan
            </span>

            {/* Nav links */}
            <ul style={{ display: 'flex', gap: 18, listStyle: 'none', margin: 0, padding: 0 }}>
              {navLinks.map(({ id, label }) => (
                <li key={id}>
                  <a href={`#${id}`} className="nav-link">{label}</a>
                </li>
              ))}
            </ul>

            {/* Theme toggle */}
            <button className="theme-toggle" onClick={toggle} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
          </nav>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero-section">
        {/* Scattered decorative badges */}
        <HeroVisual />

        {/* Centered content */}
        <div className="hero-center">

          {/* Role badge */}
          <div className="hero-text-in" style={{ animationDelay: '0.05s' }}>
            <span className="hero-role-badge glass">
              <span className="status-dot" />
              Senior Full Stack Developer
              <span className="hero-role-sep">·</span>
              3+ Years
            </span>
          </div>

          {/* Headline */}
          <h1 className="hero-text-in hero-h1" style={{ animationDelay: '0.2s' }}>
            Hi, I'm{' '}
            <span className="gradient-text">Gihan<br className="hero-br" />Dissanayaka</span>
          </h1>

          {/* Sub-description */}
          <p className="hero-text-in hero-desc" style={{ animationDelay: '0.35s' }}>
            I build scalable, high-quality web applications with React, Angular,
            Express and Spring Boot — from pixel-perfect UIs to robust back-end APIs.
          </p>

          {/* CTA buttons */}
          <div className="hero-text-in" style={{ animationDelay: '0.5s', display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 40 }}>
            <a href="#projects" className="ios-btn ios-btn-primary">View Projects</a>
            <a href="/cv.pdf" download="Gihan_Dissanayaka_CV.pdf" className="ios-btn ios-btn-ghost">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download CV
            </a>
          </div>

          {/* Photo ring */}
          <div className="hero-text-in hero-photo-ring" style={{ animationDelay: '0.65s' }}>
            <img src="/profile.png" alt="Gihan Dissanayaka" className="hero-photo" />
          </div>

        </div>
      </section>

      {/* ── Content sections ─────────────────────────────── */}
      <main style={{ maxWidth: 1440, margin: '0 auto', padding: '0 clamp(20px, 5vw, 100px) 140px', boxSizing: 'border-box' }}>

        {/* About */}
        <section id="about" style={{ paddingTop: 100 }}>
          <div className="glass-card about-grid" style={{ padding: 'clamp(32px, 5vw, 52px) clamp(24px, 5vw, 52px)' }}>

            {/* ── Left col — bio (60%) ───────────────────── */}
            <div className="about-bio">
              <span className="about-eyebrow">About me</span>
              <h2 className="gradient-text about-heading">
                Senior Full-Stack<br />Software Engineer
              </h2>

              <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.8, margin: '0 0 14px' }}>
                I'm <strong style={{ color: 'var(--text)' }}>Gihan Dissanayaka</strong> — a Senior Full-Stack Engineer
                with <strong style={{ color: 'var(--text)' }}>3+ years of expertise</strong> building and optimising
                multi-region enterprise applications in the <strong style={{ color: 'var(--text)' }}>travel domain</strong>.
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.8, margin: '0 0 14px' }}>
                Proficient in <strong style={{ color: 'var(--text-secondary)' }}>Java, Spring Boot, TypeScript</strong> and{' '}
                <strong style={{ color: 'var(--text-secondary)' }}>Angular</strong>, I have a proven track record of
                crafting scalable, secure, and user-focused solutions — from reusable component libraries
                to high-throughput back-end services.
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.8, margin: 0 }}>
                I thrive on enhancing system performance, elevating developer experience, and delivering
                seamless user journeys through innovative design and engineering practices.
              </p>
            </div>

            {/* ── Right col — stats (40%) ────────────────── */}
            <div className="about-stats">
              {([
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                    </svg>
                  ),
                  value: '3+',
                  label: 'Years Experience',
                  color: 'var(--tint)',
                },
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                  ),
                  value: '2',
                  label: 'Industry Domains',
                  color: 'var(--tint-indigo)',
                },
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
                    </svg>
                  ),
                  value: 'MSc',
                  label: 'Postgraduate Degree',
                  color: 'var(--tint-purple)',
                },
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                    </svg>
                  ),
                  value: 'Ent.',
                  label: 'Enterprise Grade',
                  color: 'var(--tint-teal)',
                },
              ]).map(({ icon, value, label, color }) => (
                <div key={label} className="about-stat-card glass">
                  <span className="about-stat-icon" style={{ color }}>{icon}</span>
                  <span className="about-stat-value" style={{ color }}>{value}</span>
                  <span className="about-stat-label">{label}</span>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Skills */}
        <SkillsSection />

        {/* Experience */}
        <ExperienceSection />

        {/* Highlights */}
        <HighlightsSection />

        {/* Projects */}
        <section id="projects" style={{ paddingTop: 100 }}>
          <div className="glass-card" style={{ padding: '40px 44px' }}>
            <h2 className="gradient-text" style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.6px', margin: '0 0 10px' }}>
              Projects
            </h2>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: 15, lineHeight: 1.65 }}>
              Projects coming soon…
            </p>
          </div>
        </section>

        {/* Contact */}
        <ContactSection />

      </main>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="site-footer glass-thick">
        <div className="footer-inner">

          {/* Top row: logo + nav */}
          <div className="footer-top">
            <span className="gradient-text footer-logo">Gihan</span>
            <nav className="footer-nav">
              {[
                { id: 'about',      label: 'About'      },
                { id: 'skills',     label: 'Skills'     },
                { id: 'experience', label: 'Experience' },
                { id: 'projects',   label: 'Projects'   },
                { id: 'contact',    label: 'Contact'    },
              ].map(({ id, label }) => (
                <a key={id} href={`#${id}`} className="nav-link footer-nav-link">{label}</a>
              ))}
            </nav>
          </div>

          {/* Divider */}
          <div className="footer-divider" />

          {/* Bottom row: copyright + socials */}
          <div className="footer-bottom">
            <span className="footer-copy">
              © {new Date().getFullYear()} Gihan Dissanayaka. All rights reserved.
            </span>
            <div className="footer-socials">
              {/* GitHub */}
              <a href="https://github.com/gihanrohanadissanayaka" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="https://www.linkedin.com/in/gihandissanayaka/" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
              {/* Email */}
              <a href="mailto:dissanayaka.gihanrohana@gmail.com" className="footer-social-btn" aria-label="Email">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
              </a>
            </div>
          </div>

        </div>
      </footer>
    </div>
  )
}
