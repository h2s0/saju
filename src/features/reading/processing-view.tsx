'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { SampleId } from './contracts';
import { useDemoSession } from '@/features/demo/session-store';
import ui from '@/components/ui.module.css';

export function ProcessingView({id,scenario}:{id:SampleId;scenario:string}) {
 const router=useRouter();
 const session=useDemoSession();
 const [failed,setFailed]=useState(false);
 const [attempt,setAttempt]=useState(0);
 const visited=session.visited.includes(id);
 useEffect(()=>{
  if(!session.ready || !visited) return;
  const timeout=setTimeout(()=>{
   if(scenario==='failure' && attempt===0)setFailed(true);
   else router.replace(`/reading/preview/${id}`);
  },scenario==='slow'?4000:900);
  return ()=>clearTimeout(timeout);
 },[session.ready,visited,id,scenario,attempt,router]);
 if(!session.ready) return <div className={ui.page} role="status">체험 기록을 확인하고 있어요.</div>;
 if(!visited) return <div className={ui.page}><h1>먼저 첫 장을 열어주세요</h1><p>초기화했거나 다른 탭에서 열었던 샘플이에요.</p><Link href="/reading/new" className={ui.primary}>입력 화면으로</Link></div>;
 return <div className={`${ui.page} ${ui.center}`}>
  <p className={ui.eyebrow}>HEAVEN RECORDS OFFICE</p><Image className={ui.character} src="/images/woonmong-cutout.png" alt="기록을 준비하는 운몽이" width={1293} height={1217} sizes="170px"/>
  {failed?<><h1>잠깐, 기록이 엉켰어요</h1><p role="alert">개발용 생성 실패를 재현했어요.<br/>다시 시도하면 샘플을 열 수 있어요.</p><button className={ui.primary} onClick={()=>{setFailed(false);setAttempt(n=>n+1);}}>다시 시도하기</button></>:<><h1>첫 장을 준비하고 있어요</h1><p role="status" aria-live="polite">운몽이가 샘플 기록을 펼치고 있어요.<br/>잠시만 기다려 주세요.</p></>}
  {!session.storageAvailable&&<p className={ui.notice}>브라우저 저장소를 사용할 수 없어 현재 화면을 떠나거나 새로고침하면 기록이 사라질 수 있어요.</p>}
  <p className={ui.muted}>실제 명식 계산이나 AI 생성은 진행하지 않아요.</p><Link href="/reading/new" className={ui.textLink}>입력 화면으로 돌아가기</Link>
 </div>;
}
