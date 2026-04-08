# Project Scope: 6te9 Admin Panel

## Overview
The `6te9-admin-panel` is a React-based single-page application (SPA) acting as an administrative dashboard to manage inventory and operations across a multi-category marketplace. Built using Vite, React, TypeScript, and TailwindCSS (via Lucide icons and utility classes), it provides a responsive interface for managing platform data.

## Identity
- **Name**: 6te9-admin-panel
- **Type**: Frontend Web Application (Admin Dashboard)
- **Tech Stack**: React 19, TypeScript, Vite, Tailwind CSS (inferred from classes), `lucide-react` for iconography.

## Core Domain Models
The marketplace is divided into three distinct categories, each with highly specialized data schemas:
1. **TECH**: Electronics, gadgets, and computing. Features attributes like condition, brand, specs, weight, and warranty details.
2. **MEDIA**: Custom printed materials, signage, and packaging. Features customization options, lead time, MOQ, dimensions, and production methods.
3. **CULINARY**: Food, spices, and ingredients. Features dietary tags, spice level, ingredients, allergens, preparation, and nutritional info.

## Features & Capabilities
1. **Access Control**: Role-based access containing `ADMIN`, `MANAGER`, and `EDITOR` roles.
2. **Inventory Visibility**: Real-time tracking of item statuses (`DRAFT`, `PUBLISHED`, `ARCHIVED`).
3. **Data Integrity**: Auditing built into item schemas (tracking created/updated/published timestamps and actors).
4. **Platform Control**: Global modifiers like Maintenance Mode to lock down the interface to administrative actions only.
5. **Lead Funnel Optimization**: Multi-stage Kanban board for managing relationships across Mon Biens, Tech, Media, and Blxrk brands.
6. **Business Broadcasts**: Text-based CRUD engine for propagating news and promotional offers across verticals.
7. **WhatsApp Business Engine**: Integrated API management for business interactions and real-time synchronization.
