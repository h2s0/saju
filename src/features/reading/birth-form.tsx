'use client';
import { useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { validateBirthInput } from './birth-validation';
import { calculateSample } from './sample-engine';
import type { BirthInput, BirthErrors } from './contracts';
import { rememberSample } from '@/features/demo/session-store';
import ui from '@/components/ui.module.css';
import s from './birth-form.module.css';

export function BirthForm() {
 const router = useRouter();
 const dateRef = useRef<HTMLInputElement>(null);
 const timeRef = useRef<HTMLInputElement>(null);
 const [calendar, setCalendar] = useState<BirthInput['calendar']>('solar');
 const [leapMonth, setLeapMonth] = useState(false);
 const [unknown, setUnknown] = useState(false);
 const [errors, setErrors] = useState<BirthErrors>({});
 const [busy, setBusy] = useState(false);
 const [scenario, setScenario] = useState('normal');
 function submit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  if(busy) return;
  const form = event.currentTarget;
  const values = new FormData(form);
  const input: BirthInput = {calendar,leapMonth,birthDate:String(values.get('birthDate') ?? '').trim(),time:unknown ? {kind:'unknown'} : {kind:'known',value:String(values.get('birthTime') ?? '')}};
  const nextErrors = validateBirthInput(input);
  setErrors(nextErrors);
  if(Object.keys(nextErrors).length) { (nextErrors.birthDate ? dateRef : timeRef).current?.focus(); return; }
  const result = calculateSample(input);
  const id = result.timeKnown ? 'sample-known' : 'sample-unknown';
  setBusy(true);
  rememberSample(id);
  form.reset(); // Raw birth values never enter storage, URLs, or server requests.
  router.push(`/reading/processing/${id}?scenario=${scenario}`);
 }
 return <form onSubmit={submit} noValidate className={s.form}>
  <fieldset className={s.fieldset}><legend>달력 구분</legend><div className={s.segment}>
   {(['solar','lunar'] as const).map(value=><label key={value} className={calendar===value?s.selected:''}><input type="radio" name="calendar" value={value} checked={calendar===value} onChange={()=>{setCalendar(value);setLeapMonth(false);}}/>{value==='solar'?'양력':'음력'}</label>)}
  </div>{calendar==='lunar' && <><label className={s.check}><input type="checkbox" checked={leapMonth} onChange={e=>setLeapMonth(e.target.checked)}/>윤달에 태어났어요</label><p className={s.help}>음력은 형식과 날짜 범위만 확인해요. 실제 음력 변환·윤달 여부는 검증하지 않아요.</p></>}</fieldset>
  <div className={s.field}><label htmlFor="birthDate">생년월일 <span>필수</span></label><input ref={dateRef} id="birthDate" name="birthDate" type="text" inputMode="numeric" autoComplete="off" placeholder="예: 1997-03-12" maxLength={10} aria-invalid={!!errors.birthDate} aria-describedby={errors.birthDate?'date-help date-error':'date-help'}/><p id="date-help" className={s.help}>연도-월-일 순서로 입력해 주세요. (YYYY-MM-DD)</p>{errors.birthDate && <p id="date-error" role="alert" className={s.fieldError}>{errors.birthDate}</p>}</div>
  <div className={s.field}><label htmlFor="birthTime">태어난 시각</label><input ref={timeRef} id="birthTime" name="birthTime" type="time" disabled={unknown} aria-invalid={!!errors.time} aria-describedby={errors.time?'time-help time-error':'time-help'}/><label className={s.check}><input type="checkbox" checked={unknown} onChange={e=>{setUnknown(e.target.checked);setErrors(prev=>({...prev,time:undefined}));if(timeRef.current)timeRef.current.value='';}}/>태어난 시간을 몰라요</label><p id="time-help" className={s.help}>모르면 시주와 시간에 의존한 설명을 제외해요.</p>{errors.time&&<p id="time-error" role="alert" className={s.fieldError}>{errors.time}</p>}</div>
  <div className={ui.notice}>한국 출생 기준의 체험 화면이에요.<br/>입력한 생년월일과 시각은 저장·전송하지 않으며, 새로고침하면 사라져요.</div>
  <details className={s.dev}><summary>개발용 시나리오</summary><label htmlFor="scenario">처리 상태 재현</label><select id="scenario" value={scenario} onChange={e=>setScenario(e.target.value)}><option value="normal">일반 처리</option><option value="slow">느린 처리 (4초)</option><option value="failure">생성 실패 후 재시도</option></select></details>
  <button className={ui.primary} disabled={busy} type="submit">{busy?'샘플 기록을 준비하고 있어요':'무료 샘플 운명록 펼치기'} <span aria-hidden="true">→</span></button>
  <p className={s.help}>입력과 무관한 개발용 샘플이 표시돼요. 실제 사주 계산은 하지 않아요.</p>
 </form>;
}
