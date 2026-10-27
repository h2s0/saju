import Link from 'next/link';
import ui from '@/components/ui.module.css';
export default function NotFound(){return <div className={ui.page}><h1>이 기록은 찾을 수 없어요</h1><p>주소를 확인하거나 새로운 샘플 기록을 펼쳐주세요.</p><Link href="/" className={ui.primary}>홈으로 가기</Link></div>}
