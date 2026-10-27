'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import s from './app-shell.module.css';
export function AppShell({ children }: { children: React.ReactNode }) {
 const path = usePathname();
 const tabs = [['/', '⌂', '홈'], ['/today', '☀', '오늘의 운세'], ['/library', '▤', '보관함']];
 const showTabs = tabs.some(([href]) => href === path);
 return <div className={s.shell}>
   <a className={s.skip} href="#main">본문으로 건너뛰기</a>
   <div className={s.demo}>로컬 시제품 · 실제 사주 계산 / 결제 없음</div>
   <header className={s.header}>
    <Link href="/" className={s.brand} aria-label="천명록 홈"><span aria-hidden="true" className={s.cloud}>☁</span><span>천명록<small>천계 운명관리소</small></span></Link>
    <Link href={showTabs ? '/library' : '/'} className={s.headerLink}>{showTabs ? '내 기록' : '홈으로' } <span aria-hidden="true">↗</span></Link>
   </header>
   <main id="main" className={s.main} tabIndex={-1}>{children}</main>
   <footer className={s.footer}>당신의 가능성을, 다정하게 펼쳐보는 시간.<br/><Link href="/support">시제품 이용 안내</Link></footer>
   {showTabs && <nav className={s.tabs} aria-label="주 메뉴">{tabs.map(([href,icon,label])=><Link key={href} href={href} aria-current={path===href?'page':undefined}><span aria-hidden="true">{icon}</span>{label}</Link>)}</nav>}
 </div>;
}
