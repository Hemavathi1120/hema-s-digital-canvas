# Admin Dashboard Not Available - Troubleshooting Guide

## Current Status
✅ Admin user exists and is authenticated  
✅ Admin role is properly set in userRoles collection  
✅ User ID: TMcSz2E4JxcSHK38FFsyMk7CjV33  
✅ Email: saidhuhema11@gmail.com  

## Possible Issues & Solutions

### Issue 1: Firestore Security Rules Not Configured

**Symptom**: Cannot access admin dashboard, even though login succeeds.

**Solution**: Configure Firestore rules in Firebase Console

1. Go to: https://console.firebase.google.com/
2. Select project: **portfolio-a2172**
3. Navigate to: **Firestore Database** → **Rules** tab
4. Replace with rules from `firestore.rules` file
5. Click **Publish**

Quick rules (copy-paste to Firebase Console):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /userRoles/{roleId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Issue 2: Login Redirect Not Working

**Test Login**:
1. Open: http://localhost:8082/admin/login
2. Enter:
   - Email: `saidhuhema11@gmail.com`
   - Password: `1234567890`
3. Check browser console (F12) for errors

### Issue 3: Protected Route Not Loading

**Check Browser Console**:
- Open DevTools (F12)
- Look for errors in Console tab
- Common errors:
  - "Missing or insufficient permissions" → Firestore rules issue
  - "Network error" → Firebase config issue
  - Component errors → Check code

### Issue 4: Firebase Configuration

**Verify .env file** (if exists):
Check if Firebase config matches [src/integrations/firebase/config.ts](src/integrations/firebase/config.ts)

Current config:
- Project ID: portfolio-a2172
- Auth Domain: portfolio-a2172.firebaseapp.com

## Quick Tests

### Test 1: Verify Admin Status
```bash
npm run verify-admin
```
Should output: "Admin access verified!"

### Test 2: Check Browser Console
1. Open http://localhost:8082/admin/login
2. Press F12 to open DevTools
3. Go to Console tab
4. Try logging in
5. Look for any red errors

### Test 3: Check Network Tab
1. Open http://localhost:8082/admin/login
2. Press F12 → Network tab
3. Try logging in
4. Look for failed requests (red)
5. Check response codes

## Direct Access URLs

- Portfolio: http://localhost:8082/
- Admin Login: http://localhost:8082/admin/login
- Admin Dashboard: http://localhost:8082/admin
- Admin Profile: http://localhost:8082/admin/profile
- Admin Projects: http://localhost:8082/admin/projects

## Common Fixes

### Fix 1: Clear Browser Cache
```
1. Press Ctrl+Shift+Del
2. Clear "Cached images and files"
3. Clear "Cookies and site data"
4. Reload page
```

### Fix 2: Hard Reload
```
Ctrl+Shift+R (Windows)
Cmd+Shift+R (Mac)
```

### Fix 3: Check if Logged In
Open browser console and run:
```javascript
firebase.auth().currentUser
```
Should show user object if logged in.

## What to Report Back

If still not working, please provide:
1. Any error messages from browser console (F12)
2. Screenshot of the page you're seeing
3. URL you're trying to access
4. What happens when you click login
