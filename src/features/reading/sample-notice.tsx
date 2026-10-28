import type { ReadingResult } from './contracts';
import ui from '@/components/ui.module.css';

export function SampleNotice({ reading }: { reading: ReadingResult }) {
  return <div className={ui.notice}>
    <strong>개발용 샘플 · 실제 사주 계산 아님</strong><br/>
    입력값과 무관한 예시예요. {reading.calculation.timeKnown
      ? '시각 입력 샘플: 입력한 시각으로 계산하지 않았어요.'
      : '시간 모름: 시주와 시간에 의존한 설명은 제외했어요.'}
    {reading.partnerCalculation && <p>상대방: {reading.partnerCalculation.timeKnown ? '시각 입력 샘플이며 실제 시각은 반영하지 않았어요.' : '시간 모름으로 시주와 시간에 의존한 설명을 제외했어요.'}</p>}
    {reading.periodLabel && <p><strong>{reading.periodLabel}</strong></p>}
    {reading.limitations.length > 0 && <ul className={ui.list}>{reading.limitations.map(limit => <li key={limit}>{limit}</li>)}</ul>}
  </div>;
}
