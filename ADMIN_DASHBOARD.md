# Admin Dashboard Documentation

## Overview

This is a comprehensive admin dashboard for managing your portfolio website. All content can be dynamically managed through a secure admin interface without touching the code.

## Features

### 🔐 Authentication
- Secure admin login with email/password
- Protected routes with automatic authentication checks
- Session management with Supabase Auth

### 📊 Dashboard
- Overview of all portfolio sections
- Quick stats for projects, education, skills, leadership, and achievements
- Quick action buttons for common tasks

### 👤 Profile Management
- Edit personal information (name, title, bio)
- Manage contact information
- Update social media links
- Upload avatar and resume

### 💼 Projects Management
- Full CRUD operations (Create, Read, Update, Delete)
- Add project details:
  - Title and description
  - Tags (multiple)
  - GitHub and live URLs
  - Featured status
  - Custom color gradients
  - Order management
- Visual project cards with edit/delete actions

### 🎓 Education Management
- Add/edit educational qualifications
- Track current studies
- Include grades and descriptions
- Order entries chronologically

### 💻 Skills Management
- Organize skills by category (Frontend, Backend, Tools, Other)
- Set proficiency levels (0-100%)
- Visual progress bars
- Custom icons support

### 🏆 Leadership Management
- Document leadership roles and positions
- Track current and past positions
- Add multiple achievements per role
- Include organization details

### ⭐ Achievements Management
- Track accomplishments and awards
- Categorize achievements
- Date-based organization
- Custom icons for each achievement

## Getting Started

### 1. Database Setup

Run the migration file to create all necessary tables:

```bash
# The migration file is located at:
supabase/migrations/20251219000000_create_admin_tables.sql
```

This creates:
- `profiles` - Your personal information
- `projects` - Portfolio projects
- `education` - Educational background
- `skills` - Technical skills
- `leadership` - Leadership roles
- `achievements` - Accomplishments
- `admin_users` - Admin authentication

### 2. Create Admin User

In your Supabase dashboard:

1. Go to Authentication → Users
2. Create a new user with email/password
3. Copy the user's UUID
4. Go to Table Editor → admin_users
5. Insert a new row:
   ```sql
   INSERT INTO admin_users (id, email, full_name, role)
   VALUES ('user-uuid-here', 'admin@example.com', 'Admin Name', 'admin');
   ```

### 3. Access Admin Panel

Navigate to:
```
http://localhost:5173/admin/login
```

Login with your admin credentials.

## Admin Routes

- `/admin/login` - Admin login page
- `/admin` - Dashboard overview
- `/admin/profile` - Profile settings
- `/admin/projects` - Manage projects
- `/admin/education` - Manage education
- `/admin/skills` - Manage skills
- `/admin/leadership` - Manage leadership
- `/admin/achievements` - Manage achievements

## Security Features

### Row Level Security (RLS)
All tables have RLS enabled with policies:
- **Public read access** - Anyone can view your portfolio
- **Admin write access** - Only authenticated admins can modify data

### Authentication Flow
1. User logs in with email/password
2. System checks if user exists in `admin_users` table
3. If not admin, access is denied and user is logged out
4. Protected routes check authentication on every page load

## Data Structure

### Profile
```typescript
{
  full_name: string;
  title: string;
  subtitle: string;
  location: string;
  bio: string;
  email: string;
  phone: string;
  avatar_url: string;
  resume_url: string;
  github_url: string;
  linkedin_url: string;
  twitter_url: string;
}
```

### Project
```typescript
{
  title: string;
  description: string;
  tags: string[];
  featured: boolean;
  color: string;
  github_url: string;
  live_url: string;
  image_url: string;
  order_index: number;
}
```

### Education
```typescript
{
  institution: string;
  degree: string;
  field: string;
  start_date: Date;
  end_date: Date;
  current: boolean;
  grade: string;
  description: string;
  order_index: number;
}
```

### Skill
```typescript
{
  name: string;
  category: 'frontend' | 'backend' | 'tools' | 'other';
  proficiency: number; // 0-100
  icon: string;
  order_index: number;
}
```

### Leadership
```typescript
{
  title: string;
  organization: string;
  description: string;
  start_date: Date;
  end_date: Date;
  current: boolean;
  achievements: string[];
  image_url: string;
  order_index: number;
}
```

### Achievement
```typescript
{
  title: string;
  description: string;
  date: Date;
  category: string;
  icon: string;
  order_index: number;
}
```

## Frontend Integration

The frontend components automatically fetch data from Supabase using custom hooks:

```typescript
import { useProjects, useEducation, useSkills, useLeadership, useAchievements } from '@/hooks/usePortfolioData';

// In your component
const { data: projects, isLoading } = useProjects();
```

## Environment Variables

Make sure you have these in your `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

## Tips

1. **Order Management**: Use the `order_index` field to control the display order of items
2. **Featured Projects**: Mark important projects as featured to highlight them
3. **Tags**: Add multiple tags to projects for better categorization
4. **Proficiency Levels**: Be honest about skill levels - it helps set expectations
5. **Regular Updates**: Keep your portfolio fresh by regularly updating your content

## Troubleshooting

### Can't Login
- Verify user exists in `admin_users` table
- Check that email matches exactly
- Ensure Supabase Auth is properly configured

### Data Not Showing
- Check RLS policies are enabled
- Verify data exists in tables
- Check browser console for errors

### Changes Not Reflecting
- Clear browser cache
- Check that you saved changes in admin panel
- Verify Supabase connection

## Support

For issues or questions:
1. Check Supabase dashboard for error logs
2. Review browser console for errors
3. Verify all migrations have run successfully

## Future Enhancements

Potential additions:
- Image upload functionality
- Blog post management
- Contact form submissions
- Analytics dashboard
- SEO settings
- Theme customization
- Email notifications
