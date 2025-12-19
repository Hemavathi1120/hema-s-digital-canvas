# Firebase Admin Setup - Quick Guide

## Admin Credentials

**Email:** `saidhuhema11@gmail.com`  
**Password:** `1234567890`

## Setup Instructions

### Option 1: Using Firebase Console (Recommended)

#### Step 1: Create User in Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **portfolio-a2172**
3. Navigate to **Authentication** → **Users**
4. Click **Add user**
5. Enter:
   - **Email:** `saidhuhema11@gmail.com`
   - **Password:** `1234567890`
6. Click **Add user**
7. **Copy the User UID** (you'll need this)

#### Step 2: Create Admin Role in Firestore

1. In Firebase Console, navigate to **Firestore Database**
2. Click **Start collection** (if first time) or click **+ Start collection**
3. **Collection ID:** `userRoles`
4. Click **Next**
5. **Document ID:** Click **Auto-ID**
6. Add fields:
   - Field: `userId` | Type: `string` | Value: `[Paste the User UID from Step 1]`
   - Field: `role` | Type: `string` | Value: `admin`
   - Field: `createdAt` | Type: `timestamp` | Value: `[Current timestamp]`
7. Click **Save**

#### Step 3: Login to Admin Dashboard

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to: http://localhost:5173/admin/login

3. Login with:
   - **Email:** `saidhuhema11@gmail.com`
   - **Password:** `1234567890`

---

### Option 2: Using Script (Automated)

If you have TypeScript configured to run scripts:

```bash
# Install tsx for running TypeScript
npm install -D tsx

# Run the setup script
npx tsx setup-admin.ts
```

This will automatically:
- ✅ Create user in Firebase Authentication
- ✅ Assign admin role in Firestore
- ✅ Display login credentials

---

## Troubleshooting

### "Email already in use"
- User already exists in Firebase Authentication
- Just proceed to Step 2 to add admin role in Firestore
- Make sure to use the correct User UID

### "Permission denied" when logging in
- Check that userRoles collection has a document with:
  - `userId` matching the authenticated user's UID
  - `role` set to `"admin"`

### "User not authenticated"
- Clear browser cache and cookies
- Try logging out and back in
- Check Firebase Console → Authentication to verify user exists

### Cannot access Firestore
- Ensure Firestore is enabled in Firebase Console
- Check Security Rules allow authenticated users to read userRoles
- Verify collection name is exactly `userRoles` (case-sensitive)

---

## Firestore Security Rules

Make sure these rules are set in Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
        exists(/databases/$(database)/documents/userRoles/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/userRoles/$(request.auth.uid)).data.role == 'admin';
    }
    
    // User Roles
    match /userRoles/{roleId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // All other collections
    match /{document=**} {
      allow read: if true;
      allow write: if isAuthenticated();
    }
  }
}
```

---

## Quick Links

- **Firebase Console:** https://console.firebase.google.com/project/portfolio-a2172
- **Authentication:** https://console.firebase.google.com/project/portfolio-a2172/authentication/users
- **Firestore:** https://console.firebase.google.com/project/portfolio-a2172/firestore
- **Admin Login:** http://localhost:5173/admin/login

---

## Next Steps After Setup

1. ✅ Verify login works
2. ✅ Test creating a project in admin dashboard
3. ✅ Check data appears in Firestore Console
4. ✅ Update remaining admin pages to use Firebase (see FIREBASE_MIGRATION_GUIDE.md)

---

## Security Notes

⚠️ **Important:** For production:
1. Change the password to something more secure
2. Enable 2FA on Firebase Console
3. Review and restrict Firestore Security Rules
4. Never commit credentials to Git
5. Use environment variables for sensitive data
