import Link from 'next/link';
import { SkyMotifs } from '@/components/sky-motifs';
import { notFound } from 'next/navigation';
import { getProduct, isProductId } from '@/features/products/catalog';
import { ProductStartLink } from '@/features/products/product-start-link';
import ui from '@/components/ui.module.css';
import s from '@/features/products/products.module.css';

export default async function ProductPage({ params }: { params: Promise<{ product: string }> }) {
  const { product: id } = await params;
  if (!isProductId(id)) notFound();
  const product = getProduct(id);
  return <div className={ui.page}>
    <div className={s.cover}><div className={s.coverArt}><SkyMotifs/><span className={s.icon} aria-hidden="true">{product.icon}</span></div><p className={ui.eyebrow}>{product.subtitle}</p><h1>{product.title}</h1><p className={ui.description}>{product.description}</p></div>
    <section className={ui.paper}><h2>이 기록에서 만날 이야기</h2><ol className={ui.list}>{product.sectionTitles.map(title => <li key={title}>{title}</li>)}</ol>{product.periodLabel && <p className={ui.notice}>{product.periodLabel}</p>}<div className={ui.row}><span>상품 가격안</span><strong>{product.price === null ? '가격 미정' : `${product.price}원`}</strong></div><div className={ui.row}><span>지금 체험 청구액</span><strong>0원</strong></div></section>
    <p className={ui.notice}>실제 사주 계산·AI 해석·결제가 없는 개발용 샘플이에요. 입력과 무관한 예시 결과와 5단계 흐름을 살펴볼 수 있어요.</p>
    {id === 'compatibility' && <p className={ui.description}>두 사람의 출생정보를 각각 입력해요. 상대방의 동의를 확인한 뒤 진행해 주세요. 입력 원문은 저장·전송하지 않아요.</p>}
    <ProductStartLink product={product}/>
    <p className={ui.muted}>무료 결과를 먼저 읽고 상세 샘플을 선택할 수 있어요. 모의 구매 기록은 이 탭의 보관함에만 남아요.</p>
    <Link href="/#records-title" className={ui.textLink}>다른 상품 살펴보기</Link>
  </div>;
}
