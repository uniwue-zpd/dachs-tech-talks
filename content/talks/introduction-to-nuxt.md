---
title: "An Introduction to Nuxt"
speaker: "Maximilian Nöth"
category: "framework-deep-dive"
tags:
  - Nuxt
  - Vue
  - Framework
  - Frontend
date: "2025-07-29"
time: "10:30"
location: "00.003"
---

## 🌱 What is Nuxt?

Nuxt is a **meta-framework** built on top of Vue 3 that streamlines the development of modern web applications. 
It abstracts much of the boilerplate needed in a standard Vue setup and provides a highly integrated developer experience, covering:

* Client-side rendering (CSR)
* Server-side rendering (SSR)
* Static-site generation (SSG)
* Full-stack capabilities via its Nitro server

---

## 🧱 Nuxt vs. “Vanilla” Vue 3

| Feature         | Vue 3                 | Nuxt 3                         |
| --------------- | --------------------- | ------------------------------ |
| Routing         | Manual via Vue Router | File-based, auto-generated     |
| SSR             | Manual setup          | Built-in, enabled by default   |
| State mgmt      | Vuex / Pinia          | Pinia + Nuxt composables       |
| API integration | External backend      | Built-in server API with Nitro |
| Code structure  | Freestyle             | Convention over configuration  |
| TypeScript      | Optional              | First-class support            |

---

## ✨ Key Features That Make Nuxt Shine

### 📁 File-Based Routing

* Drop `.vue` files into `pages/`, and routing is auto-generated.
* Dynamic routes via `[param].vue`, catch-alls with `[...slug].vue`.

### ⚡ Server-Side Rendering (SSR)

* Enabled by default for performance and SEO.
* Supports route-based SSR, SSG, or SPA.

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
* And much more

### 🔧 Nitro Server

* Nuxt’s backend runtime engine (cross-platform, deploys anywhere).
* Define server API routes in `/server/api/`.
* Supports middlewares, edge rendering, and file-based API endpoints.

```ts
// server/api/hello.ts
export default defineEventHandler(() => {
  return { message: 'Hello from the server!' }
})
```

### 🧩 Other Highlights

* **Layouts system** for shared UIs
* **Middleware** support (auth, logging, guards)
* **Nuxt DevTools** (runtime inspection, performance profiling)
* **Module ecosystem**: Auth, Content, Image, i18n, etc.
* **Hybrid rendering** per route (choose between SSR, CSR, SSG)

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
* Modules can be official, community-maintained, or custom.
* Add them via `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@nuxt/content', '@nuxt/image']
})
```

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

---

## 🏁 Takeaways

Nuxt adds **structure**, **scalability**, and **developer joy** to Vue 3.
It’s a smart choice if you:

* Want SSR or static generation without setup hassle
* Need backend endpoints for lightweight APIs
* Prefer conventions and integrated tooling

---

## 🔗 Further Resources

* 📘 [nuxt.com/docs](https://nuxt.com/docs)
* 🛠️ [nuxt.com/modules](https://nuxt.com/modules)
* 🔥 [nitro.unjs.io](https://nitro.unjs.io)
