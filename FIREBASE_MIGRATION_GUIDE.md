# Firebase Migration - Admin Pages Update Guide

## ✅ Already Migrated

The following files have been successfully migrated to Firebase:

1. **Firebase Configuration** (`src/integrations/firebase/config.ts`)
2. **Firebase Types** (`src/integrations/firebase/types.ts`)
3. **Firebase Services** (`src/integrations/firebase/services.ts`)
4. **ProtectedRoute** (`src/components/admin/ProtectedRoute.tsx`)
5. **AdminLogin** (`src/components/admin/AdminLogin.tsx`)
6. **AdminLayout** (`src/components/admin/AdminLayout.tsx`)

## 📋 Remaining Files to Update

The following admin pages need to be updated to use Firebase services. Here's how to update each one:

### Pattern for Updating Admin Pages

Replace Supabase imports and operations with Firebase equivalents:

**Before (Supabase):**
```typescript
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

const fetchData = async () => {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("display_order");
  if (error) throw error;
  setData(data);
};
```

**After (Firebase):**
```typescript
import { projectsService } from "@/integrations/firebase/services";
import type { Project } from "@/integrations/firebase/types";

const fetchData = async () => {
  const data = await projectsService.getAll();
  setData(data);
};
```

## Files That Need Manual Updates

### 1. AdminProjects.tsx
- Replace: `supabase` → `projectsService`
- Replace: `Tables<"projects">` → `Project` type
- Update all CRUD operations to use `projectsService` methods

### 2. AdminEducation.tsx
- Replace: `supabase` → `educationService`
- Replace: `Tables<"education">` → `Education` type
- Update all CRUD operations

### 3. AdminSkills.tsx
- Replace: `supabase` → `skillsService`
- Replace: `Tables<"skills">` → `Skill` type
- Update all CRUD operations

### 4. AdminLeadership.tsx
- Replace: `supabase` → `experiencesService`
- Replace: `Tables<"experiences">` → `Experience` type
- Add filter: `experiencesService.getAll('leadership')`
- Update all CRUD operations

### 5. AdminAchievements.tsx
- Replace: `supabase` → `achievementsService`
- Replace: `Tables<"achievements">` → `Achievement` type
- Update all CRUD operations

### 6. AdminProfile.tsx
- Replace: `supabase` → `profilesService`
- Replace: `Tables<"profiles">` → `Profile` type
- Use `profilesService.getCurrent()` to get profile
- Use `profilesService.update()` to update

### 7. AdminDashboard.tsx
- Import all services
- Update all data fetching to use Firebase services
- Update counts and statistics

### 8. usePortfolioData.ts (hooks)
- Replace all Supabase queries with Firebase service calls
- Remove React Query if using Firebase's real-time listeners

## Firebase Service API Reference

### Projects Service
```typescript
// Get all projects
const projects = await projectsService.getAll();

// Get single project
const project = await projectsService.getById(id);

// Create project
const id = await projectsService.create({
  title: "My Project",
  description: "Description",
  techStack: ["React", "TypeScript"],
  isFeatured: false,
  githubUrl: "",
  liveUrl: "",
  imageUrl: "",
  displayOrder: 0,
  longDescription: "",
});

// Update project
await projectsService.update(id, {
  title: "Updated Title",
  isFeatured: true,
});

// Delete project
await projectsService.delete(id);
```

### Education Service
```typescript
const education = await educationService.getAll();
const id = await educationService.create(data);
await educationService.update(id, data);
await educationService.delete(id);
```

### Experiences Service (Leadership)
```typescript
// Get all leadership experiences
const leadership = await experiencesService.getAll('leadership');

// Get all work experiences
const work = await experiencesService.getAll('work');

// Get all experiences
const all = await experiencesService.getAll();

const id = await experiencesService.create({
  title: "President",
  organization: "Club",
  description: "Led the club",
  startDate: "2023-01",
  endDate: "2024-01",
  isCurrent: false,
  type: "leadership",
  displayOrder: 0,
});
```

### Skills Service
```typescript
const skills = await skillsService.getAll();
const id = await skillsService.create(data);
await skillsService.update(id, data);
await skillsService.delete(id);
```

### Achievements Service
```typescript
const achievements = await achievementsService.getAll();
const id = await achievementsService.create(data);
await achievementsService.update(id, data);
await achievementsService.delete(id);
```

