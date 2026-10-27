import { notFound } from 'next/navigation';
import { isSampleId } from '@/features/reading/contracts';
import { PreviewView } from '@/features/reading/preview-view';
export default async function Preview({params}:{params:Promise<{id:string}>}) {
 const {id}=await params;if(!isSampleId(id))notFound();return <PreviewView id={id}/>;
}
