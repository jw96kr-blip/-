'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/',               label: '대시보드' },
  { href: '/subscriptions',  label: '청약 신청·당첨' },
  { href: '/competition',    label: '경쟁률·특별공급' },
  { href: '/listings',       label: '분양정보' },
];

function today() {
  const d = new Date();
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
}

export default function Header() {
  const path = usePathname();
  return (
    <header className="hdr">
      <div className="wrap hdr-row">
        <Link href="/" className="brand">
          <div className="brand-mark">청</div>
          <div>
            <div className="brand-name">청약 라운지</div>
            <div className="brand-sub">SUBSCRIPTION DASHBOARD</div>
          </div>
        </Link>
        <nav className="nav">
          {NAV.map(n => (
            <Link key={n.href} href={n.href} className={`nav-link${path === n.href ? ' on' : ''}`}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hdr-right">
          <span className="hdr-date"><b>{today()}</b> 기준</span>
          <button className="icon-btn" title="검색">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>
          </button>
          <button className="icon-btn" title="알림">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>
          </button>
        </div>
      </div>
    </header>
  );
}