### Profile Service
```typescript
// Get current user's profile
const profile = await profilesService.getCurrent();

// Update profile (creates if doesn't exist)
await profilesService.update({
  fullName: "John Doe",
  email: "john@example.com",
  tagline: "Developer",
  bio: "I build things",
  // ... other fields
});
```

## Setting Up Firebase Database

### 1. Create Collections in Firebase Console

Go to Firebase Console → Firestore Database → Start Collection

Create these collections:
- `profiles`
- `projects`
- `education`
- `experiences`
- `skills`
- `achievements`
- `userRoles`
- `siteSettings`

### 2. Create Admin User

1. **Firebase Console → Authentication**
   - Add user with email/password
   - Copy User UID

2. **Firebase Console → Firestore → userRoles**
   - Add document:
     ```json
     {
       "userId": "paste-user-uid-here",
       "role": "admin",
       "createdAt": [timestamp]
     }
     ```

### 3. Set Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user is admin
    function isAdmin() {
      return isAuthenticated() && 
        exists(/databases/$(database)/documents/userRoles/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/userRoles/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Helper function to check if user owns the document
    function isOwner() {
      return isAuthenticated() && 
        request.auth.uid == resource.data.userId;
    }
    
    // User Roles - only admins can write
    match /userRoles/{document} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // Profiles - users can only access their own
    match /profiles/{document} {
      allow read: if true; // Public read for portfolio display
      allow create: if isAuthenticated();
      allow update, delete: if isOwner() || isAdmin();
    }
    
    // Projects - users can only manage their own
    match /projects/{document} {
      allow read: if true; // Public read
      allow create: if isAuthenticated();
      allow update, delete: if isOwner() || isAdmin();
    }
    
    // Education
    match /education/{document} {
      allow read: if true;
      allow create: if isAuthenticated();
      allow update, delete: if isOwner() || isAdmin();
    }
    
    // Experiences
    match /experiences/{document} {
      allow read: if true;
      allow create: if isAuthenticated();
      allow update, delete: if isOwner() || isAdmin();
    }
    
    // Skills
    match /skills/{document} {
      allow read: if true;
      allow create: if isAuthenticated();
      allow update, delete: if isOwner() || isAdmin();
    }
    
    // Achievements
    match /achievements/{document} {
      allow read: if true;
      allow create: if isAuthenticated();
      allow update, delete: if isOwner() || isAdmin();
    }
    
    // Site Settings - only admins
    match /siteSettings/{document} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

## Testing the Migration

1. **Start development server:**
   ```bash
   npm run dev
   ```

2. **Test login:**
   - Navigate to http://localhost:5173/admin/login
   - Login with Firebase credentials

3. **Test CRUD operations:**
   - Create, edit, and delete projects
   - Verify data persists in Firebase Console

4. **Check Firebase Console:**
   - Firestore → Data should appear
   - Authentication → User sessions

## Troubleshooting

### "User not authenticated" errors
- Check if user is logged in to Firebase
- Verify `auth.currentUser` is not null
- Check browser console for auth errors

### Permission denied errors
- Review Firestore Security Rules
- Ensure user has correct role in `userRoles` collection
- Check userId matches in documents

### Data not showing
- Verify collections exist in Firestore
- Check userId filtering in queries
- Review Firebase Console for actual data

## Completion Checklist

- [ ] Update AdminProjects.tsx
- [ ] Update AdminEducation.tsx
- [ ] Update AdminSkills.tsx
- [ ] Update AdminLeadership.tsx
- [ ] Update AdminAchievements.tsx
- [ ] Update AdminProfile.tsx
- [ ] Update AdminDashboard.tsx
- [ ] Update usePortfolioData.ts hook
- [ ] Set up Firestore Security Rules
- [ ] Create admin user in Firebase
- [ ] Test all CRUD operations
- [ ] Verify data persistence
- [ ] Test authentication flow

## Next Steps

After completing the migration:
1. Remove Supabase dependencies: `npm uninstall @supabase/supabase-js`
2. Remove Supabase integration folder
3. Update environment variables (remove Supabase, keep Firebase)
4. Deploy to production with Firebase configuration

Would you like me to proceed with updating all the remaining admin pages automatically?
