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
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
        <path d="M20 3v4M22 5h-4M4 17v2M5 18H3"/>
      </svg>
    ),
    color: 'var(--tint-pink)',
    title: 'Vibe Coding',
    desc: 'Embracing AI-native development — using LLMs and AI pair programming to prototype rapidly, iterate boldly, and ship production-ready features at unprecedented speed.',
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

// ── Calendly ─────────────────────────────────────────────
declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (opts: { url: string }) => void
    }
  }
}

const CALENDLY_URL = 'https://calendly.com/dissanayaka-gihanrohana/30min'

// ── Projects data ──────────────────────────────────────────
const PROJECTS = [
  {
    id: 'elitecuts',
    title: 'EliteCuts',
    tagline: 'Smart appointment scheduling system for modern salons',
    tags: ['React', 'Express', 'Spring Boot', 'Online Booking'],
    thumbnail: '/project_salon_cover.png',
    demoUrl: 'https://elite-cuts-fawn.vercel.app',
    githubUrl: null as string | null,
    problem: 'Many small salons struggle with manual booking processes, leading to missed appointments, double-bookings, and poor customer communication. Staff spend hours managing schedules instead of focusing on their craft.',
    solution: 'EliteCuts delivers a seamless digital booking experience with real-time availability, automated email notifications, and a powerful admin dashboard — giving salon owners full control while customers enjoy a frictionless booking journey.',
    features: [
      { emoji: '📅', title: 'Real-time Scheduling', desc: 'Live slot availability with instant conflict detection' },
      { emoji: '🔔', title: 'Email Notifications', desc: 'Automated booking confirmations & reminders' },
      { emoji: '👤', title: 'Customer Management', desc: 'Full customer profiles, preferences & history' },
      { emoji: '📊', title: 'Admin Dashboard', desc: 'Complete booking overview with analytics' },
      { emoji: '🖼️', title: 'Image Uploads', desc: 'Showcase styles & services with rich media' },
      { emoji: '⏱️', title: 'Time Slot Management', desc: 'Flexible working hours & schedule config' },
    ],
    techStack: [
      { label: 'Frontend', color: 'var(--tint)', items: ['React', 'Angular'] },
      { label: 'Backend', color: 'var(--tint-indigo)', items: ['Spring Boot', 'Express'] },
      { label: 'DevOps', color: 'var(--tint-teal)', items: ['Docker', 'CI/CD Pipelines'] },
    ],
    highlights: [
      'Designed scalable REST APIs handling concurrent booking requests',
      'Built reusable UI component library shared across Angular & React views',
      'Optimised API response times for high-concurrency booking scenarios',
      'Containerised full-stack deployment using Docker Compose',
      'Automated CI/CD pipeline for zero-downtime deployments',
    ],
    screenshots: ['/project_salon_ss_01.png', '/project_salon_ss_02.png', '/project_salon_ss_03.png'],
  },
  {
    id: 'fitbook',
    title: 'FitBook',
    tagline: 'Online class booking & membership platform for modern gyms',
    tags: ['React', 'Node.js', 'MongoDB', 'Online Booking'],
    thumbnail: '/project_gym_cover.png',
    demoUrl: null as string | null,
    githubUrl: null as string | null,
    problem: 'Gym operators relying on phone calls and spreadsheets face constant scheduling conflicts, membership lapses, and frustrated members who can\'t easily view or book available classes. Front-desk staff are overwhelmed while peak-hour classes go under-utilised.',
    solution: 'FitBook gives gyms a fully digital operation centre — members self-serve class bookings in real time, administrators manage schedules and membership plans from a single dashboard, and automated reminders keep attendance rates high.',
    features: [
      { emoji: '🏋️', title: 'Class Booking', desc: 'Real-time schedule with instant seat reservation' },
      { emoji: '💳', title: 'Membership Plans', desc: 'Flexible plan management with auto-renewal support' },
      { emoji: '👨‍🏫', title: 'Trainer Profiles', desc: 'Dedicated pages for trainers with class history' },
      { emoji: '🔔', title: 'Smart Reminders', desc: 'Automated email & SMS class reminders' },
      { emoji: '📊', title: 'Capacity Management', desc: 'Live waitlist & capacity enforcement per class' },
      { emoji: '📈', title: 'Attendance Analytics', desc: 'Insights on peak hours, popular classes & retention' },
    ],
    techStack: [
      { label: 'Frontend', color: 'var(--tint)', items: ['React', 'Tailwind CSS'] },
      { label: 'Backend', color: 'var(--tint-indigo)', items: ['Node.js', 'Express', 'MongoDB'] },
      { label: 'Infra', color: 'var(--tint-teal)', items: ['Docker', 'AWS S3', 'Nodemailer'] },
    ],
    highlights: [
      'Engineered a conflict-free slot reservation engine with optimistic concurrency control',
      'Designed a role-based access system for members, trainers, and gym admins',
      'Implemented real-time waitlist promotion with automated email triggers',
      'Built a recurring membership billing module with grace-period handling',
      'Reduced average booking time by 80% compared to the previous phone-based process',
    ],
    screenshots: ['/project_gym_ss_01.png', '/project_gym_ss_02.png', '/project_gym_ss_03.png'],
  },
  {
    id: 'tea-erp',
    title: 'Tea ERP System',
    tagline: 'Enterprise Resource Planning solution for tea manufacturing and export businesses',
    tags: ['Angular', 'Spring Boot', 'Oracle SQL', 'Docker', 'Kubernetes', 'Enterprise System'],
    thumbnail: '/project_gym_cover.png',
    demoUrl: null as string | null,
    githubUrl: null as string | null,
    problem: 'Tea manufacturing and export businesses rely on fragmented systems to manage inquiries, order processing, production tracking, and invoicing workflows. This leads to inefficiencies, data inconsistencies, and limited visibility across the full operation — making it nearly impossible to make timely, informed decisions.',
    solution: 'The Tea ERP system provides a centralised, scalable platform to manage the full business lifecycle — from inquiry to invoice. It enables real-time tracking, streamlined workflows, and improved decision-making through a unified dashboard and structured data management across every department.',
    features: [
      { emoji: '📊', title: 'Sales Dashboard & Analytics', desc: 'Real-time KPIs and business insights in a unified view' },
      { emoji: '📦', title: 'Order & Contract Management', desc: 'Full lifecycle management from order creation to fulfilment' },
      { emoji: '🧾', title: 'Invoice & Payment Tracking', desc: 'Structured invoicing with payment status and history' },
      { emoji: '👥', title: 'Customer & Inquiry Management', desc: 'Centralised CRM for customers, leads, and inquiry pipelines' },
      { emoji: '🔄', title: 'Production Workflow Tracking', desc: 'End-to-end visibility into manufacturing stages' },
      { emoji: '🧩', title: 'Modular Master Data', desc: 'Reusable, structured master data across all ERP modules' },
      { emoji: '📈', title: 'Pipeline Visibility', desc: 'Inquiry-to-conversion funnel tracking with stage analytics' },
      { emoji: '🔍', title: 'Advanced Filtering & Search', desc: 'Powerful search and filter across large enterprise datasets' },
    ],
    techStack: [
      { label: 'Frontend', color: 'var(--tint)', items: ['Angular', 'TypeScript', 'SCSS'] },
      { label: 'Backend', color: 'var(--tint-indigo)', items: ['Java', 'Spring Boot', 'Oracle SQL', 'REST APIs'] },
      { label: 'DevOps', color: 'var(--tint-teal)', items: ['Docker', 'Kubernetes', 'CI/CD Pipelines'] },
    ],
    highlights: [
      'Designed and implemented scalable REST APIs for complex enterprise workflows',
      'Built modular Angular components for reusable UI across all ERP modules',
      'Implemented backend pagination and filtering strategies for large datasets',
      'Optimised Oracle SQL performance with indexing and query tuning',
      'Developed end-to-end CI/CD pipelines for automated, zero-downtime deployments',
      'Containerised applications using Docker and orchestrated with Kubernetes',
      'Ensured high availability and multi-region readiness across the platform',
    ],
    screenshots: ['/project_gym_ss_01.png', '/project_gym_ss_02.png', '/project_gym_ss_03.png'],
  },
]

