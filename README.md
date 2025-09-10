# Convex + Next.js + WorkOS AuthKit Testbed App

See [@workos/tempalte-convex-nextjs-authkit](https://github.com/workos/template-convex-nextjs-authkit) for the recommened template;
this repo is for discussion and testing.

[link to example hosted on Vercel](https://workos-convex-nextjs-testbed.previews.convex.dev/)

To get this up, follow the instructions at the repo above.

# Patterns shown

### Client-side auth

[app/page.tsx](./app/page.tsx) shows client-side Convex authentication, similar to what is used in a React SPA.

- use `<Authenticated>`, `<Unauthenticated>`, and `<AuthLoading>` wrapper component to wait to load content until the Convex client has a JWT
- keep the user logged in via the client-side component (`"use client"`) `ConvexClientProvider`, which interfaces with AuthKit hooks to provided updated JWTs.

### Server-rendering data that requires auth
