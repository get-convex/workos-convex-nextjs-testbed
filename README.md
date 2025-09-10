# Convex + Next.js + WorkOS AuthKit Testbed App

See [@workos/template-convex-nextjs-authkit](https://github.com/workos/template-convex-nextjs-authkit) for the recommened template;
this repo is for discussion and testing.

[link to example hosted on Vercel](https://workos-convex-nextjs-testbed.previews.convex.dev/)

To get this running locally follow the instructions at the repo above.

# Patterns shown

To use different layout.tsx code, this Next.js app uses [Route Groups](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups) app/(authenticated) and app/(unauthenticated).

### Client-side auth

[The root route /](https://workos-convex-nextjs-testbed.previews.convex.dev/) does Convex authentication client-side, similar to what is used in a zero-backend React SPA.

During SSR no content renders, regardless of whether the user is logged in.

After hydration, the client fetches a token if necessary.

- [middleware.ts](./middleware.ts) lists '/' as an "unauthenticated path" so AuthKit middleware will allow this route to render for logged-out users
- [app/(unauthed)/page.tsx](<./app/(unauthed)/page.tsx>) uses `<Authenticated>`, `<Unauthenticated>`, and `<AuthLoading>` wrapper component to load different content and, critically, to wait to load content until the Convex client has a JWT
- [(unauthed)/layout.tsx](<./app/(unauthed)/layout.tsx>) renders the client-side component (`"use client"`) `ConvexClientProvider` which interfaces with AuthKit hooks to provided updated JWTs.

### Server-rendering data that requires auth

[/server](https://workos-convex-nextjs-testbed.previews.convex.dev/server) requires auth and renders authenticated content immediately.

- [middleware.ts](./middleware.ts) causes '/server' to only render for logged-in users
- [app/(authed)/page.tsx](<./app/(authed)/server/page.tsx>) calls `withAuth()` which opts this route out of [static rendering](https://nextjs.org/docs/app/getting-started/partial-prerendering#static-rendering) and into [dynamic rendering](https://nextjs.org/docs/app/getting-started/partial-prerendering#dynamic-rendering) by accessing cookies in its implementation. This page does not use `<Authenticated>` to prevent authenticated queries from running.
- [(authed)/layout.tsx](<./app/(authed)/layout.tsx>) renders the client-side component (`"use client"`) `ConvexClientProvider` with the `expectAuth` prop that causes _all_ queries not to run until the ConvexClient has a JWT.

## Potential features

### Passing a token from the server

For authed-only pages, the
