# Convex + Next.js + WorkOS AuthKit Testbed App

See [@workos/template-convex-nextjs-authkit](https://github.com/workos/template-convex-nextjs-authkit) for the recommened template;
this repo is for discussion and testing.

[link to example hosted on Vercel](https://workos-convex-nextjs-testbed.previews.convex.dev/)

To get this up, follow the instructions at the repo above.

# Patterns shown

To use different layout.tsx code, this NExt.js app uses [Route Groups](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups) app/(authenticated) and app/(unauthenticated).

### Client-side auth

[/](https://workos-convex-nextjs-testbed.previews.convex.dev/server) does Convex authentication client-side, similar to what is used in a zero-backend React SPA.

- [middleware.ts](./middleware.ts) lists '/' as an "unauthenticated path" so AuthKit middleware will allow this route to render for logged-out users.
- app/(unauthenticated)/page.tsx](./app/(unauthenticated)page.tsx) usse `<Authenticated>`, `<Unauthenticated>`, and `<AuthLoading>` wrapper component to load different content and, critically, to wait to load content until the Convex client has a JWT
- [(unautheniticated)/layout.tsx](<./app/(unauthenticated)/layout.tsx>) renders the client-side component (`"use client"`) `ConvexClientProvider` which interfaces with AuthKit hooks to provided updated JWTs.

### Server-rendering data that requires auth

[/server](https://workos-convex-nextjs-testbed.previews.convex.dev/server) requires auth and renders authenticated content immediately

- [middleware.ts](./middleware.ts) lists '/server' as an "unauthenticated path" so AuthKit middleware will allow this route to render for logged-out users.
- app/(unauthenticated)/page.tsx](./app/(unauthenticated)page.tsx) usse `<Authenticated>`, `<Unauthenticated>`, and `<AuthLoading>` wrapper component to load different content and, critically, to wait to load content until the Convex client has a JWT
- [(unautheniticated)/layout.tsx](<./app/(unauthenticated)/layout.tsx>) renders the client-side component (`"use client"`) `ConvexClientProvider` which interfaces with AuthKit hooks to provided updated JWTs.