type Project = typeof PROJECTS[0]

// ── Project Modal ──────────────────────────────────────────
function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [lightbox, setLightbox] = useState<string | null>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (lightbox) setLightbox(null)
        else onClose()
      }
      if (e.key === 'ArrowRight' && lightbox) {
        const idx = project.screenshots.indexOf(lightbox)
        if (idx < project.screenshots.length - 1) setLightbox(project.screenshots[idx + 1])
      }
      if (e.key === 'ArrowLeft' && lightbox) {
        const idx = project.screenshots.indexOf(lightbox)
        if (idx > 0) setLightbox(project.screenshots[idx - 1])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose, lightbox, project.screenshots])

  function bookDemo() {
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url: CALENDLY_URL })
    } else {
      window.open(CALENDLY_URL, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet glass-thick" onClick={e => e.stopPropagation()}>

        {/* Sticky close */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div className="modal-scroll-body">

          {/* ── 1. Title + Tags ── */}
          <div className="modal-section modal-header-section">
            <h2 className="modal-title">{project.title}</h2>
            <div className="modal-tags">
              {project.tags.map(t => <span key={t} className="modal-tag">{t}</span>)}
            </div>
            <p className="modal-tagline">{project.tagline}</p>
          </div>

          {/* ── 2. Hero screenshot ── */}
          <div className="modal-hero-img-wrap">
            <img src={project.thumbnail} alt={`${project.title} cover`} className="modal-hero-img" />
          </div>

          {/* ── 3. Action buttons ── */}
          <div className="modal-actions">
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="ios-btn ios-btn-primary modal-action-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="ios-btn ios-btn-ghost modal-action-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                </svg>
                GitHub
              </a>
            )}
            <button className="ios-btn ios-btn-ghost modal-action-btn" onClick={bookDemo}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Book Demo Call
            </button>
          </div>

          {/* ── 4. Problem / Solution ── */}
          <div className="modal-section">
            <div className="modal-ps-grid">
              <div className="modal-ps-card modal-ps-problem">
                <p className="modal-section-label">The Problem</p>
                <p className="modal-ps-text">{project.problem}</p>
              </div>
              <div className="modal-ps-card modal-ps-solution">
                <p className="modal-section-label">The Solution</p>
                <p className="modal-ps-text">{project.solution}</p>
              </div>
            </div>
          </div>

          {/* ── 5. Features Grid ── */}
          <div className="modal-section">
            <p className="modal-section-label">Key Features</p>
            <div className="modal-features-grid">
              {project.features.map(f => (
                <div key={f.title} className="modal-feature-card glass-card">
                  <span className="modal-feature-emoji">{f.emoji}</span>
                  <span className="modal-feature-title">{f.title}</span>
                  <span className="modal-feature-desc">{f.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── 6. Tech Stack ── */}
          <div className="modal-section">
            <p className="modal-section-label">Tech Stack</p>
            <div className="modal-tech-groups">
              {project.techStack.map(g => (
                <div key={g.label} className="modal-tech-group">
                  <span className="modal-tech-group-label" style={{ color: g.color }}>{g.label}</span>
                  <div className="modal-tech-chips">
                    {g.items.map(item => (
                      <span key={item} className="skill-tag" style={{ color: g.color, background: `color-mix(in srgb, ${g.color} 10%, transparent)`, borderColor: `color-mix(in srgb, ${g.color} 22%, transparent)` }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 7. Engineering Highlights ── */}
          <div className="modal-section">
            <p className="modal-section-label">Engineering Highlights</p>
            <ul className="modal-highlights-list">
              {project.highlights.map(h => (
                <li key={h} className="modal-highlight-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--tint)', flexShrink: 0 }}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {h}
                </li>
              ))}
            </ul>
          </div>

          {/* ── 8. Screenshots ── */}
          {project.screenshots.length > 0 && (
            <div className="modal-section">
              <p className="modal-section-label">Screenshots</p>
              <div className="modal-screenshots-row">
                {project.screenshots.map((src, i) => (
                  <button key={i} className="modal-screenshot-thumb-btn" onClick={() => setLightbox(src)} aria-label={`View screenshot ${i + 1}`}>
                    <img src={src} alt={`${project.title} screenshot ${i + 1}`} className="modal-screenshot-thumb" />
                    <span className="modal-screenshot-zoom-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                      </svg>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── 9. CTA ── */}
          <div className="modal-cta-section">
            <h3 className="modal-cta-heading">Interested in this project?</h3>
            <p className="modal-cta-sub">Let's hop on a 30-minute call to discuss it or explore how I can build something similar for you.</p>
            <button className="ios-btn ios-btn-primary modal-cta-btn" onClick={bookDemo}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Book a Call
            </button>
          </div>

        </div>
      </div>

      {/* ── Lightbox — rendered outside .modal-sheet so position:fixed targets the viewport, not the animated transform parent ── */}
      {lightbox && (
        <div className="lightbox-backdrop" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Close preview">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          {project.screenshots.indexOf(lightbox) > 0 && (
            <button className="lightbox-arrow lightbox-arrow-prev" onClick={e => { e.stopPropagation(); const i = project.screenshots.indexOf(lightbox); setLightbox(project.screenshots[i - 1]) }} aria-label="Previous">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
          )}

          <img src={lightbox} alt="Preview" className="lightbox-img" onClick={e => e.stopPropagation()} />

          {project.screenshots.indexOf(lightbox) < project.screenshots.length - 1 && (
            <button className="lightbox-arrow lightbox-arrow-next" onClick={e => { e.stopPropagation(); const i = project.screenshots.indexOf(lightbox); setLightbox(project.screenshots[i + 1]) }} aria-label="Next">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          )}

          <div className="lightbox-dots">
            {project.screenshots.map((s, i) => (
              <button key={i} className={`lightbox-dot${s === lightbox ? ' active' : ''}`} onClick={e => { e.stopPropagation(); setLightbox(s) }} aria-label={`Go to screenshot ${i + 1}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Projects Section ───────────────────────────────────────
function ProjectsSection() {
  const sectionRef = useScrollReveal()
  const [selected, setSelected] = useState<Project | null>(null)

  return (
    <section id="projects" style={{ paddingTop: 100 }} ref={sectionRef as React.RefObject<HTMLElement>}>
      <div className="reveal" style={{ marginBottom: 36 }}>
        <span className="about-eyebrow">What I've built</span>
        <h2 className="gradient-text" style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, letterSpacing: '-0.6px', margin: '8px 0 0' }}>
          Projects
        </h2>
      </div>

      <div className="projects-grid">
        {PROJECTS.map((p, i) => (
          <button
            key={p.id}
            className="reveal project-card glass-card"
            style={{ '--reveal-delay': `${i * 0.1}s` } as React.CSSProperties}
            onClick={() => setSelected(p)}
          >
            {/* Thumbnail */}
            <div className="project-card-img-wrap">
              <img src={p.thumbnail} alt={p.title} className="project-card-img" />
              {p.demoUrl && <span className="project-live-badge">● Live</span>}
            </div>

            {/* Body */}
            <div className="project-card-body">
              <div className="project-card-tags">
                {p.tags.slice(0, 3).map(t => <span key={t} className="project-card-tag">{t}</span>)}
              </div>
              <h3 className="project-card-title">{p.title}</h3>
              <p className="project-card-tagline">{p.tagline}</p>
            </div>

            {/* Footer */}
            <div className="project-card-footer">
              <span className="project-card-cta">View Details</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </button>
        ))}
      </div>

      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}

const CALL_AGENDA = [
  { text: 'Get to know each other & share your goals' },
  { text: 'Job opportunities, freelance or consulting work' },
  { text: 'Collaborations, open-source or side projects' },
  { text: 'Tech advice, mentoring or just a friendly chat' },
  { text: 'Anything else on your mind — all topics welcome' },
]

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
    value: 'linkedin.com/in/gihan-dissanayaka/',
    href: 'https://www.linkedin.com/in/gihan-dissanayaka/',
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

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://assets.calendly.com/assets/external/widget.css'
    document.head.appendChild(link)

    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    document.head.appendChild(script)

    return () => {
      if (document.head.contains(link)) document.head.removeChild(link)
      if (document.head.contains(script)) document.head.removeChild(script)
    }
  }, [])

  function openCalendly(url: string) {
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url })
    } else {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <section id="contact" style={{ paddingTop: 100 }} ref={sectionRef as React.RefObject<HTMLElement>}>
      {/* Header */}
      <div className="reveal" style={{ marginBottom: 36 }}>
        <span className="about-eyebrow">Let's connect</span>
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

        {/* ── Right: Book a Call ──────────────────────── */}
        <div className="reveal contact-form-wrap glass-card" style={{ '--reveal-delay': '0.15s' } as React.CSSProperties}>

          {/* Card header */}
          <div className="book-call-header">
            <div className="book-call-cal-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>Book a Call</h3>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>30-minute call — no agenda needed</p>
            </div>
            <span className="meeting-duration-badge">30 min</span>
          </div>

          {/* What we'll cover */}
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-placeholder)', margin: '0 0 12px' }}>What we'll cover</p>
          <ul className="call-agenda">
            {CALL_AGENDA.map(({ text }) => (
              <li key={text} className="call-agenda-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--tint)', flexShrink: 0 }}>
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {text}
              </li>
            ))}
          </ul>

          {/* Primary CTA */}
          <button className="ios-btn ios-btn-primary contact-submit" style={{ marginTop: 28 }} onClick={() => openCalendly(CALENDLY_URL)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Schedule a Meeting
          </button>

          {/* Footer note */}
          <p className="book-call-note">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            Times shown in your local timezone · Powered by Calendly
          </p>
        </div>
      </div>
    </section>
  )
}

// ── App ────────────────────────────────────────────────────
export default function App() {
  const { dark, toggle } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

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
      <header className="navbar-header">
        <div className="glass-thick navbar-container">

          {/* Main bar */}
          <nav className="navbar-inner">
            {/* Logo */}
            <a href="#" className="gradient-text navbar-logo" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>Gihan</a>

            {/* Desktop links */}
            <ul className="navbar-links">
              {navLinks.map(({ id, label }) => (
                <li key={id}>
                  <a href={`#${id}`} className="nav-link">{label}</a>
                </li>
              ))}
            </ul>

            {/* Right controls */}
            <div className="navbar-controls">
              <button className="theme-toggle" onClick={toggle} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
                {dark ? <SunIcon /> : <MoonIcon />}
              </button>
              {/* Hamburger — mobile only */}
              <button
                className="hamburger"
                onClick={() => setMenuOpen(o => !o)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
              >
                {menuOpen
                  ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6"  x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                }
              </button>
            </div>
          </nav>

          {/* Mobile dropdown */}
          {menuOpen && (
            <ul className="navbar-mobile-menu">
              {navLinks.map(({ id, label }) => (
                <li key={id}>
                  <a href={`#${id}`} className="navbar-mobile-link" onClick={() => setMenuOpen(false)}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          )}

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
            <span className="gradient-text">Gihan<br className="hero-br" /> Dissanayaka</span>
          </h1>

          {/* Sub-description */}
          <p className="hero-text-in hero-desc" style={{ animationDelay: '0.35s' }}>
            Building scalable, high-performance web applications — from intuitive frontends to robust backend systems.
            Now shipping faster than ever with <span style={{ color: 'var(--tint-pink)', fontWeight: 600 }}>vibe coding</span>.
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
                with <strong style={{ color: 'var(--text)' }}>3+ years of expertise</strong> delivering scalable, enterprise-grade 
                applications in the <strong style={{ color: 'var(--text)' }}>travel and ERP domains</strong>.
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.8, margin: '0 0 14px' }}>
                With expertise in <strong style={{ color: 'var(--text)' }}>Angular, React, Spring Boot, and Express,</strong> I design 
                and build high-performance systems — from intuitive, reusable frontend architectures to robust backend services 
                handling complex business logic.
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.8, margin: '0 0 14px' }}>
                I currently lead end-to-end implementation workflows, leveraging AI-assisted development 
                practices alongside modern DevOps tooling, including Docker, Kubernetes, and CI/CD pipelines, 
                to ensure reliable and efficient deployments.
              </p>

              <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.8, margin: 0 }}>
                My focus is on performance, scalability, and clean engineering — enabling teams to move faster 
                while delivering seamless user experiences.
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
        <ProjectsSection />

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
              <a href="https://www.linkedin.com/in/gihan-dissanayaka/" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="LinkedIn">
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
