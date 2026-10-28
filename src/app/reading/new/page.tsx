import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BirthForm } from '@/features/reading/birth-form';
import { getProduct, isProductId } from '@/features/products/catalog';
import ui from '@/components/ui.module.css';

export default async function NewReading({ searchParams }: { searchParams: Promise<{ product?: string | string[] }> }) {
  const { product: value = 'basic' } = await searchParams;
  if (!isProductId(value)) notFound();
  const product = getProduct(value);
  return <div className={ui.page}>
    <div className={ui.intro}><p className={ui.eyebrow}>FIRST PAGE · {product.title}</p><h1>당신의 이야기를<br/>조금 들려주세요</h1><p className={ui.description}>{product.title}의 기록을 준비할게요.<br/>지금은 샘플로 먼저 만나보는 시간이에요.</p></div>
    {product.periodLabel && <p className={ui.notice}>{product.periodLabel}</p>}
    <BirthForm productId={product.id}/>
    <Link className={ui.textLink} href={`/products/${product.id}`}>상품 내용 다시 확인하기</Link>
  </div>;
}
