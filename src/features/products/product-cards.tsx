import Link from 'next/link';
import { PRODUCTS } from './catalog';
import s from './products.module.css';

export function ProductCards() {
  return <div className={s.grid}>
    {PRODUCTS.map(product => <Link
      key={product.id}
      className={`${s.tile} ${product.id === 'basic' ? s.featured : ''}`}
      href={`/products/${product.id}`}
      aria-label={`${product.title} 상품 보기`}
    >
      <span className={s.sparkle} aria-hidden="true"/>
      <span className={s.icon} aria-hidden="true">{product.icon}</span>
      <div><span className={s.subtitle}>{product.subtitle}</span><h3>{product.title}</h3><p>{product.description}</p></div>
      <span className={s.price}>{product.price === null ? '가격 미정' : `${product.price.toLocaleString('ko-KR')}원 가격안`}<small>샘플 체험 0원</small></span>
      <span className={s.arrow} aria-hidden="true">↗</span>
    </Link>)}
  </div>;
}
