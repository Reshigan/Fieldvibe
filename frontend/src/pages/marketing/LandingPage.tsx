import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Play } from 'lucide-react'

const FieldVibeLogo = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[42px] h-[42px]">
    <circle cx="24" cy="24" r="22" stroke="url(#fv-grad)" strokeWidth="2.5" strokeDasharray="4 3" opacity="0.4"/>
    <path d="M14 28C14 28 17 18 24 18C31 18 34 28 34 28" stroke="url(#fv-grad)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <path d="M10 32C10 32 15 14 24 14C33 14 38 32 38 32" stroke="url(#fv-grad)" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"/>
    <circle cx="24" cy="24" r="5" fill="url(#fv-grad)"/>
    <circle cx="24" cy="24" r="2" fill="#0A0F1C"/>
    <path d="M24 10L24 18" stroke="#00E87B" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M20 14L24 10L28 14" stroke="#00E87B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="fv-grad" x1="8" y1="8" x2="40" y2="40">
        <stop offset="0%" stopColor="#00E87B"/>
        <stop offset="100%" stopColor="#4BFFB5"/>
      </linearGradient>
    </defs>
  </svg>
)

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true)
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

function Reveal({ delay = 0, children, className = '' }: { delay?: number; children: React.ReactNode; className?: string }) {
  const { ref, visible } = useReveal()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay * 0.1}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay * 0.1}s`,
      }}
    >
      {children}
    </div>
  )
}

const chartHeights = [35, 52, 44, 68, 55, 78, 60, 85, 72, 90, 65, 95, 70, 80, 62, 88, 75, 92, 58, 82]

const features = [
  { emoji: '\u{1F4CD}', title: 'GPS-Verified Check-Ins', desc: 'Every visit is stamped with precise coordinates, timestamp, and photo evidence. No more ghost visits or fabricated reports.', color: 'green' },
  { emoji: '\u{1F4CB}', title: 'Dynamic Questionnaires', desc: 'Build custom survey forms with conditional logic, duplicate detection, and brand-specific templates. Text, radio, checkbox, image capture.', color: 'blue' },
  { emoji: '\u{1F690}', title: 'Van Sales & Stock', desc: 'Load stock onto vans, sell in the field, track returns and damaged goods, reconcile cash \u2014 all with full audit trail and variance alerts.', color: 'amber' },
  { emoji: '\u{1F4CA}', title: 'Real-Time Analytics', desc: 'Live dashboards with visit trends, revenue charts, agent rankings, brand coverage maps, and KPI tracking. Export to XLSX instantly.', color: 'violet' },
  { emoji: '\u{1F3AF}', title: 'Goals & Commissions', desc: 'Set daily, weekly, monthly targets. Auto-track progress from visits and sales. Commission engine calculates earnings and routes approvals.', color: 'coral' },
  { emoji: '\u{1F4F1}', title: 'Offline-First Mobile', desc: 'The React Native app works without signal. Photos, visits, and sales queue locally and sync automatically when connectivity returns.', color: 'white' },
]

const featureIconBg: Record<string, string> = {
  green: 'rgba(0, 232, 123, 0.1)',
  blue: 'rgba(75, 158, 255, 0.1)',
  amber: 'rgba(255, 181, 71, 0.1)',
  violet: 'rgba(167, 139, 250, 0.1)',
  coral: 'rgba(255, 107, 107, 0.1)',
  white: 'rgba(240, 243, 250, 0.08)',
}

const modules = [
  { emoji: '\u{1F3EA}', title: 'Field Visits & Check-Ins', desc: 'GPS-stamped shop and individual visits with photo capture, dynamic questionnaires, brand/product selection, and manager approval workflows.', tags: ['GPS Lock', 'Photo Evidence', 'Questionnaires'] },
  { emoji: '\u{1F4B0}', title: 'Sales Order Management', desc: 'Create orders at point of visit. Product catalog with brand/category hierarchy. Multi-payment support. Invoice generation. VAT calculation.', tags: ['Cart Builder', 'Partial Payments', 'VAT'] },
  { emoji: '\u{1F69B}', title: 'Van Sales & Distribution', desc: 'Load stock from warehouse onto vans. Sell in the field with real-time inventory. Cash reconciliation with denomination counting.', tags: ['Load Management', 'Cash Recon', 'Stock Tracking'] },
  { emoji: '\u{1F4E6}', title: 'Stock & Warehouse', desc: 'Multi-warehouse inventory with reorder alerts. Purchase order lifecycle. Stock movements with full audit trail. Batch and expiry tracking.', tags: ['Multi-Warehouse', 'PO Management', 'Alerts'] },
  { emoji: '\u{1F3AA}', title: 'Campaigns & Promotions', desc: 'Plan marketing campaigns. Assign agents to activations. Track interactions, samples, and generated sales. Measure ROI per campaign.', tags: ['Activation Tracking', 'ROI Analysis', 'Agent Assignment'] },
  { emoji: '\u{1F3C6}', title: 'Goals & Performance', desc: 'Set targets at any level: daily, weekly, monthly. Auto-progress from field activity. Leaderboards. Manager KPI dashboards.', tags: ['Auto-Tracking', 'Leaderboards', 'XLSX Export'] },
  { emoji: '\u{1F48E}', title: 'Commissions Engine', desc: 'Configurable rules by source type (sales, visits, activations). Auto-calculation. Manager approval workflow. Payment tracking.', tags: ['Rule Engine', 'Auto-Calculate', 'Approvals'] },
  { emoji: '\u{1F3E2}', title: 'Multi-Tenant + Cross-Tenant', desc: 'Complete data isolation per company. Agents can work across multiple tenants. Company context switching. Centralized admin view.', tags: ['Data Isolation', 'Cross-Tenant', 'Context Switch'] },
]

const pricing = [
  {
    tier: 'Starter', name: 'Field Ops', desc: 'For small field teams getting started',
    price: 'R0', unit: '/month', period: 'Up to 5 agents',
    features: ['GPS-verified check-ins', 'Photo capture & evidence', 'Dynamic questionnaires', 'Basic reporting', 'Mobile app (offline)', '1 company'],
    featured: false,
  },
  {
    tier: 'Professional', name: 'Sales + Ops', desc: 'For growing teams with sales targets',
    price: 'R149', unit: '/agent/mo', period: 'Unlimited agents',
    features: ['Everything in Starter', 'Sales order management', 'Van sales & stock tracking', 'Goals & KPI tracking', 'Commission engine', 'Advanced analytics', 'XLSX report exports', 'Multi-tenant (3 companies)'],
    featured: true,
  },
  {
    tier: 'Enterprise', name: 'Full Platform', desc: 'For large operations needing everything',
    price: 'Custom', unit: '', period: 'Volume discounts available',
    features: ['Everything in Professional', 'Unlimited companies', 'Cross-tenant agent access', 'Campaign & promotion engine', 'Warehouse management', 'API access & webhooks', 'Dedicated support', 'Custom integrations', 'On-premise option'],
    featured: false,
  },
]

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [chartReady, setChartReady] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    const t = setTimeout(() => setChartReady(true), 800)
    return () => { window.removeEventListener('scroll', onScroll); clearTimeout(t) }
  }, [])

  return (
    <div style={{ fontFamily: "'Outfit', -apple-system, sans-serif", background: '#0A0F1C', color: '#C5D0E6', overflowX: 'hidden', WebkitFontSmoothing: 'antialiased' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');
        @keyframes fv-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes fv-pulse-ring { 0% { transform: scale(0.8); opacity: 0.6; } 100% { transform: scale(1.8); opacity: 0; } }
        @keyframes fv-gradient-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes fv-ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .fv-accent { background: linear-gradient(135deg, #00E87B, #4BFFB5, #4B9EFF); background-size: 200% 200%; animation: fv-gradient-shift 4s ease infinite; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .fv-float { animation: fv-float 8s ease-in-out infinite; }
        .fv-float-d3 { animation: fv-float 8s ease-in-out infinite; animation-delay: -3s; }
        .fv-float-d5 { animation: fv-float 8s ease-in-out infinite; animation-delay: -5s; }
        .fv-pulse-dot::after { content: ''; position: absolute; inset: -4px; border-radius: 50%; border: 2px solid #00E87B; animation: fv-pulse-ring 2s ease-out infinite; }
        .fv-ticker-track { display: flex; animation: fv-ticker 30s linear infinite; width: max-content; }
        .fv-chart-bar { transition: height 0.6s cubic-bezier(0.16, 1, 0.3, 1); background: linear-gradient(to top, #00C968, #00E87B); }
        .fv-card:hover { transform: translateY(-6px); border-color: rgba(0, 232, 123, 0.2); box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); }
        .fv-card:hover .fv-card-line { opacity: 1; }
        .fv-map-dot::after { content: ''; position: absolute; inset: -4px; border-radius: 50%; border: 1.5px solid rgba(0, 232, 123, 0.3); animation: fv-pulse-ring 2.5s ease-out infinite; }
        .fv-stat-gradient { background: linear-gradient(135deg, #F0F3FA, #00E87B); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .fv-btn-primary { background: #00E87B; color: #0A0F1C; box-shadow: 0 4px 30px rgba(0, 232, 123, 0.2); }
        .fv-btn-primary:hover { transform: translateY(-3px); box-shadow: 0 12px 50px rgba(0, 232, 123, 0.35); background: #1DFFB2; }
      `}</style>

      {/* NAVIGATION */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: scrolled ? '12px 0' : '18px 0',
        background: scrolled ? 'rgba(10, 15, 28, 0.92)' : 'rgba(10, 15, 28, 0.7)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(59, 79, 116, 0.15)',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <FieldVibeLogo />
            <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#F0F3FA' }}>
              Field<span style={{ color: '#00E87B' }}>Vibe</span>
            </span>
          </Link>
          <div className="hidden md:flex" style={{ gap: 36, alignItems: 'center' }}>
            <a href="#features" style={{ color: '#8B9DC3', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>Features</a>
            <a href="#modules" style={{ color: '#8B9DC3', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>Modules</a>
            <a href="#how" style={{ color: '#8B9DC3', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>How It Works</a>
            <a href="#pricing" style={{ color: '#8B9DC3', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>Pricing</a>
            <Link to="/auth/login" className="fv-btn-primary" style={{ padding: '10px 28px', borderRadius: 100, fontWeight: 700, fontSize: '0.88rem', letterSpacing: '0.02em', transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)', textDecoration: 'none' }}>
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', padding: '120px 0 80px' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'radial-gradient(ellipse 80% 50% at 20% 40%, rgba(0, 232, 123, 0.06) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 20%, rgba(75, 158, 255, 0.04) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 50% 100%, rgba(167, 139, 250, 0.03) 0%, transparent 50%)' }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, backgroundImage: 'linear-gradient(rgba(59, 79, 116, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 79, 116, 0.07) 1px, transparent 1px)', backgroundSize: '60px 60px', maskImage: 'radial-gradient(ellipse 60% 50% at 50% 40%, black 20%, transparent 70%)' }} />
        <div className="fv-float" style={{ position: 'absolute', width: 400, height: 400, top: '10%', left: '-5%', background: 'rgba(0, 232, 123, 0.08)', borderRadius: '50%', filter: 'blur(80px)' }} />
        <div className="fv-float-d3" style={{ position: 'absolute', width: 300, height: 300, top: '60%', right: '-5%', background: 'rgba(75, 158, 255, 0.06)', borderRadius: '50%', filter: 'blur(80px)' }} />
        <div className="fv-float-d5" style={{ position: 'absolute', width: 200, height: 200, top: '30%', right: '20%', background: 'rgba(167, 139, 250, 0.05)', borderRadius: '50%', filter: 'blur(80px)' }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 2 }} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px 6px 8px', background: 'rgba(0, 232, 123, 0.06)', border: '1px solid rgba(0, 232, 123, 0.2)', borderRadius: 100, fontSize: '0.82rem', fontWeight: 600, color: '#00E87B', marginBottom: 28 }}>
              <div style={{ width: 8, height: 8, background: '#00E87B', borderRadius: '50%', position: 'relative' }} className="fv-pulse-dot" />
              Built for Africa&apos;s field teams
            </div>
            <h1 style={{ fontSize: 'clamp(2.8rem, 5vw, 4.2rem)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.035em', color: '#F0F3FA', marginBottom: 24 }}>
              Your field force,<br/><span className="fv-accent">fully visible.</span>
            </h1>
            <p style={{ fontSize: '1.15rem', lineHeight: 1.65, color: '#8B9DC3', maxWidth: 520, marginBottom: 40 }}>
              GPS-verified visits. Real-time sales intelligence. Van stock at your fingertips. FieldVibe turns every field interaction into actionable data &mdash; even when your agents are offline.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link to="/auth/login" className="fv-btn-primary" style={{ padding: '16px 36px', borderRadius: 14, fontWeight: 700, fontSize: '1rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10, transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                <ArrowRight size={18} /> Start Free Trial
              </Link>
              <a href="#modules" style={{ background: 'rgba(59, 79, 116, 0.2)', color: '#C5D0E6', padding: '16px 36px', borderRadius: 14, fontWeight: 600, fontSize: '1rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10, border: '1px solid rgba(59, 79, 116, 0.3)', transition: 'all 0.3s' }}>
                <Play size={18} /> See All Modules
              </a>
            </div>
          </div>

          {/* Hero Dashboard Mockup */}
          <div style={{ position: 'relative' }}>
            <div style={{ background: '#0F1629', border: '1px solid rgba(59, 79, 116, 0.2)', borderRadius: 20, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0, 0, 0, 0.4), 0 0 1px rgba(0, 232, 123, 0.1)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: -1, left: '20%', right: '20%', height: 2, background: 'linear-gradient(90deg, transparent, #00E87B, transparent)' }} />
              <div style={{ height: 38, background: '#141C33', display: 'flex', alignItems: 'center', padding: '0 14px', gap: 8, borderBottom: '1px solid rgba(59, 79, 116, 0.15)' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFBD2E' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28CA42' }} />
              </div>
              <div style={{ padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                {[
                  { label: "Today's Visits", value: '147', change: '\u2191 23%' },
                  { label: 'Revenue', value: 'R48K', change: '\u2191 18%' },
                  { label: 'Active Agents', value: '32', change: '\u25CF Live' },
                ].map((s, i) => (
                  <div key={i} style={{ background: '#141C33', borderRadius: 12, padding: 16, border: '1px solid rgba(59, 79, 116, 0.12)' }}>
                    <div style={{ fontSize: '0.72rem', color: '#8B9DC3', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{s.label}</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#F0F3FA', fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</div>
                    <div style={{ fontSize: '0.72rem', color: '#00E87B', fontWeight: 600, marginTop: 4 }}>{s.change}</div>
                  </div>
                ))}
                <div style={{ gridColumn: '1 / -1', background: '#141C33', borderRadius: 12, padding: 20, border: '1px solid rgba(59, 79, 116, 0.12)', height: 140, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 100, paddingTop: 10 }}>
                    {chartHeights.map((h, i) => (
                      <div key={i} className="fv-chart-bar" style={{ flex: 1, borderRadius: '4px 4px 0 0', height: chartReady ? `${h}%` : '0%', opacity: 0.7, transitionDelay: `${i * 60}ms` }} />
                    ))}
                  </div>
                </div>
                <div style={{ gridColumn: '1 / -1', background: '#141C33', borderRadius: 12, height: 120, border: '1px solid rgba(59, 79, 116, 0.12)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', inset: 0, opacity: 0.08, backgroundImage: 'linear-gradient(rgba(139, 157, 195, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 157, 195, 0.5) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                  {[
                    { top: '25%', left: '35%' }, { top: '40%', left: '55%' }, { top: '55%', left: '30%' },
                    { top: '35%', left: '70%' }, { top: '60%', left: '60%' }, { top: '20%', left: '50%' }, { top: '70%', left: '45%' },
                  ].map((pos, i) => (
                    <div key={i} className="fv-map-dot" style={{ position: 'absolute', width: 8, height: 8, background: '#00E87B', borderRadius: '50%', boxShadow: '0 0 12px rgba(0, 232, 123, 0.5)', top: pos.top, left: pos.left }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div style={{ padding: '28px 0', borderTop: '1px solid rgba(59, 79, 116, 0.1)', borderBottom: '1px solid rgba(59, 79, 116, 0.1)', overflow: 'hidden', background: 'rgba(15, 22, 41, 0.5)' }}>
        <div className="fv-ticker-track">
          {['GPS-Verified Visits', 'Photo Evidence', 'Real-Time Tracking', 'Multi-Tenant', 'Dynamic Questionnaires', 'Live Analytics', 'Van Sales', 'Offline-First', 'GPS-Verified Visits', 'Photo Evidence', 'Real-Time Tracking', 'Multi-Tenant', 'Dynamic Questionnaires', 'Live Analytics', 'Van Sales', 'Offline-First'].map((label, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 40px', whiteSpace: 'nowrap', fontSize: '0.85rem', fontWeight: 600, color: '#3B4F74', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              <span style={{ color: '#00E87B', opacity: 0.5, fontSize: '1rem' }}>{'\u25C6'}</span>
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section id="features" style={{ padding: '100px 0', position: 'relative' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
          <Reveal><div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', fontWeight: 700, color: '#00E87B', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16 }}><span style={{ width: 20, height: 2, background: '#00E87B', borderRadius: 1, display: 'inline-block' }} /> Core Platform</div></Reveal>
          <Reveal delay={1}><h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.03em', color: '#F0F3FA', marginBottom: 20 }}>Everything your field team needs.<br/>Nothing they don&apos;t.</h2></Reveal>
          <Reveal delay={2}><p style={{ fontSize: '1.1rem', lineHeight: 1.65, color: '#8B9DC3', maxWidth: 600 }}>FieldVibe replaces clipboards, WhatsApp groups, and spreadsheet chaos with a single intelligent platform that works even without signal.</p></Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginTop: 64 }}>
            {features.map((f, i) => (
              <Reveal key={i} delay={i % 3}>
                <div className="fv-card" style={{ background: '#0F1629', border: '1px solid rgba(59, 79, 116, 0.12)', borderRadius: 16, padding: '36px 32px', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', position: 'relative', overflow: 'hidden', height: '100%' }}>
                  <div className="fv-card-line" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #00E87B, transparent)', opacity: 0, transition: 'opacity 0.3s' }} />
                  <div style={{ width: 52, height: 52, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22, fontSize: '1.4rem', background: featureIconBg[f.color] }}>{f.emoji}</div>
                  <h3 style={{ fontSize: '1.18rem', fontWeight: 700, color: '#F0F3FA', marginBottom: 10, letterSpacing: '-0.01em' }}>{f.title}</h3>
                  <p style={{ fontSize: '0.92rem', lineHeight: 1.6, color: '#8B9DC3' }}>{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, padding: '60px 0', borderTop: '1px solid rgba(59, 79, 116, 0.12)', borderBottom: '1px solid rgba(59, 79, 116, 0.12)', margin: '80px 0' }}>
          {[
            { value: '99.7%', label: 'Uptime SLA' },
            { value: '< 2s', label: 'Sync Latency' },
            { value: '4', label: 'User Roles' },
            { value: '\u221E', label: 'Companies' },
          ].map((s, i) => (
            <Reveal key={i} delay={i}>
              <div style={{ textAlign: 'center' }}>
                <div className="fv-stat-gradient" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 900, letterSpacing: '-0.03em', fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</div>
                <div style={{ fontSize: '0.88rem', color: '#8B9DC3', marginTop: 6, fontWeight: 500 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* MODULES */}
      <section id="modules" style={{ padding: '100px 0', position: 'relative' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
          <Reveal><div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', fontWeight: 700, color: '#00E87B', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16 }}><span style={{ width: 20, height: 2, background: '#00E87B', borderRadius: 1, display: 'inline-block' }} /> System Modules</div></Reveal>
          <Reveal delay={1}><h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.03em', color: '#F0F3FA', marginBottom: 20 }}>Built modular.<br/>Deploy what you need.</h2></Reveal>
          <Reveal delay={2}><p style={{ fontSize: '1.1rem', lineHeight: 1.65, color: '#8B9DC3', maxWidth: 600 }}>Every module works independently or together. Start with field visits, add sales when you&apos;re ready, grow into van distribution.</p></Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 20, marginTop: 64 }}>
            {modules.map((m, i) => (
              <Reveal key={i} delay={i % 4}>
                <div style={{ background: '#0F1629', border: '1px solid rgba(59, 79, 116, 0.1)', borderRadius: 16, padding: 32, display: 'flex', gap: 20, alignItems: 'flex-start', transition: 'all 0.3s', height: '100%' }}>
                  <div style={{ fontSize: '2rem', flexShrink: 0, width: 48, textAlign: 'center' }}>{m.emoji}</div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#F0F3FA', marginBottom: 6 }}>{m.title}</h3>
                    <p style={{ fontSize: '0.88rem', color: '#8B9DC3', lineHeight: 1.55 }}>{m.desc}</p>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                      {m.tags.map((t, j) => (
                        <span key={j} style={{ padding: '3px 10px', borderRadius: 100, fontSize: '0.7rem', fontWeight: 600, background: 'rgba(0, 232, 123, 0.08)', color: '#00E87B', border: '1px solid rgba(0, 232, 123, 0.15)' }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ padding: '100px 0', position: 'relative' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
          <Reveal><div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', fontWeight: 700, color: '#00E87B', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16 }}><span style={{ width: 20, height: 2, background: '#00E87B', borderRadius: 1, display: 'inline-block' }} /> How It Works</div></Reveal>
          <Reveal delay={1}><h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.03em', color: '#F0F3FA', marginBottom: 20 }}>Live in 4 steps.</h2></Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32, marginTop: 64 }}>
            {[
              { num: '01', title: 'Configure', desc: 'Set up your company, add users, define shop locations, and build your questionnaire templates.' },
              { num: '02', title: 'Deploy', desc: 'Agents download the mobile app, log in with their credentials, and start visiting shops immediately.' },
              { num: '03', title: 'Operate', desc: 'Every visit, sale, and interaction is captured with GPS proof and synced to your dashboard in real-time.' },
              { num: '04', title: 'Grow', desc: 'Analyze performance, hit goals, optimize routes, and scale your field operation with data-driven decisions.' },
            ].map((step, i) => (
              <Reveal key={i} delay={i}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: 72, height: 72, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 900, margin: '0 auto 20px', background: 'linear-gradient(135deg, rgba(0, 232, 123, 0.15), rgba(0, 232, 123, 0.06))', border: '1px solid rgba(0, 232, 123, 0.2)', color: '#00E87B', fontFamily: "'JetBrains Mono', monospace" }}>{step.num}</div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#F0F3FA', marginBottom: 8 }}>{step.title}</h3>
                  <p style={{ fontSize: '0.88rem', color: '#8B9DC3', lineHeight: 1.55 }}>{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: '100px 0', position: 'relative' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
          <Reveal><div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', fontWeight: 700, color: '#00E87B', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16 }}><span style={{ width: 20, height: 2, background: '#00E87B', borderRadius: 1, display: 'inline-block' }} /> Pricing</div></Reveal>
          <Reveal delay={1}><h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.03em', color: '#F0F3FA', marginBottom: 20 }}>Transparent pricing.<br/>No surprises.</h2></Reveal>
          <Reveal delay={2}><p style={{ fontSize: '1.1rem', lineHeight: 1.65, color: '#8B9DC3', maxWidth: 600 }}>Start free, scale as you grow. All plans include the mobile app and unlimited visits.</p></Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginTop: 64 }}>
            {pricing.map((plan, i) => (
              <Reveal key={i} delay={i}>
                <div style={{
                  background: plan.featured ? 'linear-gradient(180deg, rgba(0, 232, 123, 0.04), #0F1629)' : '#0F1629',
                  border: plan.featured ? '1px solid #00E87B' : '1px solid rgba(59, 79, 116, 0.12)',
                  borderRadius: 16, padding: '40px 32px', position: 'relative', transition: 'all 0.3s',
                  boxShadow: plan.featured ? '0 0 60px rgba(0, 232, 123, 0.08)' : 'none',
                  height: '100%', display: 'flex', flexDirection: 'column' as const,
                }}>
                  {plan.featured && (
                    <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#00E87B', color: '#0A0F1C', padding: '4px 18px', borderRadius: 100, fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.08em' }}>MOST POPULAR</div>
                  )}
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#00E87B', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{plan.tier}</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F0F3FA', marginBottom: 6 }}>{plan.name}</div>
                  <div style={{ fontSize: '0.88rem', color: '#8B9DC3', marginBottom: 24 }}>{plan.desc}</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#F0F3FA', fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>
                    {plan.price}{plan.unit && <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#8B9DC3' }}> {plan.unit}</span>}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#3B4F74', marginBottom: 28 }}>{plan.period}</div>
                  <ul style={{ listStyle: 'none', marginBottom: 32, padding: 0, flex: 1 }}>
                    {plan.features.map((f, j) => (
                      <li key={j} style={{ padding: '8px 0', fontSize: '0.9rem', color: '#C5D0E6', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(59, 79, 116, 0.08)' }}>
                        <span style={{ color: '#00E87B', fontWeight: 700, fontSize: '0.82rem' }}>{'\u2713'}</span> {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/auth/login" style={{
                    display: 'block', textAlign: 'center', padding: 14, borderRadius: 12, fontWeight: 700, fontSize: '0.92rem', textDecoration: 'none', transition: 'all 0.3s', cursor: 'pointer', width: '100%',
                    background: plan.featured ? '#00E87B' : 'rgba(59, 79, 116, 0.15)',
                    color: plan.featured ? '#0A0F1C' : '#C5D0E6',
                    border: plan.featured ? 'none' : '1px solid rgba(59, 79, 116, 0.3)',
                  }}>
                    {plan.featured ? 'Start 14-Day Trial' : plan.tier === 'Enterprise' ? 'Contact Sales' : 'Get Started Free'}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '120px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0, 232, 123, 0.06), transparent)' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 2 }}>
          <Reveal><h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, color: '#F0F3FA', marginBottom: 20, letterSpacing: '-0.03em' }}>Ready to see every field<br/>interaction in real time?</h2></Reveal>
          <Reveal delay={1}><p style={{ fontSize: '1.1rem', color: '#8B9DC3', maxWidth: 540, margin: '0 auto 40px', lineHeight: 1.6 }}>Join field teams across South Africa who&apos;ve replaced guesswork with GPS-verified intelligence.</p></Reveal>
          <Reveal delay={2}>
            <Link to="/auth/login" className="fv-btn-primary" style={{ fontSize: '1.1rem', padding: '18px 48px', borderRadius: 14, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10, transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
              Start Your Free Trial <ArrowRight size={20} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '60px 0 40px', borderTop: '1px solid rgba(59, 79, 116, 0.1)', background: '#0A0F1C' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12" style={{ marginBottom: 48 }}>
            <div className="md:col-span-1">
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', marginBottom: 14 }}>
                <FieldVibeLogo />
                <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#F0F3FA' }}>
                  Field<span style={{ color: '#00E87B' }}>Vibe</span>
                </span>
              </Link>
              <p style={{ fontSize: '0.88rem', color: '#3B4F74', lineHeight: 1.6, maxWidth: 280 }}>Field operations intelligence for teams that move fast. Built in South Africa, for Africa.</p>
            </div>
            <div>
              <h4 style={{ fontSize: '0.78rem', fontWeight: 700, color: '#8B9DC3', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Product</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <a href="#features" style={{ fontSize: '0.88rem', color: '#3B4F74', textDecoration: 'none' }}>Features</a>
                <a href="#modules" style={{ fontSize: '0.88rem', color: '#3B4F74', textDecoration: 'none' }}>Modules</a>
                <a href="#pricing" style={{ fontSize: '0.88rem', color: '#3B4F74', textDecoration: 'none' }}>Pricing</a>
                <a href="#" style={{ fontSize: '0.88rem', color: '#3B4F74', textDecoration: 'none' }}>Mobile App</a>
                <a href="#" style={{ fontSize: '0.88rem', color: '#3B4F74', textDecoration: 'none' }}>API Docs</a>
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: '0.78rem', fontWeight: 700, color: '#8B9DC3', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Company</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <a href="https://www.gonxt.tech" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.88rem', color: '#3B4F74', textDecoration: 'none' }}>About GONXT</a>
                <a href="#" style={{ fontSize: '0.88rem', color: '#3B4F74', textDecoration: 'none' }}>Careers</a>
                <a href="#" style={{ fontSize: '0.88rem', color: '#3B4F74', textDecoration: 'none' }}>Blog</a>
                <a href="#" style={{ fontSize: '0.88rem', color: '#3B4F74', textDecoration: 'none' }}>Contact</a>
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: '0.78rem', fontWeight: 700, color: '#8B9DC3', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Support</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <a href="#" style={{ fontSize: '0.88rem', color: '#3B4F74', textDecoration: 'none' }}>Help Center</a>
                <a href="#" style={{ fontSize: '0.88rem', color: '#3B4F74', textDecoration: 'none' }}>Documentation</a>
                <a href="#" style={{ fontSize: '0.88rem', color: '#3B4F74', textDecoration: 'none' }}>Status Page</a>
                <a href="#" style={{ fontSize: '0.88rem', color: '#3B4F74', textDecoration: 'none' }}>Security</a>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 32, borderTop: '1px solid rgba(59, 79, 116, 0.08)', flexWrap: 'wrap', gap: 16 }}>
            <p style={{ fontSize: '0.8rem', color: '#3B4F74' }}>&copy; 2026 GONXT Technology (Pty) Ltd. A Vanta X Holdings company.</p>
            <div style={{ display: 'flex', gap: 24 }}>
              <a href="#" style={{ fontSize: '0.8rem', color: '#3B4F74', textDecoration: 'none' }}>Privacy Policy</a>
              <a href="#" style={{ fontSize: '0.8rem', color: '#3B4F74', textDecoration: 'none' }}>Terms of Service</a>
              <a href="#" style={{ fontSize: '0.8rem', color: '#3B4F74', textDecoration: 'none' }}>Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
