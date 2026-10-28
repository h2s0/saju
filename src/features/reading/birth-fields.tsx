'use client';

import { useState } from 'react';
import type { BirthErrors, BirthInput } from './contracts';
import s from './birth-form.module.css';

type Props = { prefix: string; legend: string; errors: BirthErrors };

export function readBirthFields(values: FormData, prefix: string): BirthInput {
  return {
    calendar: values.get(`${prefix}-calendar`) === 'lunar' ? 'lunar' : 'solar',
    leapMonth: values.has(`${prefix}-leap`),
    birthDate: String(values.get(`${prefix}-date`) ?? '').trim(),
    time: values.has(`${prefix}-unknown`)
      ? { kind: 'unknown' }
      : { kind: 'known', value: String(values.get(`${prefix}-time`) ?? '') },
  };
}

export function BirthFields({ prefix, legend, errors }: Props) {
  const [calendar, setCalendar] = useState<BirthInput['calendar']>('solar');
  const [unknown, setUnknown] = useState(false);
  const [time, setTime] = useState('');
  const dateId = `${prefix}-date`;
  const timeId = `${prefix}-time`;
  return <fieldset className={`${s.fieldset} ${s.person}`}>
    <legend className={s.personTitle}>{legend}</legend>
    <fieldset className={s.fieldset}><legend>달력 구분</legend>
      <div className={s.segment}>{(['solar', 'lunar'] as const).map(value => <label key={value} className={calendar === value ? s.selected : ''}>
        <input type="radio" name={`${prefix}-calendar`} value={value} checked={calendar === value} onChange={() => setCalendar(value)}/>{value === 'solar' ? '양력' : '음력'}
      </label>)}</div>
      {calendar === 'lunar' && <><label className={s.check}><input name={`${prefix}-leap`} type="checkbox"/>윤달에 태어났어요</label><p className={s.help}>음력은 형식과 날짜 범위만 확인해요. 실제 음력 변환·윤달 여부는 검증하지 않아요.</p></>}
    </fieldset>
    <div className={s.field}><label htmlFor={dateId}>생년월일 <span>필수</span></label>
      <input id={dateId} name={dateId} type="text" inputMode="numeric" autoComplete="off" placeholder="예: 1997-03-12" maxLength={10} aria-invalid={!!errors.birthDate} aria-describedby={`${dateId}-help${errors.birthDate ? ` ${dateId}-error` : ''}`}/>
      <p id={`${dateId}-help`} className={s.help}>연도-월-일 순서로 입력해 주세요. (YYYY-MM-DD)</p>
      {errors.birthDate && <p id={`${dateId}-error`} role="alert" className={s.fieldError}>{errors.birthDate}</p>}
    </div>
    <div className={s.field}><label htmlFor={timeId}>태어난 시각</label>
      <input id={timeId} name={timeId} type="time" disabled={unknown} value={time} onChange={event => setTime(event.target.value)} aria-invalid={!unknown && !!errors.time} aria-describedby={`${timeId}-help${!unknown && errors.time ? ` ${timeId}-error` : ''}`}/>
      <label className={s.check}><input type="checkbox" name={`${prefix}-unknown`} checked={unknown} onChange={event => { setUnknown(event.target.checked); setTime(''); }}/>태어난 시간을 몰라요</label>
      <p id={`${timeId}-help`} className={s.help}>모르면 시주와 시간에 의존한 설명을 제외해요.</p>
      {!unknown && errors.time && <p id={`${timeId}-error`} role="alert" className={s.fieldError}>{errors.time}</p>}
    </div>
  </fieldset>;
}
