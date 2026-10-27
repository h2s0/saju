import Image from 'next/image';
import Link from 'next/link';
import s from './home.module.css';
import ui from '@/components/ui.module.css';
export default function Home() {
 return <>
  <section className={s.hero}>
   <div className={s.label}><span/> 천계 운명관리소에 오신 걸 환영해요</div>
   <h1>하늘 어딘가에 기록된,<br/><em>나만의 이야기</em></h1>
   <p className={s.lead}>조금 서툴지만, 정성껏 찾아볼게요.<br/>견습 신선 운몽이와 첫 장을 펼쳐보세요.</p>
   <div className={s.art}>
    <span className={s.orbit} aria-hidden="true"/><span className={s.starOne} aria-hidden="true">✧</span><span className={s.starTwo} aria-hidden="true">✦</span>
    <span className={s.artNote}>당신의 이야기를<br/>찾고 있었어요!</span>
    <Image src="/images/woonmong-cutout.png" alt="붓을 들고 반갑게 웃는 견습 신선 운몽이" width={1293} height={1217} priority sizes="280px" className={s.character}/>
    <span className={s.cloudOne} aria-hidden="true"/><span className={s.cloudTwo} aria-hidden="true"/>
   </div>
   <Link href="/reading/new" className={ui.primary}>내 운명록 찾아보기 <span aria-hidden="true">→</span></Link>
   <p className={s.free}>무료 미리보기부터 · 실제 결제 없이 체험해요</p>
  </section>
  <section className={s.section} aria-labelledby="records-title">
   <div className={s.sectionHeading}><div><p className={ui.eyebrow}>YOUR DESTINY RECORD</p><h2 id="records-title">천계에서 도착한 기록</h2></div><span aria-hidden="true">✧</span></div>
   <Link href="/reading/new" className={s.product}><span className={s.book} aria-hidden="true">命</span><div><span className={s.tag}>나를 알아가는 다섯 가지 이야기</span><h3>내 운명록 · 종합 사주</h3><p>기질부터 관계, 일과 생활의 작은 힌트까지</p><strong>990원 <small>상품 가격안 · 체험 청구 0원</small></strong></div><span aria-hidden="true" className={s.arrow}>↗</span></Link>
   <Link href="/today" className={s.today}><span aria-hidden="true">☀</span><div><h3>오늘은 어떤 마음으로?</h3><p>오늘의 작은 응원 한 줄</p></div><span className={ui.badge}>무료</span></Link>
  </section>
  <section className={s.steps}><p className={ui.eyebrow}>HOW IT WORKS</p><h2>운명록은 이렇게 펼쳐져요</h2><ol><li><b>01</b><div><strong>나의 정보 알려주기</strong><p>태어난 시간을 몰라도 괜찮아요.</p></div></li><li><b>02</b><div><strong>무료 이야기 먼저 읽기</strong><p>부담 없이 첫 장을 만나보세요.</p></div></li><li><b>03</b><div><strong>궁금하다면 더 펼쳐보기</strong><p>체험한 기록은 보관함에서 다시 읽어요.</p></div></li></ol></section>
  <p className={s.disclaimer}>개발용 샘플로 구성된 로컬 시제품이에요.<br/>입력에 따른 실제 명식 계산이나 AI 해석을 제공하지 않아요.</p>
 </>;
}
