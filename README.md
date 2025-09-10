# Convex + Next.js + WorkOS AuthKit Testbed App

See [@workos/template-convex-nextjs-authkit](https://github.com/workos/template-convex-nextjs-authkit) for the recommended Convex + AuthKit template;
this repo is for discussion and testing.

[link to example hosted on Vercel](https://workos-convex-nextjs-testbed.previews.convex.dev/)

To get this running locally follow the instructions at the repo above.

# Patterns shown

To use different layout.tsx code, this Next.js app uses [Route Groups](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups) app/(authenticated) and app/(unauthenticated).

### Client-side auth

[The root route /](https://workos-convex-nextjs-testbed.previews.convex.dev/) does Convex authentication client-side, similar to what is used in a zero-backend React SPA.

During SSR no content renders, regardless of whether the user is logged in.

After hydration the client requests a JWT if AuthKit says the user is logged in.

- [middleware.ts](./middleware.ts) lists '/' as an "unauthenticated path" so AuthKit middleware will allow this route to render for logged-out users
- [app/(unauthed)/page.tsx](<./app/(unauthed)/page.tsx>) uses `<Authenticated>`, `<Unauthenticated>`, and `<AuthLoading>` wrapper component to load different content and, critically, to wait to load content until the Convex client has a JWT
- [(unauthed)/layout.tsx](<./app/(unauthed)/layout.tsx>) renders the client-side component (`"use client"`) `ConvexClientProvider` which interfaces with AuthKit hooks to provided updated JWTs.

### Server-rendering data that requires auth

[/server](https://workos-convex-nextjs-testbed.previews.convex.dev/server) requires auth and renders authenticated content immediately.

During SSR the user must be authenticated and authenticated queries can be made.

After hydration a new JWT is requested and queries start to run once a JWT is received (due to `expectAuth: true`).

- [middleware.ts](./middleware.ts) causes '/server' to only render for logged-in users
- [app/(authed)/page.tsx](<./app/(authed)/server/page.tsx>) calls `withAuth()` which opts this route out of [static rendering](https://nextjs.org/docs/app/getting-started/partial-prerendering#static-rendering) and into [dynamic rendering](https://nextjs.org/docs/app/getting-started/partial-prerendering#dynamic-rendering) by accessing cookies in its implementation. This page does not use `<Authenticated>` to prevent authenticated queries from running.
- [(authed)/layout.tsx](<./app/(authed)/layout.tsx>) renders the client-side component (`"use client"`) `ConvexClientProvider` with the `expectAuth` prop that causes _all_ queries not to run until the ConvexClient has a JWT.

## Potential features

### Passing a token from the server

For mixed-auth pages like / it would be nice to get a token immediately if the user is logged in. This could allow `<Authenticated>` routes to run sooner client-side.

- does this opt these routes in to dynamic rendering?

### Using the `<Authenticated>` wrapper components on SSR'd pages

Today `<Authenticated>` content never runs during SSR, during SSR the auth state is always "unauthenticated" or "

### Not specifying `{ expectAuth: true }`

Specifying `{ expectAuth: true }` requires different code for different routes and unfortunately blocks _all_ queries, not just authed ones.

It also doesn't work as well as `<Authenticated>` for switching between different auth token fetchers (see https://github.com/get-convex/convex-js/issues/82).

- could we determine this based on some other list of authed routes, like in middleware?
- should a special argument to `useQuery()` hooks annotate whether they require auth? Opt-int could go the other way. (see https://github.com/get-convex/convex-js/issues/69)
- (deeper convex changes) to make the above work better could public functions declare their auth needs with typed middleware?
