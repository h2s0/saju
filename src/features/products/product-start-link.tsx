'use client';

import Link from 'next/link';
import { purchasedSampleForProduct, useDemoSession } from '../demo/session-store';
import type { ProductDefinition } from './catalog';
import ui from '@/components/ui.module.css';

export function ProductStartLink({ product }: { product: ProductDefinition }) {
  const session = useDemoSession();
  const existing = purchasedSampleForProduct(session.purchased, product.id);
  return <Link className={ui.primary} href={existing ? `/readings/${existing}` : `/reading/new?product=${product.id}`}>
    {existing ? '보관된 상세 기록 읽기' : `${product.title} 무료 샘플 시작하기`} <span aria-hidden="true">→</span>
  </Link>;
}
