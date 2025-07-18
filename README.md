📘 Documentation: Next.js Administration Hub

---

📁 Database Structure

The MongoDB cluster is divided into **three logical databases** (default names below, but these can be changed):

1. **Management Units** (`admin-management`)

This database manages the hierarchical structure and access levels:

- **Level 1 - Applications**  
  Collection: `applications`  
  Schema: `_id(ObjectId), name: string, icon: string (path to icon)`

- **Level 2 - Entities**  
  Collection: `entities`  
  Schema: `_id(ObjectId), name: string, applicationId: ObjectId, settings?: object`

- **Level 3 - Accounts**  
  Collection: `accounts`  
  Schema: `_id(ObjectId), name: string, entityId: ObjectId, settings?: object`

> 📌 If you change collection names like `applications`, `entities`, or `accounts`, you must rename the corresponding route folders in `app/applications/[applicationId]/entities/[entityId]/accounts/[accountId]/`.

> 📌 Similarly, if you change reference key names like `applicationId`, `entityId`, or `accountId`, update their uses in routes and database references accordingly.

2. **Resource Units** (`admin-resource`)

Handles application-specific resources. Each resource links to `applicationId`, `entityId`, and `accountId`.

**Resource Setup**:
- Resources follow the route structure:
  ```
  app/applications/[applicationId]/entities/[entityId]/accounts/[accountId]/resources-[slug]
  ```

To create a new resource:
```bash
npm run create-collection -- <collectionName>
```

Then add a top-level key matching `<collectionName>` inside `resourceConfig.ts` under `app/_app-configs/<appName>`, inside `appResourceFields`.

Each field follows this structure:
```ts
fieldName: {
  type: "text" | "email" | "password" | "select" | ...,
  id: string,
  name: string,
  labelName: string,
  options?: [{ value: string, content: string }]
}
```

Conditional fields:
```ts
conditionalFields: [
  {
    when: { field: string, value: string },
    fields: { ... }
  }
]
```

3. **Authentication Units** (`admin-authentication`)

Handles user verification workflows. Currently includes:
- `verification-token`: Stores tokens for new user registration verification.

---

🚀 Application Setup Guide

### 1. Create Required Accounts:
- MongoDB Atlas (Add your IP to whitelist!)
- Resend (Email service)
- Upstash (Redis service)

### 2. Clone the Repository:
```bash
git clone <repo-url>
cd <project-dir>
npm install
```

### 3. Configure Environment Variables:
Create `.env.local` in the root folder:
```env
MONGODB_URI=<your-mongodb-uri>
RESEND_API_KEY=<your-resend-key>
UPSTASH_REDIS_REST_URL=<url>
UPSTASH_REDIS_REST_TOKEN=<token>
AUTH_SECRET=<generate using `npx auth secret`>
INITIAL_APP_NAME=
INITIAL_USER_EMAIL=
INITIAL_USER_NAME=
INITIAL_USER_PASSWORD=
INITIAL_APP_ICON=
```

### 4. Configure Constants:

#### File: `app/_constants/mongodb-config.ts`
```ts
export const DB_MANAGEMENT_NAME = "admin-management"
export const DB_RESOURCES_NAME = "admin-resource"
export const DB_AUTHENTICATION_NAME = "admin-authentication"

export const DB_COLLECTION_LEVEL_1 = "applications"
export const DB_COLLECTION_LEVEL_2 = "entities"
export const DB_COLLECTION_LEVEL_3 = "accounts"

export const DB_REFERENCE_TO_COL_1 = "applicationId"
export const DB_REFERENCE_TO_COL_2 = "entityId"
export const DB_REFERENCE_TO_COL_3 = "accountId"

export const DB_COLLECTION_RESOURCE = "resources"
```

#### File: `app/_constants/form-names.ts`
```ts
export const USERS_COLLECTION = "users"
export const OTHER_COLLECTION = "..." (optional)
```

### 5. Run Initial Setup:
```bash
npm run setup-data
```

### 6. Add More Resources (optional):
```bash
npm run create-collection -- drivers
```
Update `form-names.ts` accordingly. (optional)

### 7. Configure Application Files:
- `app/_app-configs/<appName>/resourceConfig.ts`
- `app/_app-configs/<appName>/settingsConfig.ts`
- `app/_app-configs/<appName>/restrictions.ts`

### 8. Run Application:
```bash
npm run dev
```

---

🧩 Configuration Files

### 1. `resourceConfig.ts`
Defines schemas for each resource collection.
```ts
export const appResourceFields = {
  users: {
    username: {
      type: "text",
      id: "username",
      name: "username",
      labelName: "Username",
    },
    role: {
      type: "select",
      id: "role",
      name: "role",
      labelName: "Role",
      options: [{ value: "admin", content: "Admin" }]
    }
  },
  conditionalFields: [
    {
      when: { field: "role", value: "admin" },
      fields: {
        adminCode: {
          type: "text",
          name: "adminCode",
          id: "adminCode",
          labelName: "Admin Code"
        }
      }
    }
  ]
}
```

### 2. `settingsConfig.ts`
Defines settings schemas for `entities` or `accounts`:
```ts
export const settingsConfig = {
  accounts: {
    maxUsers: {
      type: "number",
      name: "maxUsers",
      id: "maxUsers",
      labelName: "Maximum Users"
    }
  }
}
```

### 3. `restrictions.ts`
Applies dynamic access restrictions:
```ts
export function getRestrictions(collectionName, settings, resourcesArr) {
  if (settings.maxUsers && resourcesArr.length >= settings.maxUsers) {
    return {
      isRestricted: true,
      restrictedMessage: "User limit exceeded."
    };
  }
  return { isRestricted: false };
}
```

---

👤 **User Access Control**

The `users` collection in `admin-resource` is **mandatory**.
- Registration logic is defined in `_config/formConfigs.ts > registrationFormFields`
- Fields must align with `users` key inside `resourceConfig.ts` for the respective app.

---

🎨 **Management Icons**

- Upload icons to the `public/` folder.
- File names must match `icon` field value in the `applications` collection.

---

✅ You now have a complete administration hub using Next.js and MongoDB with hierarchical access, dynamic forms, and extensible configuration.
