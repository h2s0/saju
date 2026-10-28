import type { CalculationResult } from './contracts';
import ui from '@/components/ui.module.css';
import s from './reading.module.css';

export function SamplePillars({ calculation, title = '샘플 명식' }: { calculation: CalculationResult; title?: string }) {
  return <section className={ui.paper} aria-label={title}>
    <div className={ui.row}><h2>{title}</h2><span className={ui.badge}>예시 데이터</span></div>
    <div className={s.pillars}>{(['year', 'month', 'day', 'hour'] as const).map((key, index) => <div key={key}><span>{['연주', '월주', '일주', '시주'][index]}</span><strong>{calculation.pillars[key]?.stem ?? '—'}</strong><strong>{calculation.pillars[key]?.branch ?? '—'}</strong></div>)}</div>
    <p className={ui.muted}>실제 오행 분포나 운세를 나타내지 않아요.</p>
  </section>;
}
