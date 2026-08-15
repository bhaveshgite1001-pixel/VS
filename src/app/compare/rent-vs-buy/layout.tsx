import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rent vs Buy',
  description: 'The ultimate real estate vs equity simulator. Calculate opportunity costs, maintenance, and long-term net worth.',
};

export default function RentVsBuyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
