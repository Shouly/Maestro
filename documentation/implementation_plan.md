---
description: Apply these rules when making changes to the project
globs:
alwaysApply: true
---

Update this rule if user requested changes to the project requirement, etc.
# Implementation plan

## Phase 1: Environment Setup

1.  **Initialize Starter Repository**: Visit the CodeGuide Starter Pro repo (<https://github.com/codeGuide-dev/codeguide-starter-pro>) and click on “Use Template” to create your project repository. *(Project Overview: Starter Kit)*
2.  **Clone Repository Locally**: Clone the newly created repository to your local machine (e.g., run `git clone <your-repo-url>`). *(Project Overview: Starter Kit)*
3.  **Install Node.js and NPM**: Verify Node.js is installed. If not, install Node.js (use the version recommended by the starter kit, typically the LTS version) and NPM. **Validation**: Run `node -v` and `npm -v` to check versions. *(Tech Stack: Frontend)*
4.  **Install Tauri Prerequisites**: Ensure Rust toolchain is installed (Rust and Cargo). Then install Tauri CLI v2.0 as specified. **Validation**: Run `rustc --version` and `tauri --version` to validate the installations. *(Tech Stack: Backend)*
5.  **Set Up Environment Variables**: Create a `.env` file at the project root containing keys and endpoints for Clerk Auth and Supabase (and placeholders for individual AI model API keys that users will add later). *(Core Functionalities: API Keys, Secure Authentication)*
6.  **Install Project Dependencies**: Inside the project directory, run `npm install` to install Next.js, Tailwind CSS, TypeScript, Shadcn UI, and Framer Motion. *(Tech Stack: Frontend)*
7.  **Configure Tailwind CSS**: Verify Tailwind CSS is configured in `tailwind.config.js` with the bright blue (#0090FF) accent color in the theme. *(Design Preferences: Bright Blue Theme)*
8.  **Initialize Clerk Auth**: Follow the Clerk Auth documentation to integrate into the project; verify minimal configuration exists in the project’s configuration files. *(Core Functionalities: Secure Authentication)*

## Phase 2: Frontend Development

1.  **Setup Next.js Pages Structure**: Create a basic page structure. Create `/pages/index.tsx` as the main application entry point. *(Starter Kit: CodeGuide Starter Pro)*
2.  **Implement Three-Panel Layout**: In `src/components/Layout.tsx`, create a layout component containing three panels: Conversation History, Active Chat, and Work Artifacts. *(Project Overview: Three-Panel Layout)*
3.  **Style Layout with Tailwind CSS**: Apply Tailwind CSS utility classes to ensure a minimalist, clean design with proper spacing and clear visual hierarchy. *(Design Preferences: Minimalist and Clean)*
4.  **Add Light/Dark Mode Toggle**: Integrate a light/dark mode switch using Next.js state management and Tailwind CSS dark mode classes, ensuring the accent color (#0090FF) remains consistent. *(Project Overview: Cross-Platform Compatibility)*
5.  **Integrate Shadcn UI Components**: Replace or create UI components (e.g., buttons, cards) using Shadcn UI for consistency across the app in `/src/components/`. *(Tech Stack: Shadcn UI)*
6.  **Animate UI with Framer Motion**: Add subtle animations (e.g., panel transitions) using Framer Motion in components like `/src/components/AnimatedPanel.tsx`. **Validation**: Run the development server (`npm run dev`) and verify animations function as expected. *(Tech Stack: Framer Motion)*
7.  **Develop Chat Interface**: Build the active chat component in `/src/components/ChatWindow.tsx` with streaming text response simulation and syntax highlighting for code (using a library like Prism.js or Highlight.js). *(Core Functionalities: Enhanced Chat Experience)*
8.  **Implement API Key Input Forms**: Create a form component `/src/components/APIKeyForm.tsx` that allows users to enter personal API keys for OpenAI, Anthropic, Deepseek, Ollama, and OpenRouter. Add basic validation to ensure fields are not empty. *(Core Functionalities: Unified AI Model Interface)*
9.  **Integrate Localization**: Set up i18n support (e.g., using next-i18next) with translation files for English and Chinese in `/public/locales/`. **Validation**: Toggle language settings and verify that the UI text updates. *(Core Functionalities: Localization)*
10. **Integrate Clerk UI for Authentication**: Create sign-in/up components using Clerk Auth. Place these components in `/src/components/Auth/`. **Validation**: Run the application and verify login flows. *(Core Functionalities: Secure Authentication)*

## Phase 3: Backend Development

1.  **Configure Tauri Backend**: In the project’s Tauri folder (typically `/src-tauri/`), set up the Tauri configuration file (`tauri.conf.json`) to enable communication between frontend and Rust backend. *(Tech Stack: Tauri 2.0)*
2.  **Develop Unified API Integration Module in Rust**: Create a Rust module (e.g., `/src-tauri/src/api_integration.rs`) that includes functions to communicate with each AI model provider using user-specified API keys. *(Core Functionalities: Unified AI Model Interface)*
3.  **Implement MCP Server Integration Settings**: In `/src-tauri/src/mcp.rs`, write functions that allow configuration of custom MCP servers (registration, status checks). *(Core Functionalities: MCP Server Integration)*
4.  **Connect to Supabase Database**: Add a Rust module `/src-tauri/src/supabase.rs` that handles connectivity to the Supabase database for storing chat history and settings. **Validation**: Test connection by writing and reading a sample record. *(Core Functionalities: Cloud-Based Sync)*
5.  **Build Cloud Sync Endpoints**: In the Rust backend, expose functions (via Tauri commands) that can sync chat history and user settings with Supabase. *(Core Functionalities: Cloud-Based Sync)*
6.  **Implement Secure Storage for API Keys in Memory**: Ensure that API key transmission from the frontend to the Tauri backend is done securely (though no additional encryption is required as per the requirements). *(Important Considerations: API Keys)*
7.  **Expose Tauri Commands for Chat Interaction**: Create Tauri commands in `/src-tauri/src/main.rs` to handle chat requests and respond with streaming data. **Validation**: Use Tauri’s dev tools to test command responses. *(Core Functionalities: Enhanced Chat Experience)*

## Phase 4: Integration

1.  **Connect Next.js Frontend to Tauri Backend**: In the Next.js app, update API service calls (e.g., in `/src/services/chatService.ts`) to invoke Tauri commands using the `@tauri-apps/api` package. *(Tech Stack: Tauri 2.0)*
2.  **Integrate API Key Form with Backend Storage**: Update the APIKeyForm component to securely transmit user API keys to the Tauri backend for use in AI model calls. *(Core Functionalities: Unified AI Model Interface)*
3.  **Integrate Clerk Auth with Tauri**: Ensure that user authentication state from Clerk Auth (frontend) is communicated to the Tauri backend as needed. *(Core Functionalities: Secure Authentication)*
4.  **Link MCP Server Settings UI to Backend Module**: Create a settings page (`/src/pages/settings.tsx`) where users can add and manage MCP servers. Connect this page to the backend module handling MCP integrations. *(Core Functionalities: MCP Server Integration)*
5.  **Wire Cloud Sync to UI Actions**: In components handling chat history and settings (e.g., `/src/components/ChatHistory.tsx`), integrate functions that call the Supabase sync endpoints in the Tauri backend. *(Core Functionalities: Cloud-Based Sync)*
6.  **Validate End-to-End Data Flow**: Perform manual testing by running through login, API key entry, sending a chat message, and syncing chat history. Ensure that responses are streamed and stored. *(Core Functionalities: Enhanced Chat Experience & Cloud-Based Sync)*

## Phase 5: Deployment

1.  **Setup CI/CD Pipelines**: Configure GitHub Actions (or similar) to build and test both the Next.js frontend and Tauri backend upon commits. Create a configuration file (e.g., `.github/workflows/ci.yml`). **Validation**: Commit a change and verify pipeline execution. *(Tech Stack: Deployment)*
2.  **Bundle Desktop Application**: Use the Tauri bundler to build cross-platform installers for Windows, macOS, and Linux. **Validation**: Run `npm run tauri build` and verify that bundles are generated in `/dist/`. *(Core Functionalities: Cross-Platform Compatibility)*
3.  **Deploy Supabase Database**: Ensure the Supabase instance is correctly configured and available. Update the connection endpoint in production environment variables. *(Core Functionalities: Cloud-Based Sync)*
4.  **Finalize Production Build**: Build the Next.js frontend for production (`npm run build`) and ensure that all environmental variables for Clerk Auth and Supabase are set in the hosting environment.
5.  **Post-Deployment Testing**: Run end-to-end tests on the packaged applications to verify unified chat functionality, proper authentication flows, and MCP server configurations. *(Project Overview: Core Functionalities, Q&A: Pre-Launch Checklist)*

*Note: Throughout the development, refer to the project documentation for design preferences, API key handling, and integration details. Each step is derived from the project summary and starter kit details provided.*
