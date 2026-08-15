import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EPF vs Index Funds',
  description: 'Compare safe 8.1% tax-free EPF/VPF compounding against liquid equity index funds.',
};

export default function EpfVsIndexLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
