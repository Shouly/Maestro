---
description: Apply these rules when making changes to the project
globs:
alwaysApply: true
---

Update this rule if user requested changes to the project requirement, etc.
## Project Overview

*   **Type:** Cross-platform desktop application for AI interaction
*   **Description:** Maestro is a unified interface for multiple AI models (OpenAI, Anthropic, Deepseek, Ollama, and OpenRouter) that streamlines workflows with cloud sync, three-panel layout, MCP server configuration, and unified chat features.
*   **Primary Goal:** To provide a single, extensible platform that integrates various AI models with cloud-based data sync (via Supabase), robust authentication (Clerk Auth), and seamless MCP server integration for tool extensions.

## Project Structure

### Framework-Specific Routing

*   **Directory Rules:**

    *   **Next.js 14 App Router:** Enforce an `app/` directory structure with nested route folders such as `app/[route]/page.tsx` to support React Server Components and dynamic routes.
    *   Example 1: "Next.js 14 (App Router)" → `app/[route]/page.tsx` conventions
    *   Example 2: "Next.js (Pages Router)" → `pages/[route].tsx` pattern (not used in this project)
    *   Example 3: "React Router 6" → `src/routes/` with `createBrowserRouter` (not applicable here)

### Core Directories

*   **Versioned Structure:**

    *   **app/api:** Next.js 14 API routes with Route Handlers for backend interactions such as chat history sync and MCP server communications.
    *   **app/auth:** Contains authentication flows powered by Clerk Auth, e.g., `app/auth/login/page.tsx` for secure login screens.
    *   **app/mcp:** Dedicated folder for MCP server configuration pages to manage custom tool extensions.
    *   **app/ui:** Centralized folder for UI components leveraging Shadcn UI, Tailwind CSS, and Framer Motion for animations.

### Key Files

*   **Stack-Versioned Patterns:**

    *   **app/dashboard/layout.tsx:** Defines the root layout for the application, enforcing consistent theming (light/dark modes with a bright blue accent #0090FF).
    *   **app/api/[endpoint]/route.ts:** Implements API route handlers conforming to Next.js 14 standards.
    *   **app/auth/login/page.tsx:** Custom authentication page utilizing Clerk Auth and server actions.

## Tech Stack Rules

*   **Version Enforcement:**

    *   **next@14:** App Router required, no use of `getInitialProps`; all routing should follow the `app/` directory conventions.
    *   **tailwindcss@latest:** Utility-first CSS framework to be configured with PurgeCSS for production optimizations.
    *   **typescript@latest:** Strict type checking enabled across the project for improved maintainability.
    *   **shadcn-ui:** Component library integration must adhere to design guidelines with high contrast and minimalist layouts.
    *   **clerk-auth:** Enforce secure authentication flows using Clerk SDK with multi-option login integrations.
    *   **tauri@2.0:** For desktop application capabilities, ensuring cross-platform consistency using Rust backend integrations.
    *   **supabase:** Data synchronization must use real-time features of Supabase for chat history and settings storage.

## PRD Compliance

*   **Non-Negotiable:**

    *   "Users must provide their own API keys for AI model integrations." → API key entry and validation must be enforced at appropriate UI points.
    *   "Offline mode is not supported; the application requires a constant internet connection." → Enforce online connectivity checks and disable offline functionalities.

## App Flow Integration

*   **Stack-Aligned Flow:**

    *   Example: "Next.js 14 Auth Flow → `app/auth/login/page.tsx` uses server actions to securely handle login and authentication via Clerk Auth."
    *   Example: "MCP Configuration Flow → `app/mcp/settings/page.tsx` provides UI for managing custom MCP server configurations and tool extensions."

## Best Practices

*   **Next.js**

    *   Use the App Router structure exclusively; avoid mixing Pages Router patterns.
    *   Leverage Server Components for optimal performance and security.
    *   Utilize built-in routing and data fetching methods provided by Next.js 14.

*   **Tailwind CSS**

    *   Follow a mobile-first approach and use responsive design utilities.
    *   Utilize PurgeCSS to remove unused classes in production builds.
    *   Maintain consistency with design tokens (e.g., accent color #0090FF) across the application.

*   **TypeScript**

    *   Enable strict mode for robust type checking.
    *   Define clear interfaces and types for API responses and component props.
    *   Leverage TypeScript’s tooling for incremental improvements and error detection.

*   **Shadcn UI**

    *   Use pre-built components to maintain design consistency.
    *   Customize UI elements to adhere to the minimalist and geometric design language.
    *   Ensure components are accessible and responsive.

*   **Clerk Auth**

    *   Implement secure authentication flows using Clerk’s SDK.
    *   Support multiple login methods and ensure proper session handling.
    *   Regularly update and patch security vulnerabilities.

*   **Tauri & Rust**

    *   Follow best practices for secure desktop application development.
    *   Optimize Rust code for performance and memory safety.
    *   Ensure seamless integration with the frontend (Next.js) for cross-platform consistency.

*   **Supabase**

    *   Use real-time database features for ensuring up-to-date chat history.
    *   Implement efficient data syncing between client and server.
    *   Regularly back up data and monitor performance.

## Rules

*   Derive folder/file patterns **directly** from the tech stack versions specified (e.g., Next.js 14 with App Router).
*   If Next.js 14 App Router is used, enforce the `app/` directory with nested route folders exclusively.
*   If Pages Router (or any other routing system) was chosen, use `pages/*.tsx` flat structure—but do not mix these with App Router patterns.
*   Mirror this logic for other frameworks (e.g., React Router, SvelteKit) by adhering to their versioned file structures.
*   Never mix different version patterns; for instance, do not include a `pages/` directory in a Next.js 14 App Router project.
