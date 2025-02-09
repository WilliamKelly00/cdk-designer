'use client';

import dynamic from 'next/dynamic';

const WhiteBoard = dynamic(() => import('@/components/pages/design/WhiteBoardComponent'), { ssr: false });

export default function Page() {
  return <WhiteBoard />;
}