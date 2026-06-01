import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';

const notoSansKR = Noto_Sans_KR({ subsets: ['latin'], weight: ['400','500','700'] });

export const metadata: Metadata = {
  title: '청약 라운지',
  description: '한국부동산원 청약홈 분양정보, 경쟁률, 당첨자 현황',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={`${notoSansKR.className} app`}>
        {children}
      </body>
    </html>
  );
}
