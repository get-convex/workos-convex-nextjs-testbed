'use client';

import { Authenticated, Unauthenticated, useConvexAuth, useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import Link from 'next/link';
import { useAuth } from '@workos-inc/authkit-nextjs/components';
import type { User } from '@workos-inc/node';

export default function Home() {
  const { user, signOut } = useAuth();
  const { isAuthenticated, isLoading } = useConvexAuth();
  console.log('convex auth state:', isAuthenticated, isLoading);

  return (
    <>
      <header className="sticky top-0 z-10 bg-background p-4 border-b-2 border-slate-200 dark:border-slate-800 flex flex-row justify-between items-center">
        Convex + Next.js + WorkOS
        {user && <UserMenu user={user} onSignOut={signOut} />}
      </header>
      <main className="p-8 flex flex-col gap-8">
        <h1 className="text-4xl font-bold text-center">Convex + Next.js + WorkOS</h1>
        <Authenticated>
          <Content />
        </Authenticated>
        <Unauthenticated>
          <SignInForm />
        </Unauthenticated>
      </main>
    </>
  );
}

function SignInForm() {
  return (
    <div className="flex flex-col gap-8 w-96 mx-auto">
      <p>Log in to see the numbers</p>
      <a href="/sign-in">
        <button className="bg-foreground text-background px-4 py-2 rounded-md">Sign in</button>
      </a>
      <a href="/sign-up">
        <button className="bg-foreground text-background px-4 py-2 rounded-md">Sign up</button>
      </a>
    </div>
  );
}

function Content() {
  const { viewer, numbers } =
    useQuery(api.myFunctions.listNumbers, {
      count: 10,
    }) ?? {};
  const addNumber = useMutation(api.myFunctions.addNumber);

  if (viewer === undefined || numbers === undefined) {
    return <div className="mx-auto"></div>;
  }

  return (
    <div className="flex flex-col gap-8 max-w-lg mx-auto">
      <p>Welcome {viewer ?? 'Anonymous'}!</p>
      <p>
        Click the button below and open this page in another window - this data is persisted in the Convex cloud
        database!
      </p>
      <p>
        <button
          className="bg-foreground text-background text-sm px-4 py-2 rounded-md"
          onClick={() => {
            void addNumber({ value: Math.floor(Math.random() * 10) });
          }}
        >
          Add a random number
        </button>
      </p>
      <p>Numbers: {numbers?.length === 0 ? 'Click the button!' : (numbers?.join(', ') ?? '...')}</p>
      <p>
        Edit{' '}
        <code className="text-sm font-bold font-mono bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded-md">
          convex/myFunctions.ts
        </code>{' '}
        to change your backend
      </p>
      <p>
        Edit{' '}
        <code className="text-sm font-bold font-mono bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded-md">
          app/page.tsx
        </code>{' '}
        to change your frontend
      </p>
      <p>
        See the{' '}
        <Link href="/server" className="underline hover:no-underline">
          /server route
        </Link>{' '}
        for an example of loading data in a server component
      </p>
    </div>
  );
}

function UserMenu({ user, onSignOut }: { user: User; onSignOut: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">{user.email}</span>
      <button onClick={onSignOut} className="bg-red-500 text-white px-3 py-0.5 rounded-md text-sm hover:bg-red-600">
        Sign out
      </button>
    </div>
  );
}
