---
title: "An Introduction to Nuxt"
speaker: "Maximilian Nöth"
category: "framework-spotlight"
tags:
  - Nuxt
  - Vue
  - Framework
  - Frontend
date: "2025-07-29"
location: "00.003"
---

## 🌱 What is Nuxt?

Nuxt is a **powerful framework built on top of Vue 3** that simplifies and enhances the development of modern web applications. It provides a cohesive architecture and sensible defaults for building anything from small websites to large-scale full-stack applications.
Nuxt handles many of the common concerns in frontend and full-stack development out of the box, including:
* **Rendering modes**: support for Server-Side Rendering (SSR), Static Site Generation (SSG), and Client-Side Rendering (CSR)
* **Routing**: automatic file-based routing system
* **Data fetching and state management**: built-in utilities for handling server data
* **Developer experience**: features like auto-imports, hot module replacement, and TypeScript support
* **Extensibility**: plugin system and a large ecosystem of official modules
* **Full-stack capabilities**: powered by Nitro, Nuxt can also handle backend logic, APIs, and server middleware

---

## 🧱 Nuxt vs. “Vanilla” Vue 3

| Feature                     | **Nuxt**                                                               | **Vue**                                                                 |
|----------------------------|------------------------------------------------------------------------|-------------------------------------------------------------------------|
| **Rendering Modes**        | Supports SSR, SSG, ISR, CSR — choose depending on need                 | Only client-side rendering (unless you setup SSR manually)              |
| **Routing & Structure**    | File-based routing via `pages/`, with layouts, middleware, and plugins | Manual routing using Vue Router or custom setup                         |
| **Developer Experience**   | Built-in auto-imports, HMR, TypeScript support, and module ecosystem   | Configuration done manually; more control, more setup                   |
| **Performance & SEO**      | Automatic code-splitting, prefetching; SSR/SSG gives fast initial load | Slower first load; SEO requires custom SSR implementation               |
| **Scalability & Maintenance** | Opinionated structure supports large codebases and teams               | Flexible and lightweight, but requires your own conventions             |
| **Overhead & Bundle Size** | Some abstraction/runtime overhead from framework layers                | Minimal runtime and smaller bundles—ideal for tiny widgets              |

> Many features in Nuxt — like SSR, auto-imports, or server APIs — can be added to Vue manually using the unjs ecosystem (e.g., Nitro, H3), but Nuxt packages them into a cohesive and ready-to-use framework.

---

## ✨ Key Features That Make Nuxt Shine

### 📁 File-Based Routing

* Drop `.vue` files into `pages/`, and routing is auto-generated.
* Dynamic routes via `[param].vue`, catch-alls with `[...slug].vue`.

### ⚡ Server-Side Rendering (SSR)

* Enabled by default for performance and SEO.
* Supports route-based SSR, SSG, SPA, or even ISR (Incremental Static Regeneration).

### 🔄 Auto-Imports

* No need to manually import composables or components.
* Common composables like `useFetch`, `useRoute`, `useAsyncData`, etc. are globally available.

### 🌐 Data Fetching

Nuxt introduces `useFetch()` and `useAsyncData()` — SSR-aware composables for easy data loading:

```ts
const { data, pending, error } = await useFetch('/api/products', {
  key: 'products',
  server: true,
  lazy: false,
  default: () => [],
  transform: (data) => data.items,
  cache: true
})
```

These methods automatically handle:

* Caching
* Rehydration on client
* Error states and loading indicators
* Parallel fetching with deduplication

### 🔧 Nitro Server

* Nuxt’s backend runtime engine (cross-platform, deploys anywhere).
* Define server API routes in `/server/api/`.
* Supports middlewares, edge rendering, file-based endpoints, and even storage drivers.

```ts
// server/api/hello.ts
export default defineEventHandler(() => {
  return { message: 'Hello from the server!' }
})
```

### 🧹 Other Highlights

* **Layouts system** for shared UIs
* **Middleware** support (auth, logging, guards)
* **Nuxt DevTools** (runtime inspection, performance profiling)
* **Module ecosystem**: Auth, Content, Image, i18n, SEO, etc.
* **Hybrid rendering** per route (choose between SSR, CSR, SSG, ISR)
* **Route rules** in `nuxt.config.ts` to control rendering per path

### 🔌 Plugins

* Use the `plugins/` directory to register third-party libraries or custom behavior.
* Plugins can run in different modes: client-only, server-only, or universal.
* Common use cases include setting up global libraries, injecting helpers, or running side effects.

```ts
// plugins/axios.ts
export default defineNuxtPlugin(nuxtApp => {
  const api = axios.create({ baseURL: '/api' })
  nuxtApp.provide('api', api)
})
```

### 📦 Modules

* Modules extend Nuxt with reusable and composable functionality.
* Common examples: `@nuxt/image`, `@nuxt/content`, `@nuxt/auth`, `nuxt-icon`, `nuxt-seo-kit`.

```ts
export default defineNuxtConfig({
  modules: ['@nuxt/content', '@nuxt/image']
})
```

---

### ▶️ Starting a New Project with Nuxt

Use the Nuxt CLI to scaffold a new project:

```bash
pnpm create nuxt my-app
cd my-app
nuxt dev
```

This will:

* Create a new Nuxt 3 project in `my-app/`
* Install dependencies
* Start the development server at `http://localhost:3000`

---

## 🏢 Why to use Nuxt at DACHS?

* Unified frontend + backend in a single codebase
* Easier onboarding and better team productivity
* Encourages maintainable and scalable architecture
* Good support for both experimental prototypes and production-ready apps
* Ideal for content-heavy projects and rapid prototyping

---

## ⚖️ When Not to Use Nuxt

While Nuxt provides a lot of powerful defaults, it’s not the best fit for every project. Consider using plain Vue 3 (with or without the unjs ecosystem) when:

* You're building a **library**, design system, or highly reusable component.
* You need **full control** over routing, file structure, or build setup.
* You’re working on a **purely client-side** or **canvas/WebGL app** (e.g., a graphics editor).
* You aim for the **smallest possible bundle** and want no extra conventions.

Nuxt adds structure and power, but that comes with some overhead. When you don’t need that structure, a leaner setup might be the better choice.

---

## 🌟 Takeaways

Nuxt adds **structure**, **scalability**, and **developer joy** to Vue 3.
It’s a smart choice if you:

* Want SSR or static generation without setup hassle
* Need backend endpoints for lightweight APIs
* Prefer conventions and integrated tooling
* Want to iterate quickly and build full-stack apps efficiently

---

## 🔗 Further Resources

* 📘 [nuxt.com/docs](https://nuxt.com/docs)
* 🛠️ [nuxt.com/modules](https://nuxt.com/modules)
* 🔥 [nitro.unjs.io](https://nitro.unjs.io)
* 🧰 [unjs.io](https://unjs.io)
