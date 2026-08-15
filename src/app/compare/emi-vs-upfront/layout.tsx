import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'No-Cost EMI vs Upfront',
  description: 'Uncover hidden GST and processing fees on No-Cost EMI options to see if taking upfront discount wins.',
};

export default function EmiVsUpfrontLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
