import { useId } from 'react';
import type { ReadingGauge } from './flow-levels';
import { FLOW_LEVELS } from './flow-levels';
import s from './flow-gauge.module.css';

function point(angle: number, radius: number) {
  const radians = angle * Math.PI / 180;
  return { x: 120 + radius * Math.cos(radians), y: 115 - radius * Math.sin(radians) };
}

export function FlowGauge({ gauge, title }: { gauge: ReadingGauge; title: string }) {
  const id = useId();
  const label = gauge.level === null ? '판단 보류' : FLOW_LEVELS[gauge.level - 1];
  const tip = gauge.level === null ? null : point(180 - (gauge.level - 0.5) * 36, 72);
  return <figure className={s.gauge} aria-label={`${title} 흐름 요약`}>
    <figcaption><span className={s.kicker}>운몽이가 건네는 흐름의 힌트</span><h2>{title}의 흐름</h2></figcaption>
    <svg viewBox="0 0 240 135" role="img" aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`}>
      <title id={`${id}-title`}>{`${label}${gauge.level === null ? '' : ` · 5단계 중 ${gauge.level}단계`}`}</title>
      <desc id={`${id}-description`}>점수나 성공 확률이 아닌 개발용 예시 방향이에요. {gauge.summary} {gauge.reason}</desc>
      {FLOW_LEVELS.map((_, index) => {
        const start = point(180 - index * 36 - 2, 94);
        const end = point(180 - (index + 1) * 36 + 2, 94);
        return <path key={index} d={`M${start.x},${start.y} A94,94 0 0,1 ${end.x},${end.y}`} fill="none" stroke="currentColor" strokeWidth="14" className={`${s.segment} ${gauge.level === index + 1 ? s.active : ''}`}/>;
      })}
      {tip && <><line x1="120" y1="115" x2={tip.x} y2={tip.y} className={s.needle}/><circle cx="120" cy="115" r="8" className={s.pivot}/><circle cx={tip.x} cy={tip.y} r="4" className={s.pivot}/></>}
    </svg>
    <p className={s.level}>{label}</p><p className={s.summary}>{gauge.summary}</p>
    <ol className={s.legend} aria-label="흐름의 다섯 단계">{FLOW_LEVELS.map((name, index) => <li key={name} aria-current={gauge.level === index + 1 ? 'step' : undefined}><span>{index + 1}</span>{name}</li>)}</ol>
    <p className={s.reason}>{gauge.reason}</p>
    <p className={s.sample}>개발용 예시 단계 · 실제 운세 산정 아님</p>
  </figure>;
}
