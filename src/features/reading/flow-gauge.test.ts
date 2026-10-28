import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { FlowGauge } from './flow-gauge';
import { FLOW_LEVELS, type FlowLevel } from './flow-levels';

describe('categorical gauge accessibility', () => {
  it.each([1, 2, 3, 4, 5] as FlowLevel[])('identifies level %s with text and one current step', level => {
    const markup = renderToStaticMarkup(createElement(FlowGauge, {
      title: '애정운', gauge: { level, summary: '대화를 준비해 보세요.', reason: '개발용 고정 예시예요.' },
    }));
    expect(markup).toContain(`5단계 중 ${level}단계`);
    expect(markup).toContain(FLOW_LEVELS[level - 1]);
    expect(markup.match(/aria-current="step"/g)).toHaveLength(1);
    expect(markup).toContain('aria-describedby=');
    expect(markup).not.toMatch(/\d+\s*(점|%)/);
  });

  it('shows abstention without a needle or a selected step', () => {
    const markup = renderToStaticMarkup(createElement(FlowGauge, {
      title: '대운', gauge: { level: null, summary: '입력이 부족해요.', reason: '운 구간이 필요해요.' },
    }));
    expect(markup).toContain('판단 보류');
    expect(markup).not.toContain('<line');
    expect(markup).not.toContain('aria-current="step"');
  });
});
