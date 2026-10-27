import { notFound } from 'next/navigation';
import { isSampleId } from '@/features/reading/contracts';
import { DetailView } from '@/features/reading/detail-view';
export default async function Reading({params}:{params:Promise<{id:string}>}) {const {id}=await params;if(!isSampleId(id))notFound();return <DetailView id={id}/>;}
