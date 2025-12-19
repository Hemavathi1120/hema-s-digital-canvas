# Admin Dashboard - Setup Guide (Updated)

## Overview

The admin dashboard has been configured to work with your **existing Supabase database schema**. No new database migration is required!

## Prerequisites

- Existing Supabase project with portfolio database
- Authenticated user account
- Admin role assigned in `user_roles` table

## Step 1: Verify Database Schema

Your existing database should have these tables:
- ✅ `achievements` - Portfolio achievements
- ✅ `education` - Educational background
- ✅ `experiences` - Work/leadership experiences (includes type field for filtering)
- ✅ `profiles` - User profile information
- ✅ `projects` - Portfolio projects
- ✅ `site_settings` - Website configuration
- ✅ `skills` - Technical skills
- ✅ `user_roles` - User authentication (with role: "admin" or "user")

## Step 2: Create Admin User

### Option A: Using Supabase Dashboard

1. **Create Authentication User**
   - Go to **Authentication** → **Users** in Supabase dashboard
   - Click **Add user** → **Create new user**
   - Enter email and password
   - Copy the **User UID**

2. **Assign Admin Role**
   - Go to **Table Editor** → **user_roles**
   - Click **Insert** → **Insert row**
   - Fill in:
     * `user_id`: Paste the User UID
     * `role`: Select "admin" from dropdown
   - Save

### Option B: Using SQL

```sql
-- After creating auth user in Supabase Auth UI, run:
INSERT INTO user_roles (user_id, role)
VALUES ('paste-user-uuid-here', 'admin');
```

## Step 3: Environment Variables

Ensure your `.env.local` or `.env` file has:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Step 4: Install Dependencies

```bash
npm install
```

## Step 5: Start Development Server

```bash
npm run dev
```

## Step 6: Access Admin Dashboard

1. Navigate to `http://localhost:5173/admin/login`
2. Sign in with your admin credentials
3. You should be redirected to the dashboard

## Available Admin Pages

- **Dashboard** (`/admin`) - Overview with statistics
- **Profile** (`/admin/profile`) - Manage personal profile
- **Projects** (`/admin/projects`) - CRUD for portfolio projects
- **Education** (`/admin/education`) - Manage educational background
- **Skills** (`/admin/skills`) - Manage technical skills
- **Leadership** (`/admin/leadership`) - Manage leadership experiences
- **Achievements** (`/admin/achievements`) - Track achievements

## Database Schema Notes

### Key Field Names (Existing Schema)

All tables use:
- `display_order` (not order_index) - For ordering items
- `is_current` (not current) - For ongoing education/experiences
- `is_featured` (not featured) - For featured projects
- `user_id` - Required on all inserts (multi-user support)

### Projects Table
- `tech_stack` (string array) - Technologies used
- `is_featured` (boolean) - Featured project flag
- `display_order` (number) - Display order

### Education Table
- `field_of_study` (not field) - Major/specialization
- `start_year` / `end_year` (numbers, not dates) - Year format
- `is_current` (boolean) - Currently studying

### Experiences Table
- `type` field - Used to filter leadership vs work experiences
- `is_current` (boolean) - Current position
- Leadership entries use `type = 'leadership'`

### Achievements Table
- `certificate_url` - Link to certificate
- `image_url` - Achievement image
- `date` (string) - Date achieved
- No category or icon fields

## Troubleshooting

### Cannot Login
- Verify user exists in Supabase Auth
- Check `user_roles` table has entry with `role = 'admin'`
- Ensure environment variables are correct

### "User not authenticated" errors
- Check browser console for auth errors
- Verify Supabase RLS policies allow authenticated users
- Try logging out and back in

### TypeScript errors
- Run `npm run type-check` to verify
- Regenerate types if needed: See TYPE_GENERATION_NOTE.md

### Data not showing
- Check browser Network tab for API errors
- Verify RLS policies in Supabase
- Ensure `user_id` matches authenticated user

## Security Reminders

1. **Row Level Security (RLS)** is enabled on all tables
2. Users can only access their own data (filtered by `user_id`)
3. Admin pages are protected - require authentication
4. Sensitive operations require admin role

## Next Steps

1. Customize the dashboard to your needs
2. Add more fields if required
3. Update frontend components to display admin-managed content
4. Deploy to production with environment variables

## Support

For issues or questions:
1. Check existing documentation (ADMIN_DASHBOARD.md, QUICK_REFERENCE.md)
2. Review Supabase logs in dashboard
3. Check browser console for client-side errors
