import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prepay vs Invest',
  description: 'Should you prepay your home loan early or invest the surplus into equity? Model tax-adjusted compounding vs guaranteed interest saved.',
};

export default function PrepayVsInvestLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
