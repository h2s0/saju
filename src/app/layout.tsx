import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import { pretendard, ssurroundAir } from '@/styles/fonts';
import { AppShell } from '@/components/app-shell';
export const metadata: Metadata = { title: '천명록 · 천계 운명관리소', description: '운몽이와 함께 펼치는 나의 이야기. 실제 사주 계산과 결제가 없는 로컬 시제품입니다.', robots: { index: false, follow: false } };
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko" className={`${pretendard.variable} ${ssurroundAir.variable}`}><body><AppShell>{children}</AppShell></body></html>;
}
