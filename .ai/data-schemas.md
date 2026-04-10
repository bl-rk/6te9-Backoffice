# Data Schemas

Documentation of the core data structures used across the 6te9 Admin Panel.

## 1. Inventory & Products
Unified structure for all marketplace verticals using a base interface and specialized extensions.

### Base Item
| Field | Type | Description |
|---|---|---|
| `id` | `uuid` | Unique identifier |
| `name` | `string` | Display name |
| `sku` | `string` | Stock Keeping Unit |
| `price` | `number` | Base price in NGN |
| `status` | `enum` | `DRAFT`, `PUBLISHED`, `ARCHIVED` |
| `baseCategory` | `ENUM` | tech, Media, Culinary |
| `images` | `array` | List of Image URLs | nullable
| `isOffer` | `boolean` | Promotional flag |
| `audit` | `object` | Timestamps and actor tracking | 

### Vertical Specializations
Detailed mapping of unique attributes per marketplace vertical.

#### TECH (Technological Hardware)
| Field | Type | Description |
|---|---|---|
| `condition` | `enum` | `New`, `Refurbished`, `Used`, `For Parts` |
| `brand` | `string` | Manufacturer |
| `screenSize`| `number`| Diagonal size (if applicable) |
| `warranty` | `object`| `hasWarranty` (bool) |
| `specs` | `map` | Performance metrics (RAM, GPU, Storage, etc.) | json or best to store keypairs

#### MEDIA (Creative & Print Services)
| Field | Type | Description |
|---|---|---|
| `subType` | `string` | e.g. Branding, Print, Digital |
| `material` | `string` | Primary substrate used |
| `finish` | `string` | e.g. Matte, Glossy, UV |
| `dimensions`| `object` | `length`, `width`, `height` |
| `leadTime` | `number` | Production turnaround in days |
| `moq` | `number` | Minimum Order Quantity |

#### CULINARY (Food & Beverage)
| Field | Type | Description |
|---|---|---|
| `cuisineType`| `string` | e.g. Nigerian, Intercontinental |
| `dietaryTags`| `array` | e.g. Vegan, Halal, Gluten-Free |
| `spiceLevel` | `enum` | `None` to `Extra Hot` |
| `shelfLife` | `string` | Duration before expiry |
| `ingredients`| `array` | Composition list |

---

## 2. Personnel & Identity
Role-based access control and security lifecycle.

| Field | Type | Description |
|---|---|---|
| `id` | `uuid` | Unique identifier |
| `email` | `string` | Corporate address |
| `name` | `string` | Legal full name |
| `role` | `enum` | `SUPER_ADMIN`, `ADMIN`, `MANAGER`, `EDITOR` |
| `status` | `enum` | `PENDING`, `ACTIVE`, `SUSPENDED` |
| `dateAdded` | `iso8601` | Enrollment timestamp |

---

## 3. Relationship Management (Leads)
Kanban-driven pipeline for cross-vertical prospects.

| Field | Type | Description |
|---|---|---|
| `id` | `uuid` | Unique identifier |
| `mobile` | `string` | International format |
| `email` | `string` | Lead contact point |
| `brand` | `enum` | `MON BIENS`, `TECH`, `MEDIA`, `BLXRK` |
| `stage` | `enum` | `INGESTION`, `CONTACTED`, `FOLLOW_UP`, `CONVERTED`, `LOST` |
| `info` | `text` | Interaction notes |

---

## 4. Broadcasts (News & Offers)
Global propagation engine for promotional content.

| Field | Type | Description |
|---|---|---|
| `id` | `uuid` | Unique identifier |
| `title` | `string` | Short catchphrase |
| `offerInfo` | `text` | Detailed terms or news content |
| `validityPeriod`| `string` | Expiry or duration |

---

## 5. Integrations (WhatsApp Business)
Multi-account Meta API configuration.

| Field | Type | Description |
|---|---|---|
| `id` | `brand` | Associated vertical |
| `name` | `string` | Friendly display name |
| `phone` | `string` | Verified business number |
| `apiKey` | `string` | Meta API Bearer Token |
| `status` | `enum` | `connected`, `disconnected`, `pending` |
| `lastSync`| `string` | Heartbeat timestamp |
