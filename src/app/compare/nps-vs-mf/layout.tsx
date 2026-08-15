import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NPS vs Mutual Funds',
  description: 'Tax arbitrage dilemma: Does 30% upfront tax savings beat uncapped pure equity mutual fund compounding?',
};

export default function NpsVsMfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
