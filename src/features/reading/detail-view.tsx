'use client';

import Link from 'next/link';
import { useDemoSession } from '@/features/demo/session-store';
import { getProduct } from '@/features/products/catalog';
import { generateSampleReading } from './sample-engine';
import { getSampleIdentity, type SampleId } from './contracts';
import { FlowGauge } from './flow-gauge';
import { SampleNotice } from './sample-notice';
import ui from '@/components/ui.module.css';
import s from './reading.module.css';

export function DetailView({ id }: { id: SampleId }) {
  const session = useDemoSession();
  const product = getProduct(getSampleIdentity(id).productId);
  if (!session.ready) return <div className={ui.page} role="status">보관된 기록을 확인하고 있어요.</div>;
  if (!session.purchased.includes(id)) return <div className={ui.page}><h1>아직 모의 구매하지 않은 기록이에요</h1><p>무료 결과에서 포함 내용을 확인하고 체험할 수 있어요.</p><Link className={ui.primary} href={session.visited.includes(id) ? `/reading/preview/${id}` : `/reading/new?product=${product.id}`}>무료 샘플로 돌아가기</Link></div>;
  const reading = generateSampleReading(id);
  return <article className={ui.page}>
    <div className={ui.intro}><p className={ui.eyebrow}>YOUR DESTINY RECORD · {product.subtitle}</p><h1>{product.title}<br/>조금 더 깊은 이야기</h1><p className={ui.description}>견습 신선 운몽이가 건네는 작은 메모</p><span className={ui.badge}>모의 구매 완료</span></div>
    <SampleNotice reading={reading}/>
    <FlowGauge title={product.title} gauge={reading.gauge}/>
    <nav className={ui.paper} aria-label="상세 결과 목차"><h2>이 기록의 차례</h2><ol className={s.contents}>{reading.sections.map((section, index) => <li key={section.id}><span>0{index + 1}</span><a href={`#${section.id}`}>{section.title.split(' · ')[0]}</a></li>)}</ol></nav>
    {reading.sections.map((section, index) => <section key={section.id} id={section.id} className={`${ui.paper} ${s.section}`}><p className={ui.eyebrow}>CHAPTER 0{index + 1}</p><h2 className={s.sectionTitle}>{section.title}</h2>{section.paragraphs.map((text, i) => <p key={i} className={s.prose}>{text}</p>)}<details className={s.evidence}><summary>이 설명의 샘플 근거</summary>{section.evidenceIds.map(evidenceId => <p key={evidenceId}>{reading.evidence.find(evidence => evidence.id === evidenceId)?.allowedInterpretation}</p>)}<p>개발용 문구 예시이며 검증된 명리 해석 규칙이 아니에요.</p></details></section>)}
    <div className={ui.paper}><p className={s.prose}>모든 조언이 정답일 필요는 없어요.<br/>지금 마음에 닿는 한 가지만 가져가세요.</p><p className={ui.muted}>— 천계 운명관리소, 운몽이 드림</p></div>
    <Link className={ui.primary} href="/library">보관함에서 다시 만나기</Link><Link className={ui.textLink} href={`/reading/preview/${id}`}>무료 결과 다시 읽기</Link><Link className={ui.textLink} href="/#records-title">다른 운명록 살펴보기</Link>
  </article>;
}
