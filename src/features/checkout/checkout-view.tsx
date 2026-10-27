'use client';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { SampleId } from '@/features/reading/contracts';
import { purchaseSample, useDemoSession } from '@/features/demo/session-store';
import ui from '@/components/ui.module.css';
import s from './checkout.module.css';

export function CheckoutView({id}:{id:SampleId}) {
 const router=useRouter();
 const session=useDemoSession();
 const [confirmed,setConfirmed]=useState(false);
 const [state,setState]=useState<'idle'|'pending'|'cancelled'|'failed'>('idle');
 const [simulateFailure,setSimulateFailure]=useState(false);
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const locked=useRef(false);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
 if(!session.ready)return <div className={ui.page} role="status">체험 상태를 확인하고 있어요.</div>;
 if(!session.visited.includes(id))return <div className={ui.page}><h1>무료 기록부터 만나보세요</h1><Link className={ui.primary} href="/reading/new">무료 샘플 시작하기</Link></div>;
 if(session.purchased.includes(id))return <div className={ui.page}><h1>이미 보관된 기록이에요</h1><p>다시 모의 구매하지 않아도 읽을 수 있어요.</p><Link className={ui.primary} href={`/readings/${id}`}>보관된 상세 기록 읽기</Link></div>;
 function cancel(){if(timer.current)clearTimeout(timer.current);locked.current=false;setState('cancelled');}
 function purchase(){
  if(!confirmed||locked.current)return;
  locked.current=true;setState('pending');
  timer.current=setTimeout(()=>{
   if(simulateFailure){locked.current=false;setState('failed');return;}
   if(purchaseSample(id))router.replace(`/readings/${id}`);
   else {locked.current=false;setState('failed');}
  },700);
 }
 return <div className={ui.page}>
  <div className={ui.intro}><p className={ui.eyebrow}>OPEN THE NEXT CHAPTER</p><h1>다음 장도 펼쳐볼까요?</h1><p className={ui.description}>어떤 이야기가 담겨 있는지 먼저 확인해 주세요.</p></div>
  <div className={ui.notice}><strong>개발용 모의 구매</strong><br/>카드·계좌 정보는 받지 않아요. 실제 결제나 청구는 발생하지 않아요.</div>
  <section className={ui.paper}><span className={ui.badge}>종합 사주 · 샘플</span><h2>나를 알아가는 다섯 가지 이야기</h2><ul className={ui.list}><li>기질 · 나만의 속도</li><li>관계 · 마음을 확인하는 대화</li><li>일 · 하나씩 끝내는 힘</li><li>돈 관리 · 흐름을 살피는 습관</li><li>실천 · 오늘의 작은 행동</li></ul><hr className={ui.divider}/><div className={ui.row}><span>상품 가격안</span><span>990원</span></div><div className={ui.row}><strong>체험 청구액</strong><strong className={s.price}>0원</strong></div><p className={ui.muted}>이 탭을 유지하는 동안 보관함에서 다시 읽을 수 있어요. 탭을 닫거나 초기화하면 사라져요. 실제 계정 복원·구매 권한은 제공하지 않아요.</p></section>
  {!session.storageAvailable&&<p className={ui.error}>브라우저 저장소를 사용할 수 없어 새로고침 후 모의 구매 기록을 복원할 수 없어요.</p>}
  {state==='cancelled'?<div className={ui.card}><h2>모의 구매를 취소했어요</h2><p role="status">청구된 금액은 없어요. 무료 이야기는 계속 읽을 수 있어요.</p><button className={ui.secondary} onClick={()=>setState('idle')}>다시 체험하기</button><Link href={`/reading/preview/${id}`} className={ui.textLink}>무료 결과로 돌아가기</Link></div>:<>
   {state==='failed'&&<p role="alert" className={ui.error}>모의 구매 실패를 재현했어요. 청구된 금액은 없어요. 실패 시나리오를 해제하고 다시 시도할 수 있어요.</p>}
   <label className={s.confirm}><input type="checkbox" checked={confirmed} disabled={state==='pending'} onChange={e=>setConfirmed(e.target.checked)}/>실제 결제가 없는 모의 구매임을 확인했어요</label>
   <details className={s.dev}><summary>개발용 구매 시나리오</summary><label className={s.confirm}><input type="checkbox" checked={simulateFailure} disabled={state==='pending'} onChange={e=>setSimulateFailure(e.target.checked)}/>모의 구매 실패 재현</label></details>
   <div className={ui.actions}><button className={ui.primary} disabled={!confirmed||state==='pending'} onClick={purchase}>{state==='pending'?'모의 구매를 처리하고 있어요':'0원으로 모의 구매하기'}</button><button className={ui.secondary} onClick={cancel}>모의 구매 취소</button></div>
   {state==='pending'&&<p role="status" className={ui.muted}>실제 PG 연결 없이 체험 상태만 저장하고 있어요.</p>}
  </>}
 </div>;
}
