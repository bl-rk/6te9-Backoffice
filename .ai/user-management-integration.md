# User Management Integration

Documentation for the Identity and Access Management (IAM) API integration.

## User Lifecycle States
Administrative users transition through the following states via the API:

| State | Description | API Status |
|-------|-------------|------------|
| **Active** | Full access to permitted modules | `active` |
| **Suspended** | Access temporarily revoked | `suspended` |
| **Pending** | Newly enrolled, awaiting first login | `pending` |

## Endpoints

### List Users
- **URL**: `/api/v1/auth/admin/users`
- **Method**: `GET`
- **Authorization**: Required (`SUPER_ADMIN`)

### Admin Enrolment (Create)
- **URL**: `/api/v1/auth/admin/users`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "string",
    "name": "string",
    "role": "admin" | "super_admin" | "manager" | "editor"
  }
  ```
- **Response**: 201 Created + User details

### Update Status
- **URL**: `/api/v1/auth/admin/users/{user_id}/status`
- **Method**: `PATCH`
- **Body**: `{ "status": "active" | "suspended" }`

### Delete User
- **URL**: `/api/v1/auth/admin/users/{user_id}`
- **Method**: `DELETE`
