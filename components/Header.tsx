import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-blue-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          청약 대시보드
        </Link>
        <nav className="flex gap-6 text-sm font-medium">
          <Link href="/listings" className="hover:text-blue-200 transition-colors">
            분양정보
          </Link>
          <Link href="/competition" className="hover:text-blue-200 transition-colors">
            경쟁률
          </Link>
          <Link href="/subscriptions" className="hover:text-blue-200 transition-colors">
            당첨자 정보
          </Link>
        </nav>
      </div>
    </header>
  );
}
