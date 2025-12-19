# Admin Dashboard - Quick Setup Guide

## Step 1: Apply Database Migration

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Copy the contents of `supabase/migrations/20251219000000_create_admin_tables.sql`
4. Paste and run the migration
5. Verify all tables are created in **Table Editor**

## Step 2: Create Your Admin Account

### Option A: Using Supabase Dashboard

1. Go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter your email and password
4. Copy the **User UID** from the users list
5. Go to **Table Editor** → **admin_users**
6. Click **Insert** → **Insert row**
7. Fill in:
   - `id`: Paste the User UID
   - `email`: Your admin email
   - `full_name`: Your name
   - `role`: admin
8. Save

### Option B: Using SQL

```sql
-- First create the auth user (use Supabase Auth UI instead)
-- Then run this with the user's UUID:

INSERT INTO admin_users (id, email, full_name, role)
VALUES ('paste-user-uuid-here', 'your-email@example.com', 'Your Name', 'admin');
```

## Step 3: Test Your Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:5173/admin/login`

3. Login with your admin credentials

4. You should see the admin dashboard!

## Step 4: Populate Initial Data

The migration already includes sample data for:
- ✅ Default profile
- ✅ 3 sample projects
- ✅ 3 education entries

You can now:
1. Go to `/admin/profile` and update your information
2. Edit or delete the sample projects
3. Add your real education, skills, leadership, and achievements

## Environment Check

Make sure your `.env` file contains:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
```

## Troubleshooting

### "Unauthorized: Not an admin user"
- Make sure you added your user ID to the `admin_users` table
- Verify the email matches exactly
- Try logging out and back in

### "Cannot read properties of null"
- Ensure the migration ran successfully
- Check that RLS policies were created
- Verify Supabase connection in browser console

### Tables not found
- Re-run the migration SQL
- Check for any error messages in Supabase SQL Editor
- Verify you're connected to the correct Supabase project

## Next Steps

Once logged in, you can:
- ✏️ Update your profile information
- 📁 Manage your projects
- 🎓 Add your education history
- 💻 List your technical skills
- 🏆 Document your leadership roles
- ⭐ Track your achievements

## Security Notes

- Never commit your `.env` file
- Use strong passwords for admin accounts
- Only give admin access to trusted users
- Regularly review the `admin_users` table

## Need Help?

Check the full documentation in `ADMIN_DASHBOARD.md` for:
- Detailed feature descriptions
- Data structure reference
- Advanced configuration
- API usage examples
