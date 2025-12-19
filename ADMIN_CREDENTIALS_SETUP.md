# Admin Dashboard Login Credentials Setup

## Your Supabase Project Details

**Project URL:** https://qeivnosekixlkyikyymo.supabase.co  
**Project ID:** qeivnosekixlkyikyymo

---

## How to Get/Create Admin Credentials

### Step 1: Access Supabase Console

1. Go to: **https://supabase.com/dashboard**
2. Sign in to your Supabase account
3. Open your project: **qeivnosekixlkyikyymo**

---

### Step 2: Check for Existing Users

1. In Supabase Dashboard, click **Authentication** (left sidebar)
2. Click **Users** tab
3. **See if any users exist**

#### If Users Exist:
- Note down an existing user's **email** and **User UID**
- Skip to Step 3 to make them admin

#### If No Users Exist:
- Continue to create a new admin user below

---

### Step 3: Create New Admin User

1. In **Authentication** → **Users**, click **Add user** button
2. Select **Create new user**
3. Fill in:
   - **Email:** `admin@yourdomain.com` (or your email)
   - **Password:** Choose a strong password (e.g., `Admin@123456`)
   - **Auto Confirm User:** ✅ Check this box
4. Click **Create user**
5. **Copy the User UID** from the user list

---

### Step 4: Grant Admin Role

1. In Supabase Dashboard, click **Table Editor** (left sidebar)
2. Find and click **user_roles** table
3. Click **Insert** → **Insert row**
4. Fill in the form:
   - **user_id:** Paste the User UID you copied
   - **role:** Select **"admin"** from dropdown
   - Leave other fields as default
5. Click **Save**

---

### Step 5: Login to Admin Dashboard

Now you can login with these credentials:

**Admin Dashboard URL:** http://localhost:5173/admin/login

**Credentials:**
- **Email:** The email you created (e.g., `admin@yourdomain.com`)
- **Password:** The password you set (e.g., `Admin@123456`)

---

## Quick SQL Method (Alternative)

If you prefer SQL, you can run this in **SQL Editor**:

### 1. Create Auth User First (Use Dashboard UI)

### 2. Then Run This SQL:

```sql
-- Replace 'USER_UUID_HERE' with the actual User UID from Auth
-- Replace 'admin@yourdomain.com' with your admin email

-- Grant admin role
INSERT INTO user_roles (user_id, role)
VALUES ('USER_UUID_HERE', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

---

## Example Admin Credentials Template

After setup, your credentials will be:

```
URL: http://localhost:5173/admin/login
Email: admin@yourdomain.com
Password: [Your chosen password]
```

---

## Troubleshooting

### "Invalid login credentials"
- ✅ Check email and password are correct
- ✅ Verify user exists in Authentication → Users
- ✅ Make sure "Email confirmed" is checked

### "Access denied" or redirects to login
- ✅ Check user_roles table has entry for your user
- ✅ Verify role is set to "admin" (not "user")
- ✅ Check User UID matches between Auth and user_roles

### Cannot access Supabase Dashboard
- ✅ Go to https://supabase.com/dashboard
- ✅ Sign in with your Supabase account
- ✅ Select project: qeivnosekixlkyikyymo

---

## Production Deployment

When deploying to production:

1. Create production admin user in production Supabase
2. Use strong, unique passwords
3. Never commit credentials to Git
4. Use environment variables for sensitive data

---

## Quick Access Links

- **Supabase Dashboard:** https://supabase.com/dashboard/project/qeivnosekixlkyikyymo
- **Authentication:** https://supabase.com/dashboard/project/qeivnosekixlkyikyymo/auth/users
- **Table Editor:** https://supabase.com/dashboard/project/qeivnosekixlkyikyymo/editor
- **SQL Editor:** https://supabase.com/dashboard/project/qeivnosekixlkyikyymo/sql

---

## Security Best Practices

1. ✅ Use strong passwords (min 12 characters, mixed case, numbers, symbols)
2. ✅ Don't share credentials publicly
3. ✅ Enable 2FA on your Supabase account
4. ✅ Regularly rotate passwords
5. ✅ Monitor user access in Auth logs
