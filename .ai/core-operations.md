# Core Operations & Architecture

## Application Architecture
The application is structured as a client-side Vite + React SPA with the following core layout:
- **Dashboard (`App.tsx`)**: The main state container routing active views.
- **Sidebar & Header**: Global navigation components.
- **Interactive Views (Route-based)**:
  - `DASHBOARD` (`/`): Aggregate statistics (Total items, revenue estimates, pending reviews).
  - `INVENTORY` (`/inventory/:vertical`): Categorical datatables.
  - `LEADS` (`/leads`): Kanban relationship pipeline.
  - `WHATSAPP` (`/whatsapp`): API interaction management.
  - `NEWS` (`/news`): Broadcast CRUD interface.
  - `ANALYTICS` (`/analytics`): Business intelligence metrics.
  - `SETTINGS` (`/settings`): System modifiers.

- **Component Organization**:
  - `components/modals/`: Centralized container for ingestion engines (`ItemForm`, `BulkUploadModal`).

## Core Operations

### 1. Authentication (`Auth.tsx`)
Gatekeeps access to the dashboard. Validates user sessions and supplies a localized `User` session object with an associated role to govern interactions.

### 2. Inventory CRUD Operations
- **Create/Edit (`ItemForm.tsx`)**: Dynamic forms adapted to the `MarketplaceCategory`. Enforces scheme constraints based on whether an item is `TECH`, `MEDIA`, or `CULINARY`. Data structures mapped from `types.ts`.
- **Delete (`App.tsx` -> `handleDeleteItem`)**: Allows irreversible item removal (soft-deletion is conceptualized utilizing the `ARCHIVED` status, while deleting is a hard wipe in state).
- **Search & Filter**: Real-time filtering leveraging `useMemo` to query against SKUs, names, Category associations, and current status.

### 3. Bulk Data Mutation
- **Bulk Actions (`BulkUploadModal.tsx`)**: A dedicated pipeline for mass uploading catalog items, optimizing data entry instead of individual form submissions.
- **Exporting**: Infrastructure (mocked) for downloading catalog queries as external documents.

### 4. System Administration
- **Maintenance Status**: Toggling `maintenanceMode` in settings emits a global alert and visually restrict typical flow, conceptualizing a system lockdown.

### 5. Relationship & Broadcast Control
- **Pipeline Management (`LeadManagement.tsx`)**: Sequential logic for moving inquiries from `INGESTION` through to `CONVERTED`.
- **Broadcast Execution (`NewsManagement.tsx`)**: Lightweight CRUD for operational updates and promotional data propagation.

## State & Routing
Navigation is managed via `react-router-dom`, providing a persistent URL-based state for deep-linking into specific inventory verticals or management modules. Core application state is situational, with functional modules handling their own lifecycle.
