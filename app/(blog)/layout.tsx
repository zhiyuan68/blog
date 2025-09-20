import type { ReactNode } from 'react';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout {...baseOptions()} className="flex-1">
      {children}
    </HomeLayout>
  );
}
