# Firebase Setup

1. Create a Firebase project.
2. Enable Authentication providers:
   - Email/password
   - Google, if you want Google login
3. Create a Firestore database.
4. Copy `.env.local.example` to `.env.local`.
5. Paste your Firebase web app config into `.env.local`.
6. Restart the dev server with `npm run dev`.

The app automatically creates these Firestore collections when empty:

- `products`
- `orders`

Admin access is currently controlled by email in `src/context/AuthContext.js`.
Change the admin email from `admin@nomiki.com` to your client's real admin email.

Suggested starter Firestore rules for testing:

```txt
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /orders/{orderId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

Before production, tighten the write rules to only allow your admin users.
