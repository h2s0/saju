import { notFound } from 'next/navigation';
import { isSampleId } from '@/features/reading/contracts';
import { ProcessingView } from '@/features/reading/processing-view';
export default async function Processing({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{scenario?:string}>}) {
 const {id}=await params;const {scenario}=await searchParams;
 if(!isSampleId(id))notFound();
 return <ProcessingView id={id} scenario={scenario==='slow'||scenario==='failure'?scenario:'normal'}/>;
}
