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

### Two Approaches

**1. Client-Side with PKCE**
- Modern standard for SPAs (e.g., [oidc-spa](https://github.com/keycloakify/oidc-spa))
- While PKCE solves the security issue of public clients, pitfalls remain:
  - Tokens in browser memory (still accessible to XSS)
  - Memory cleared? User must re-login (tab close, refresh)
  - No straight forward way to do authenticated SSR (server can't access in-memory tokens)

**2. BFF - Tokens Never Leave Server**
```typescript
const response = await $fetch('/api/data')  // No auth logic needed
```
- Tokens in encrypted server sessions (opaque session ID in cookie)
- Tokens never exposed to browser (XSS-proof)
- Confidential client with client secret
- Authenticated SSR + no re-login on refresh

### Why BFF Wins

**1. True Token Isolation**
- Only opaque session ID in cookie, tokens never leave server
- Not visible in DevTools or accessible to browser extensions

**2. Network Isolation**
```yaml
# Only BFF exposed to internet, backend stays internal
spring-backend:
  networks: [internal]  # NOT publicly accessible
keycloak:
  networks: [internal]  # Admin API protected
```
- **Critical for Keycloak Admin Client** - admin operations stay server-to-server in private network
- Client-side approach: Backend must be public for browser calls

**3. Additional Benefits**
- Backend URL abstraction (frontend doesn't know backend URLs)
- Confidential client (can use client secret)
- Centralized caching, rate limiting, monitoring

## Our Implementation

### Stack
- **BFF Layer**: Nuxt 4 Server (Nitro) with nuxt-auth-utils
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

**1. OAuth Flow** - Store tokens in server session (using nuxt-auth-utils)
```javascript
async onSuccess(event, { tokens }) {
  await setUserSession(event, {
    secure: { accessToken, refreshToken, accessTokenExpires }
  })
}
```

**2. API Proxy** - Auto-refresh & forward
```javascript
export default defineEventHandler(async (event) => {
  await refreshTokenIfExpired(event)  // 5min buffer
  const { accessToken } = await getUserSession(event)

  return $fetch(`${config.apiBaseInternal}/${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  })
})
```

**3. Config** - Internal Docker URLs
```javascript
runtimeConfig: {
  oauth: { keycloak: { clientSecret: 'xxx' } },
  apiBaseInternal: 'http://app:8080/api/v1'  // Not public!
}
```

### Beyond Proxying

BFF enables orchestration, transformation, caching:
```javascript
// Aggregate multiple backends
const [user, orders, preferences] = await Promise.all([...])

// Transform responses (snake_case → camelCase)
return camelcaseKeys(data)

// Cache expensive queries
const cached = await useStorage('cache').getItem(key)
```

### SSR with BFF

**SPA (in-memory tokens):** Client-side only → blank → spinner → content

**BFF:** Server fetches during SSR → fully rendered immediately
- No loading states or content flashes
- Better perceived performance
- SEO for authenticated content

## When to Use BFF

**Use BFF when:**
- OAuth/OIDC with security requirements
- Multiple backend services to orchestrate
- Need network isolation (admin APIs, internal services)
- Compliance (PCI-DSS, HIPAA, SOC2)

**Skip BFF when:**
- Simple public APIs
- Serverless-first (BFF adds state/sessions)
- API Gateway already handles auth

## Takeaways

1. **BFF solves secure OAuth in browser** - tokens never reach browser
2. **Network isolation** - keep Keycloak Admin & backends internal
3. **Keep BFF thin** - proxy/orchestration only, not business logic
4. **One BFF per client type** - web, mobile, desktop each get their own

## References

- [Auth0 - The Backend for Frontend Pattern](https://auth0.com/blog/the-backend-for-frontend-pattern-bff/)
- [nuxt-auth-utils - Session & OAuth for Nuxt](https://github.com/atinux/nuxt-auth-utils)
- [OAuth 2.0 for Browser-Based Apps (BCP)](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-browser-based-apps)
- [OWASP - Token Storage Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html#local-storage)
- [Phil Calcado - The Back-end for Front-end Pattern (BFF), 2015](https://philcalcado.com/2015/09/18/the_back_end_for_front_end_pattern_bff.html)
