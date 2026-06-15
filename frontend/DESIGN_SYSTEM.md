# Where-Is-My-Slot Theme & Design System

This document serves as the absolute truth for the frontend UI/UX design language across the entire application. From this point forward, **all new components and pages must strictly adhere to these guidelines.**

## 1. Core Philosophy
- **Dynamic & Premium**: The app should feel alive, rich, and highly interactive like a premium social media platform (e.g., Instagram).
- **Glassmorphism & Gradients**: Subtle background blur on fixed headers and rich gradients for calls-to-action.
- **Flawless Dark Mode**: Class-based dark mode (`.dark`) using `next-themes`.

## 2. Color Palette & Theming
### Light Mode
- **Page Background**: `#f0f2f5` (`bg-[#f0f2f5]`)
- **Card Background**: `#ffffff` (`bg-white`)
- **Primary Text**: `#111827` (`text-gray-900`)
- **Secondary Text**: `#6b7280` (`text-gray-500`)
- **Borders**: `#f3f4f6` or `#e5e7eb` (`border-gray-100` / `border-gray-200`)

### Dark Mode
- **Page Background**: `#1a1a1a` (`dark:bg-[#1a1a1a]`)
- **Card Background**: `#242424` (`dark:bg-[#242424]`)
- **Primary Text**: `#ffffff` (`dark:text-white`)
- **Secondary Text**: `#9ca3af` or `#d1d5db` (`dark:text-gray-400` / `dark:text-gray-300`)
- **Borders**: `#1f2937` (`dark:border-gray-800`)

### Accents
- **Primary Accent**: Yellow-400 (`#facc15`). Used for active states, icons, and primary buttons.
- **Primary Gradient**: `bg-gradient-to-r from-yellow-400 to-yellow-500`. Used for high-emphasis buttons (e.g., "List your business").
- **Secondary Gradient**: `bg-gradient-to-tr from-yellow-400 to-red-500`. Used for story/flash-sale borders.
- **Link/Action Color**: Blue (`text-blue-500`, `bg-blue-600` for map navigation).

## 3. Layout Architecture
- **Container Constrain**: Use `max-w-[1440px] mx-auto` to wrap major page content.
- **Header**: Fixed at top (`fixed top-0 w-full z-50 h-[72px]`), with a slight translucent background (`bg-white/80 dark:bg-[#242424]/80 backdrop-blur-md`).
- **3-Column Feed Layout**:
  - **Left Sidebar**: `w-[320px] shrink-0 overflow-y-auto no-scrollbar` (Fixed content, e.g., Profile).
  - **Center Feed**: `flex-1 max-w-[680px] w-full overflow-y-auto no-scrollbar` (The ONLY part of the main screen intended to scroll infinitely).
  - **Right Sidebar**: `w-[340px] shrink-0 overflow-y-auto no-scrollbar` (Fixed content, e.g., Discovery/Activity).

## 4. UI Component Styling Rules
- **Cards**: All content blocks should be wrapped in heavily rounded cards.
  - Class: `bg-white dark:bg-[#242424] rounded-[28px] md:rounded-[32px] p-5 md:p-6 shadow-sm border border-gray-100 dark:border-gray-800`
- **Buttons**: Thick, rounded, and bold.
  - Action Button (Yellow): `bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-2 rounded-xl transition-colors`
  - Action Button (Dark/Subtle): `bg-gray-100 dark:bg-[#2a2a2a] hover:bg-gray-200 dark:hover:bg-[#333] transition-colors font-bold text-gray-800 dark:text-gray-200 rounded-xl`
- **Scrollbars**: Hide standard browser scrollbars to maintain the app-like feel.
  - Class: `no-scrollbar`
- **Avatars/Images**: Soft, rounded corners (`rounded-xl` or `rounded-2xl` or `rounded-full`). Must use `object-cover`.
- **Transitions**: Every interactive element MUST have hover states and `transition-colors` or `transition-transform` applied.
  - Ex: `group-hover:scale-110 transition-transform duration-300`

## 5. Overlay & Modal Standards (e.g., Flash Sales Viewer)
- Modals must act like Instagram stories.
- **Backdrop**: `fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm`
- **Container**: `w-full max-w-[420px] h-[90vh] bg-gray-900 rounded-[32px] overflow-hidden`
- **Close Button**: Absolute top right with `lucide-react` X icon.

*By adhering to this document, we ensure that every new route and component added to Where-Is-My-Slot matches the exact premium look and feel established on the homepage.*
