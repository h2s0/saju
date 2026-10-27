import { BirthForm } from '@/features/reading/birth-form';
import ui from '@/components/ui.module.css';
export default function NewReading(){return <div className={ui.page}><div className={ui.intro}><p className={ui.eyebrow}>FIRST PAGE · 첫 번째 장</p><h1>당신의 이야기를<br/>조금 들려주세요</h1><p className={ui.description}>운몽이가 기록을 찾을 준비를 할게요.<br/>지금은 샘플로 먼저 만나보는 시간이에요.</p></div><BirthForm/></div>}
