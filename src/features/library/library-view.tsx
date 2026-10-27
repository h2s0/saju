'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { resetDemo, useDemoSession } from '@/features/demo/session-store';
import ui from '@/components/ui.module.css';

export function LibraryView(){
 const session=useDemoSession();
 const [confirmReset,setConfirmReset]=useState(false);
 const [message,setMessage]=useState('');
 const resetRef=useRef<HTMLButtonElement>(null);
 if(!session.ready)return <div className={ui.page} role="status">보관함을 확인하고 있어요.</div>;
 return <div className={ui.page}>
  <div className={ui.intro}><p className={ui.eyebrow}>MY LITTLE ARCHIVE</p><h1>내 운명록 보관함</h1><p className={ui.description}>마음에 남은 이야기를 다시 펼쳐보세요.</p></div>
  <div className={ui.notice}>이 탭에서 모의 구매한 샘플만 보관해요. 탭을 닫거나 초기화하면 지워져요. 실제 구매 내역은 아니에요.</div>
  {!session.storageAvailable&&<p className={ui.error}>브라우저 저장소를 사용할 수 없어 새로고침하면 기록이 사라져요.</p>}
  {session.purchased.length===0?<section className={`${ui.card} ${ui.center}`}><Image className={ui.character} src="/images/woonmong-cutout.png" alt="첫 기록을 기다리는 운몽이" width={1293} height={1217} sizes="170px"/><h2>아직 보관된 기록이 없어요</h2><p className={ui.description}>운몽이와 첫 번째 이야기를<br/>함께 펼쳐볼까요?</p><Link href="/reading/new" className={ui.primary}>무료 샘플 만나보기</Link></section>:session.purchased.map(id=><section key={id} className={ui.paper}><div className={ui.row}><span className={ui.badge}>모의 구매 완료</span><span className={ui.muted}>{id==='sample-unknown'?'시간 모름':'시각 입력'}</span></div><h2>내 운명록 · 종합 사주</h2><p className={ui.description}>기질 · 관계 · 일 · 돈 관리 · 실천<br/>입력과 무관한 개발용 샘플</p><Link className={ui.secondary} href={`/readings/${id}`}>기록 읽기 <span aria-hidden="true">→</span></Link></section>)}
  <div className={ui.stack}><button ref={resetRef} className={ui.secondary} aria-expanded={confirmReset} onClick={()=>{setConfirmReset(true);setMessage('');}}>체험 기록 초기화</button>
  {confirmReset&&<section className={ui.card} aria-label="체험 기록 초기화 확인"><h2>체험 기록을 지울까요?</h2><p className={ui.description}>이 탭의 샘플 열람과 모의 구매 상태를 지워요. 다른 사이트의 저장 정보는 지우지 않아요.</p><button className={ui.primary} onClick={()=>{resetDemo();setConfirmReset(false);setMessage('체험 기록을 초기화했어요.');resetRef.current?.focus();}}>초기화하기</button><button className={ui.secondary} onClick={()=>{setConfirmReset(false);resetRef.current?.focus();}}>유지하기</button></section>}
  <p role="status" className={ui.muted}>{message}</p></div>
 </div>;
}
