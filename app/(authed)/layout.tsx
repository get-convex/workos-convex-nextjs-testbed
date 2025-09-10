import { withAuth } from '@workos-inc/authkit-nextjs';
import { redirect } from 'next/navigation';
import { ConvexClientProvider } from '@/components/ConvexClientProvider';

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  try {
    await withAuth();
  } catch {
    redirect('/');
  }

  return <ConvexClientProvider expectAuth>{children}</ConvexClientProvider>;
}

