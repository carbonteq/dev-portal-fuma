import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { baseOptions } from '@/app/layout.config';
import { source } from '@/lib/source';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout 
      tree={source.pageTree} 
      {...baseOptions}
      containerProps={{
        className: 'md:[--fd-sidebar-width:250px] lg:[--fd-sidebar-width:250px] xl:[--fd-sidebar-width:250px]'
      }}
    >
      {children}
    </DocsLayout>
  );
}
