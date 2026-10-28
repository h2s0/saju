'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { validateBirthInput } from './birth-validation';
import { calculateSample } from './sample-engine';
import { makeSampleId, type BirthErrors, type ProductId } from './contracts';
import { BirthFields, readBirthFields } from './birth-fields';
import { purchasedSampleForProduct, rememberSample, useDemoSession } from '@/features/demo/session-store';
import ui from '@/components/ui.module.css';
import s from './birth-form.module.css';

export function BirthForm({ productId = 'basic' }: { productId?: ProductId }) {
  const router = useRouter();
  const session = useDemoSession();
  const pair = productId === 'compatibility';
  const [errors, setErrors] = useState<BirthErrors>({});
  const [partnerErrors, setPartnerErrors] = useState<BirthErrors>({});
  const [consentError, setConsentError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [scenario, setScenario] = useState('normal');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const existing = purchasedSampleForProduct(session.purchased, productId);
    if (existing) { router.push(`/readings/${existing}`); return; }
    const form = event.currentTarget;
    const values = new FormData(form);
    const input = readBirthFields(values, 'self');
    const partner = pair ? readBirthFields(values, 'partner') : undefined;
    const nextErrors = validateBirthInput(input);
    const nextPartnerErrors = partner ? validateBirthInput(partner) : {};
    const missingConsent = pair && !values.has('partner-consent');
    setErrors(nextErrors);
    setPartnerErrors(nextPartnerErrors);
    setConsentError(missingConsent);
    if (Object.keys(nextErrors).length || Object.keys(nextPartnerErrors).length || missingConsent) {
      const prefix = Object.keys(nextErrors).length ? 'self' : 'partner';
      const fieldErrors = prefix === 'self' ? nextErrors : nextPartnerErrors;
      const field = fieldErrors.birthDate ? 'date' : 'time';
      const target = missingConsent && !Object.keys(nextErrors).length && !Object.keys(nextPartnerErrors).length
        ? '#partner-consent' : `#${prefix}-${field}`;
      form.querySelector<HTMLInputElement>(target)?.focus();
      return;
    }
    const calculation = calculateSample(input);
    const partnerCalculation = partner ? calculateSample(partner) : undefined;
    const id = makeSampleId(productId, calculation.timeKnown, partnerCalculation?.timeKnown);
    setBusy(true);
    rememberSample(id);
    form.reset();
    // Only a whitelisted fixture ID and a development scenario leave this form.
    router.push(`/reading/processing/${id}?scenario=${scenario}`);
  }

  return <form onSubmit={submit} noValidate className={s.form}>
    <BirthFields prefix="self" legend="나의 출생정보" errors={errors}/>
    {pair && <>
      <BirthFields prefix="partner" legend="상대방의 출생정보" errors={partnerErrors}/>
      <div><label className={s.check}><input id="partner-consent" type="checkbox" name="partner-consent" aria-invalid={consentError} aria-describedby={consentError ? 'consent-error' : undefined} onChange={() => setConsentError(false)}/>상대방에게 정보 입력 동의를 받았어요</label>
        {consentError && <p id="consent-error" role="alert" className={s.fieldError}>상대방의 동의를 확인해 주세요.</p>}</div>
    </>}
    <div className={ui.notice}>한국 출생 기준의 체험 화면이에요.<br/>입력한 생년월일과 시각은 저장·전송하지 않으며, 새로고침하면 사라져요.</div>
    <details className={s.dev}><summary>개발용 시나리오</summary><label htmlFor="scenario">처리 상태 재현</label><select id="scenario" value={scenario} onChange={event => setScenario(event.target.value)}><option value="normal">일반 처리</option><option value="slow">느린 처리 (4초)</option><option value="failure">생성 실패 후 재시도</option></select></details>
    <button className={ui.primary} disabled={busy} type="submit">{busy ? '샘플 기록을 준비하고 있어요' : '무료 샘플 운명록 펼치기'} <span aria-hidden="true">→</span></button>
    <p className={s.help}>입력과 무관한 개발용 샘플이 표시돼요. 실제 사주 계산은 하지 않아요.</p>
  </form>;
}
