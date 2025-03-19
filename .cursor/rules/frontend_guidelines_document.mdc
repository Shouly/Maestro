---
description: Apply these rules when making changes to the project
globs:
alwaysApply: true
---

Update this rule if user requested changes to the project requirement, etc.
# Maestro Frontend Guideline Document

This document provides an overview of the frontend setup for Maestro, our cross-platform AI Chat Assistant. It’s written in everyday language to explain the structure, design principles, and technologies used. Whether you’re a developer or someone curious about how things work behind the scenes, this guide will give you a clear picture of our approach.

## Frontend Architecture

For Maestro, we built our application using Next.js, a popular framework that helps us create fast, modern web applications. With Next.js, our code is organized into pages and components, making it easy to add new features over time. We use TypeScript to catch mistakes early and keep our code clean, and Tailwind CSS helps us style our application quickly and consistently.

Key libraries and tools include:

*   **Next.js** for page-based routing and server-side rendering.
*   **Tailwind CSS** for efficient, utility-first styling.
*   **TypeScript** for better code quality and fewer bugs.
*   **Shadcn UI** for ready-to-use, accessible components.
*   **Framer Motion** for smooth, subtle animations.

This architecture supports scalability because each part of the application is modular. It is maintainable thanks to a clear separation of concerns, and performance is maximized by techniques like server-side rendering and code splitting built right into Next.js.

## Design Principles

Our design philosophy for Maestro is all about simplicity and ease of use. Here are the main principles guiding our development:

*   **Usability:** The interface is built to be intuitive. Users can easily find chat history, active conversations, and important artifacts without any hassle.
*   **Accessibility:** We make sure that everyone can use Maestro. This means good contrast, clear fonts, and a logical layout that works well for various user needs.
*   **Responsiveness:** The application adjusts seamlessly to different screen sizes, ensuring that whether you’re on a desktop or a laptop, your experience is consistent and enjoyable.
*   **Minimalism:** We emphasize whitespace and a clean visual hierarchy to avoid clutter, letting users focus on what’s important.

## Styling and Theming

We have a modern, clean, and minimalist style for Maestro that embraces both light and dark themes. Here’s how we keep our application visually consistent:

*   **Styling Approach:** We use Tailwind CSS, which lets us create designs using small, reusable utility classes. This method simplifies our CSS and helps maintain consistency across the entire app.
*   **Theming:** The application supports both light and dark modes. We manage theming by utilizing Tailwind's dark mode feature along with CSS variables. This allows the app to easily switch colors without a complete overhaul of the styles.
*   **Design Style:** Our style is modern and minimalist with subtle, elegant animations that enhance the user experience without being distracting.

### Color Palette

*   **Accent Color:** Bright Blue (#0090FF) – used to highlight important elements and interactive components.
*   **Light Mode:** Mostly white backgrounds with soft greys and darker text for contrast.
*   **Dark Mode:** Dark grey or near-black backgrounds with light text that’s easy to read, along with the same bright blue for accents.

### Fonts

We use sans-serif fonts to ensure high readability. The chosen fonts are simple, modern, and clean, aligning perfectly with our minimalist design approach.

## Component Structure

Maestro is built on a component-based architecture. This means that every part of the interface – whether it’s a button, a chat card, or a panel – is a standalone component that can be reused throughout the application. This organization not only keeps the code tidy but also makes it much easier to update or add new features.

For instance, the three-panel layout (conversation history, active chat, and artifacts) is composed of a set of components that interact smoothly. Using Shadcn UI, we ensure that these components are both visually consistent and accessible.

## State Management

Managing the state of the application efficiently is crucial for a smooth user experience. We rely on React’s built-in hooks along with the Context API to manage and share state across components. This setup handles tasks like keeping track of the current chat, user authentication status through Clerk, and synchronizing data with Supabase.

By keeping state close to where it’s needed and sharing it through context, our application remains responsive, and changes are reflected quickly across the entire interface.

## Routing and Navigation

Routing in Maestro is handled by Next.js’s file-based routing system. This makes it simple to create new pages – just add a file in the pages directory and it automatically becomes accessible via a URL.

Inside the app, users can navigate between different sections such as their chat history, the active conversation window, and the artifacts panel. The navigation structure is clear and straightforward, ensuring that moving from one panel to another is seamless for the user.

## Performance Optimization

We pay close attention to performance so that Maestro runs smoothly across all platforms. Some of the performance strategies include:

*   **Lazy Loading and Code Splitting:** Only the parts of the application that are needed at a given time are loaded, reducing the initial load time.
*   **Asset Optimization:** We optimize images and other static assets to ensure they load quickly.
*   **Efficient Animations:** Thanks to Framer Motion, our animations are smooth and don’t drain resources.

These measures make the user experience fast and responsive, essential for an app that relies on online connectivity.

## Testing and Quality Assurance

Quality is key when building an application as dynamic as Maestro. To ensure our frontend is reliable and error-free, we implement several testing strategies:

*   **Unit Tests:** Each component and function is tested for correctness using tools like Jest.
*   **Integration Tests:** We test how different parts of the application work together, ensuring that components integrate smoothly and data flows correctly.
*   **End-to-End Tests:** With frameworks like React Testing Library (or even Playwright), we simulate user interactions to verify that the user experience remains consistent and error-free.

These testing strategies help us catch and fix issues early, maintaining a high level of quality throughout the development process.

## Conclusion and Overall Frontend Summary

To wrap it up, the frontend for Maestro is designed to be modern, intuitive, and performant. We use Next.js with TypeScript to create a structured and scalable codebase, while Tailwind CSS and Shadcn UI guide our look and feel. The component-based design, combined with robust state management and effective routing, ensures that the app remains maintainable and easy to update.

Our focus on usability, accessibility, and responsiveness underpins everything we do, ensuring that users – whether they are developers, AI enthusiasts, or researchers – have a smooth and engaging experience. With clear performance optimizations and rigorous testing in place, Maestro stands out as a reliable, cutting-edge cross-platform desktop application that integrates multiple AI models in a unified interface.

This guideline document reflects our commitment to a streamlined frontend architecture and solid design principles, setting Maestro apart as a user-friendly and visually appealing application.
