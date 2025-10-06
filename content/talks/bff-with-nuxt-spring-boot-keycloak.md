---
title: "Backend for Frontend (BFF) with Nuxt 4, Spring Boot & Keycloak"
speaker: "Maximilian Nöth"
category: "architecture-bits"
tags:
  - Authentication
  - BFF
  - OIDC
  - Nuxt
  - Spring Boot
  - Keycloak
date: "2025-10-07"
location: "01.023"
---

# Backend for Frontend (BFF) with Nuxt 4, Spring Boot & Keycloak

## What is BFF?

**Backend for Frontend** is an architectural pattern where each frontend application has its own dedicated backend service that acts as an intermediary to backend APIs.

**Key Benefits:**
- Handles session management and authentication
- Acts as a security boundary (tokens never reach browser)
- Aggregates, transforms, and orchestrates backend calls
- Simplifies client code

## Why BFF with OAuth2/OIDC?

### Client-Side OAuth: PKCE + SPA

**The Modern SPA Approach:**
OAuth 2.0 with PKCE (Proof Key for Code Exchange) is the recommended approach for SPAs. Libraries like [oidc-spa](https://github.com/keycloakify/oidc-spa) make it straightforward:

```typescript
import { createOidc } from "oidc-spa";

const oidc = await createOidc({
  issuerUri: "https://auth.example.com",
  clientId: "my-app"
});

// Login handled automatically
await oidc.login();

// Tokens managed in memory
const response = await fetch(api, {
  headers: { Authorization: `Bearer ${oidc.getTokens().accessToken}` }
});
```

**PKCE solves authorization code interception** - no client secret needed, dynamic code verifier prevents attacks.

**But tokens still live in the browser:**
- Access tokens in memory (safer than localStorage, but still in browser)
- Refresh tokens in memory or sessionStorage (long-lived credentials in browser)
- XSS can still extract tokens from memory or intercept calls
- Token refresh logic runs client-side (additional attack surface)

### BFF Approach: Tokens Never Leave Server

**With BFF, the browser never sees tokens:**

```typescript
// Client code - no tokens, no auth logic
const response = await $fetch('/api/data')
```

**Why this is more secure:**

1. **No token exposure** - Access/refresh tokens stay server-side in encrypted sessions
2. **XSS cannot steal tokens** - Even if attacker injects JavaScript, tokens aren't accessible
3. **Smaller attack surface** - Browser only has session cookie (HTTP-only, Secure, SameSite)
4. **Server-side refresh** - Token refresh happens server-side with client secret (not possible in PKCE)
5. **Defense in depth** - Even if XSS exists, attacker can't exfiltrate long-lived credentials

**Trade-off:**
- PKCE + SPA: Simpler architecture, stateless (no server sessions)
- BFF: More secure (tokens never in browser), but adds server complexity

**When BFF wins:**
- High-security requirements
- Need to orchestrate multiple backend APIs
- Want centralized logging/monitoring
- Supporting multiple client types (web + mobile)

## Our Implementation

### Stack
- **BFF Layer**: Nuxt 4 Server (Nitro)
- **Backend**: Spring Boot 3 + OAuth2 Resource Server
- **Auth**: Keycloak 26 (OIDC Provider)
- **Database**: PostgreSQL

### Architecture Flow

```
Browser                    Nuxt BFF                Spring Backend
   │                          │                           │
   │─────GET /api/users──────>│                           │
   │                          │                           │
   │                    [1] Check session                 │
   │                    [2] Extract access_token          │
   │                    [3] Check expiry (5min buffer)    │
   │                          │                           │
   │                    [4] Refresh if needed             │
   │                          │──────POST /token─────────>│
   │                          │<─────new tokens───────────│
   │                          │                           │
   │                    [5] Update session                │
   │                          │                           │
   │                          │───GET /api/v1/users──────>│
   │                          │   Bearer: xxx             │
   │                          │<──────data────────────────│
   │                          │                           │
   │<────────data─────────────│                           │
```

### Key Implementation

**OAuth Flow** - Store tokens in server session:
```typescript
async onSuccess(event, { tokens }) {
  await setUserSession(event, {
    secure: {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      accessTokenExpires: Date.now() + tokens.expires_in * 1000
    }
  })
}
```

**API Proxy** - Forward requests with automatic token refresh:
```typescript
export default defineEventHandler(async (event) => {
  const { secure } = await getUserSession(event)
  await refreshTokenIfExpired(event, { secure })  // 5min buffer
  const updated = await getUserSession(event)

  return $fetch(`${config.apiBaseInternal}/${path}`, {
    headers: { Authorization: `Bearer ${updated.secure.accessToken}` }
  })
})
```

**Configuration** (`nuxt.config.ts`):
```typescript
runtimeConfig: {
  oauth: { keycloak: { clientSecret: 'xxx' } },  // Server-side only
  apiBaseInternal: 'http://app:8080/api/v1'     // Internal Docker URL
}
```

**Result:**
- Client: `await $fetch('/api/users')` (no auth code needed)
- Tokens in HTTP-only cookies (XSS-proof)
- Automatic refresh (5min buffer before expiry)
- Backend abstraction (client unaware of Spring Boot)

### Beyond Proxying

**Aggregate multiple backends:**
```typescript
export default defineEventHandler(async (event) => {
  const [user, orders, preferences] = await Promise.all([
    $fetch('/api/v1/users/me'),
    $fetch('/api/v1/orders'),
    $fetch('/api/v2/preferences')  // Different API version
  ])
  return { user, orders, preferences }  // Single response to client
})
```

**Transform responses:**
```typescript
// Backend returns snake_case, client expects camelCase
const data = await $fetch('/api/v1/user_profile')
return camelcaseKeys(data)
```

**Add caching layer:**
```typescript
const cached = await useStorage('cache').getItem(cacheKey)
if (cached) return cached

const fresh = await $fetch('/api/v1/expensive-query')
await useStorage('cache').setItem(cacheKey, fresh, { ttl: 300 })
return fresh
```

**Handle file uploads:**
```typescript
// Process file server-side, send metadata to backend
const file = await readMultipartFormData(event)
const processed = await processImage(file)
return $fetch('/api/v1/upload', { method: 'POST', body: processed })
```

### SSR Advantages

**With SPA + PKCE:** Client-side auth means no authenticated SSR
```typescript
// Page loads, then client checks auth, then fetches data
// User sees: blank → loading spinner → content
<script setup>
const { data } = await useFetch('/api/users')  // Client-side only
</script>
```

**With BFF:** Server-side auth enables authenticated SSR
```typescript
// Server fetches data during SSR using session tokens
// User sees: fully rendered content immediately
<script setup>
const { data } = await useFetch('/api/users')  // Works during SSR!
</script>
```

**Benefits:**
- **No loading states** - Data fetched server-side, page pre-rendered with content
- **Faster perceived performance** - No client-side auth check → API call waterfall
- **SEO for authenticated content** - Search engines see rendered content
- **Better UX** - No flash of unauthenticated content or loading spinners

## Considerations

**When BFF Makes Sense**
- OAuth/OIDC authentication
- Multiple backend services to orchestrate
- Security-sensitive applications
- Mobile + Web apps with different needs

**When It Might Be Overkill**
- Simple public APIs
- Serverless-first architecture (adds state)
- Pure SPA with API Gateway already handling auth

**Operational Overhead**
- Additional service to deploy and monitor
- Session storage requirements (Redis for multi-instance)
- Increased latency (extra hop)

## Takeaways

1. **OAuth + browser = pain** - BFF solves it elegantly
2. **Server-side sessions are fine** - XSS is a bigger risk than CSRF
3. **Keep it thin** - BFF should be a proxy, not business logic
4. **One BFF per experience** - Don't try to serve all clients from one BFF

## References

- [Sam Newman - Pattern: Backends For Frontends](https://samnewman.io/patterns/architectural/bff/)
- [OAuth 2.0 for Browser-Based Apps (BCP)](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-browser-based-apps)
- [OWASP - Token Storage Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html#local-storage)
