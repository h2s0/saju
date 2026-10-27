import { notFound } from 'next/navigation';
import { isSampleId } from '@/features/reading/contracts';
import { CheckoutView } from '@/features/checkout/checkout-view';
export default async function Checkout({params}:{params:Promise<{id:string}>}) {const {id}=await params;if(!isSampleId(id))notFound();return <CheckoutView id={id}/>;}
