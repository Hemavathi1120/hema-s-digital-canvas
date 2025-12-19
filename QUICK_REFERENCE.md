# 🚀 Admin Dashboard - Quick Reference

## Access URLs
```
Login:     http://localhost:5173/admin/login
Dashboard: http://localhost:5173/admin
Website:   http://localhost:5173
```

## First Time Setup (5 Steps)

### 1️⃣ Run Migration
Open Supabase SQL Editor → Paste and run:
```
supabase/migrations/20251219000000_create_admin_tables.sql
```

### 2️⃣ Create Admin User
Supabase → Authentication → Users → Add User
- Enter email and password
- Copy the User ID

### 3️⃣ Add to Admin Table
Supabase → Table Editor → admin_users → Insert Row
```sql
id: [paste-user-id]
email: your@email.com
full_name: Your Name
role: admin
```

### 4️⃣ Regenerate Types
```bash
supabase gen types typescript --linked > src/integrations/supabase/types.ts
```

### 5️⃣ Login
```bash
npm run dev
# Navigate to /admin/login
```

## File Structure
```
src/
├── components/admin/
│   ├── AdminLogin.tsx         # Login page
│   ├── ProtectedRoute.tsx     # Auth guard
│   └── AdminLayout.tsx        # Dashboard layout
├── pages/admin/
│   ├── AdminDashboard.tsx     # Overview
│   ├── AdminProfile.tsx       # Profile editor
│   ├── AdminProjects.tsx      # Projects CRUD
│   ├── AdminEducation.tsx     # Education CRUD
│   ├── AdminSkills.tsx        # Skills CRUD
│   ├── AdminLeadership.tsx    # Leadership CRUD
│   └── AdminAchievements.tsx  # Achievements CRUD
└── hooks/
    └── usePortfolioData.ts    # Data fetching hooks

supabase/migrations/
└── 20251219000000_create_admin_tables.sql  # Database schema
```

## Features Checklist
- ✅ Secure admin authentication
- ✅ Profile management
- ✅ Projects CRUD with tags & links
- ✅ Education timeline
- ✅ Skills with proficiency levels
- ✅ Leadership roles
- ✅ Achievements tracking
- ✅ Responsive design
- ✅ Real-time updates
- ✅ Toast notifications
- ✅ Loading states
- ✅ Confirmation dialogs
- ✅ Form validation

## Database Tables
```
profiles       → Personal info
projects       → Portfolio projects
education      → Educational background
skills         → Technical skills
leadership     → Leadership positions
achievements   → Awards & accomplishments
admin_users    → Admin authentication
```

## Common Tasks

### Add New Project
1. Go to /admin/projects
2. Click "Add Project"
3. Fill form → Save
4. ✅ Visible on homepage instantly

### Update Profile
1. Go to /admin/profile
2. Edit any field
3. Click "Save Changes"
4. ✅ Updated everywhere

### Manage Skills
1. Go to /admin/skills
2. Add/edit skills
3. Set proficiency (0-100%)
4. ✅ Skills section updates

### Track Leadership
1. Go to /admin/leadership
2. Add role details
3. List achievements
4. ✅ Leadership section populates

## Security
- 🔒 Admin-only routes
- 🔒 Row Level Security (RLS)
- 🔒 Session management
- 🔒 Protected API calls
- 🔒 Public read, admin write

## Troubleshooting

❌ **Can't Login**
- Check admin_users table has your user ID
- Verify email matches exactly

❌ **TypeScript Errors**
- Regenerate types: `supabase gen types typescript --linked`
- Restart dev server

❌ **Data Not Showing**
- Check migration ran successfully
- Verify RLS policies enabled
- Check browser console for errors

❌ **Changes Not Saving**
- Check Supabase connection
- Verify you're logged in
- Check for error toasts

## Quick Commands
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Generate Supabase types
supabase gen types typescript --linked > src/integrations/supabase/types.ts
```

## Environment Variables
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

## Admin Panel Navigation
```
Dashboard (/)           → Stats overview
Profile (/profile)      → Edit personal info
Projects (/projects)    → Manage projects
Education (/education)  → Education timeline
Skills (/skills)        → Technical skills
Leadership (/leadership) → Leadership roles
Achievements (/achievements) → Track accomplishments
```

## Data Flow
```
Admin Panel → Database → Frontend → User Sees Changes
   ↓            ↓           ↓            ↓
 Edit        Update      Fetch       Display
 Save        Sync        Refresh     Updated
```

## Tips & Best Practices
1. ✏️ Use order_index to control display order
2. 🌟 Mark important projects as featured
3. 🏷️ Add descriptive tags to projects
4. 📊 Be realistic with skill proficiency levels
5. 🔄 Keep content updated regularly
6. 💾 Save changes before navigating away
7. 🔍 Use preview to check changes
8. 📱 Test on mobile devices

## Support Resources
- 📚 [Full Documentation](./ADMIN_DASHBOARD.md)
- 🚀 [Setup Guide](./SETUP_ADMIN.md)
- 📝 [Implementation Summary](./IMPLEMENTATION_SUMMARY.md)
- 🔧 [Type Generation Notes](./TYPE_GENERATION_NOTE.md)

## Need Help?
1. Check Supabase dashboard for errors
2. Review browser console logs
3. Verify database migration success
4. Test authentication flow

---

**Remember:** After running the migration and creating your admin user, regenerate TypeScript types to clear all errors!

**Ready to use:** Login → Manage Content → See Changes Live! 🎉
