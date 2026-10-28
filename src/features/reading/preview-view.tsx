'use client';

import Link from 'next/link';
import { purchasedSampleForProduct, useDemoSession } from '@/features/demo/session-store';
import { getProduct } from '@/features/products/catalog';
import { generateSampleReading } from './sample-engine';
import type { SampleId } from './contracts';
import { FlowGauge } from './flow-gauge';
import { SampleNotice } from './sample-notice';
import { SamplePillars } from './sample-pillars';
import ui from '@/components/ui.module.css';
import s from './reading.module.css';

export function PreviewView({ id }: { id: SampleId }) {
  const session = useDemoSession();
  const reading = generateSampleReading(id);
  const product = getProduct(reading.productId);
  const existing = purchasedSampleForProduct(session.purchased, product.id);
  if (!session.ready) return <div className={ui.page} role="status">샘플 기록을 확인하고 있어요.</div>;
  if (!session.visited.includes(id)) return <div className={ui.page}><h1>아직 펼치지 않은 기록이에요</h1><Link href={`/reading/new?product=${product.id}`} className={ui.primary}>무료 샘플 시작하기</Link></div>;
  return <div className={ui.page}>
    <div className={ui.intro}><p className={ui.eyebrow}>YOUR FIRST RECORD · {product.subtitle}</p><h1>{product.title}<br/>첫 번째 이야기</h1><p className={ui.description}>운몽이가 준비한 작은 기록을 먼저 만나보세요.</p></div>
    <SampleNotice reading={reading}/>
    <FlowGauge title={product.title} gauge={reading.gauge}/>
    <SamplePillars calculation={reading.calculation} title={reading.partnerCalculation ? '나의 샘플 명식' : '샘플 명식'}/>
    {reading.partnerCalculation && <SamplePillars calculation={reading.partnerCalculation} title="상대방의 샘플 명식"/>}
    <section className={ui.paper}><p className={ui.eyebrow}>운몽이의 첫 번째 메모</p><h2>{product.subtitle}에서 찾은 작은 힌트</h2>{reading.freeParagraphs.map((text, index) => <p className={s.prose} key={index}>{text}</p>)}<div className={s.advice}><span aria-hidden="true">✧</span><p>{reading.advice}</p></div></section>
    <section className={ui.card}><h2>다음 장에서는 이런 이야기를</h2><ol className={s.contents}>{reading.sections.map((section, index) => <li key={section.id}><span>0{index + 1}</span>{section.title.split(' · ')[0]}</li>)}</ol><p className={ui.muted}>{product.price === null ? '가격 미정' : `상품 가격안 ${product.price}원`} · 체험 청구액 0원<br/>모의 구매 후 이 탭의 보관함에서 다시 읽을 수 있어요.</p><Link className={ui.primary} href={existing ? `/readings/${existing}` : `/checkout/${id}`}>{existing ? '보관된 상세 기록 읽기' : '상세 샘플 체험하기'} <span aria-hidden="true">→</span></Link></section>
    <Link href={`/reading/new?product=${product.id}`} className={ui.textLink}>입력 화면으로 돌아가기</Link>
    <Link href="/#records-title" className={ui.textLink}>다른 운명록 살펴보기</Link>
  </div>;
}
