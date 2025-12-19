# Firebase Storage Setup Instructions

## ⚠️ IMPORTANT: Image Upload Stuck on Loading?

This means Firebase Storage rules are NOT configured. Follow the steps below immediately.

## The Problem
Firebase Storage has restrictive default rules that **block all uploads**. You MUST configure the storage rules to allow authenticated users to upload images.

## Quick Fix (Do This NOW - Takes 2 Minutes!)

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: portfolio-a2172
3. **Navigate to Storage**:
   - Click "**Storage**" in the left sidebar
   - If Storage is not enabled, click "**Get Started**" and follow the prompts
   - Click on the "**Rules**" tab
4. **Replace the rules** with the following:

```
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload profile pictures
    match /avatars/{userId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
    
    // Allow authenticated users to upload project images
    match /projects/{userId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

5. **Click "Publish"**

## What These Rules Do

- **Read Access**: Anyone can view uploaded images (needed for public portfolio)
- **Write Access**: Only authenticated users can upload
- **User Isolation**: Users can only upload to their own folders
- **File Validation**:
  - Maximum file size: 5MB
  - Only image files allowed (image/*)

## Testing After Setup

1. Go to your admin dashboard: http://localhost:8082/admin/profile
2. Click "Upload Image"
3. Select an image from your device
4. The upload should now work successfully!

## Alternative: Deploy Rules via CLI (Optional)

If you have Firebase CLI installed:

```bash
firebase deploy --only storage
```

This will deploy the rules from the `storage.rules` file in your project.

## Troubleshooting

If uploads still don't work:

1. **Check Authentication**: Make sure you're logged in as admin
2. **Check Browser Console**: Open DevTools (F12) → Console tab → Look for errors
3. **Check Firebase Console**: Go to Storage → Files tab to see if files are being created
4. **Verify Storage is Enabled**: In Firebase Console → Storage, make sure the service is activated

## Security Notes

- These rules allow public read access for portfolio images
- Write access is restricted to authenticated users only
- Each user can only write to their own folder
- File size and type validation is enforced server-side
