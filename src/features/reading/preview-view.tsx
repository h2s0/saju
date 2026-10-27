'use client';
import Link from 'next/link';
import { useDemoSession } from '@/features/demo/session-store';
import { generateSampleReading } from './sample-engine';
import type { SampleId } from './contracts';
import ui from '@/components/ui.module.css';
import s from './reading.module.css';

export function PreviewView({id}:{id:SampleId}) {
 const session=useDemoSession();
 const reading=generateSampleReading(id);
 if(!session.ready)return <div className={ui.page} role="status">샘플 기록을 확인하고 있어요.</div>;
 if(!session.visited.includes(id))return <div className={ui.page}><h1>아직 펼치지 않은 기록이에요</h1><Link href="/reading/new" className={ui.primary}>무료 샘플 시작하기</Link></div>;
 return <div className={ui.page}>
  <div className={ui.intro}><p className={ui.eyebrow}>YOUR FIRST RECORD</p><h1>차분히 살피는 마음,<br/>작은 시작의 힘</h1><p className={ui.description}>운몽이가 준비한 첫 번째 이야기예요.</p></div>
  <div className={ui.notice}><strong>개발용 샘플 · 실제 사주 계산 아님</strong><br/>입력값과 무관한 예시예요. {id==='sample-unknown'?'시간 모름: 시주와 시간에 의존한 설명은 제외했어요.':'시각 입력 샘플: 입력한 시각으로 계산하지 않았어요.'}</div>
  <section className={ui.paper} aria-labelledby="pillars-title"><div className={ui.row}><h2 id="pillars-title">샘플 명식</h2><span className={ui.badge}>예시 데이터</span></div><div className={s.pillars}>{(['year','month','day','hour'] as const).map((key,index)=><div key={key}><span>{['연주','월주','일주','시주'][index]}</span><strong>{reading.calculation.pillars[key]?.stem??'—'}</strong><strong>{reading.calculation.pillars[key]?.branch??'—'}</strong></div>)}</div><p className={ui.muted}>실제 오행 분포나 운세를 나타내지 않아요.</p></section>
  <section className={ui.card}><p className={ui.eyebrow}>운몽이의 첫 번째 메모</p><h2>나를 알아가는 작은 힌트</h2>{reading.freeParagraphs.map((text,index)=><p className={s.prose} key={index}>{text}</p>)}<div className={s.advice}><span aria-hidden="true">✧</span><p>{reading.advice}</p></div></section>
  <section className={ui.card}><h2>다음 장에서는 이런 이야기를</h2><ol className={s.contents}>{reading.sections.map((section,index)=><li key={section.id}><span>0{index+1}</span>{section.title.split(' · ')[0]}</li>)}</ol><p className={ui.muted}>상품 가격안 990원 · 체험 청구액 0원<br/>모의 구매 후 이 탭의 보관함에서 다시 읽을 수 있어요.</p><Link className={ui.primary} href={session.purchased.includes(id)?`/readings/${id}`:`/checkout/${id}`}>{session.purchased.includes(id)?'보관된 상세 기록 읽기':'상세 샘플 체험하기'} <span aria-hidden="true">→</span></Link></section>
  <Link href="/reading/new" className={ui.textLink}>입력 화면으로 돌아가기</Link>
 </div>;
}
