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

This talk provides a high-level overview of Nuxt, the intuitive meta-framework for building server-rendered Vue.js applications. 
We will cover the core concepts that make Nuxt a powerful choice for modern web development, especially in the context of our projects at DACHS.

**Key Links:**
- **Official Website:** [nuxt.com](https://nuxt.com/)
- **Nuxt Modules:** [nuxt.com/modules](https://nuxt.com/modules)

### Why Nuxt? Vue vs. Nuxt

While Vue.js provides an excellent foundation for building user interfaces, Nuxt builds on top of it to offer a structured, feature-rich framework that handles much of the boilerplate for you.

| Feature | "Vanilla" Vue.js | Nuxt |
| :--- | :--- | :--- |
| **Routing** | Manual setup with `vue-router` | Automatic file-based routing |
| **Rendering** | Client-Side by default (SPA) | Server-Side Rendering (SSR) out-of-the-box |
| **Data Fetching**| Manual `fetch` calls | Unified composables (`useFetch`, `useAsyncData`) |
| **Backend** | Requires a separate server | Built-in server engine (Nitro) for API routes |
| **Structure** | Flexible; developer-defined | Opinionated, conventional directory structure |

In this session, we'll explore these differences with practical examples to understand when and why choosing Nuxt gives us a significant advantage.
