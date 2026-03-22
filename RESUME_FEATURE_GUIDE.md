# Resume Section - Feature Guide

## Overview
The resume section has been added to the hero section of the portfolio website. Visitors can view the resume image with a single click, and the admin can manage it from the admin dashboard.

## Features

### 1. Hero Section Resume Button
- **Location**: Hero section (main landing page)
- **Display**: "View Resume" button appears only if a resume image is set
- **Functionality**:
  - Opens the resume image in a new tab
  - Shows a clear photo/screenshot of the resume
  - Mobile-responsive design
  - Animated icon with hover effects

### 2. Admin Dashboard Resume Management

#### Location
`Admin Dashboard → Profile Settings → Social Links Section`

#### How to Add/Update Resume Image

1. Navigate to `/admin/profile`
2. Scroll to "Social Links" section
3. Find "Resume Image" field
4. Click "Upload Resume Image" button
5. Select an image file (JPG, PNG, WebP, etc.)
6. Maximum file size: 5MB
7. File is automatically uploaded to Cloudinary
8. Resume image URL is saved to your profile
9. Preview appears in the form showing the uploaded image

#### Supported Image Formats
- **JPG** (.jpg, .jpeg)
- **PNG** (.png)
- **WebP** (.webp)
- **GIF** (.gif)
- **TIFF** (.tiff)
- Any standard image format

#### File Size Limits
- Maximum: 5MB
- Recommended: Under 2MB for faster loading on mobile

### 3. Resume Image Management

**To Update Your Resume:**
1. Click "Update Resume Image" button
2. Select a new image
3. Previous image is replaced
4. Changes are saved automatically

**To Remove Your Resume:**
1. Hover over the resume preview in the admin panel
2. Click the X button in the top-right corner
3. Click "Save Changes"

## Technical Details

### Database Schema
The resume URL is stored in the `profiles` table:
```typescript
interface Profile {
  resume_url?: string;  // URL to the resume image
  // ... other fields
}
```

### Frontend Components

#### HeroSection.tsx
- Imports the Download icon from lucide-react
- Conditionally renders the "View Resume" button if `profile.resume_url` exists
- Button opens the resume image in a new tab

#### AdminProfile.tsx
- Resume image upload field with preview
- Upload handler function (`handleResumeUpload`)
- Image validation (file type and size)
- Cloudinary integration for image storage
- Shows preview thumbnail after upload
- Option to remove the uploaded image

### Upload Service Details
- **Provider**: Cloudinary
- **Upload Endpoint**: `https://api.cloudinary.com/v1_1/dobktsnix/image/upload`
- **Folder**: `portfolio/resumes`
- **Upload Preset**: `portfolio`

## User Flow

```
Admin uploads resume image from /admin/profile
        ↓
Resume image stored on Cloudinary
        ↓
Resume image URL saved to Firebase profiles collection
        ↓
Hero section detects resume_url and displays button
        ↓
Visitor clicks "View Resume" button
        ↓
Resume image opens in visitor's browser
```

## Troubleshooting

### Resume Button Not Showing
- ✓ Check if resume image is uploaded in the admin profile
- ✓ Ensure the image URL is valid and accessible
- ✓ Check browser console for any errors
- ✓ Save your profile changes

### Upload Fails
- ✓ Verify file is an image format (JPG, PNG, etc.)
- ✓ Check file size is under 5MB
- ✓ Ensure internet connection is stable
- ✓ Try uploading again
- ✓ Clear browser cache if issues persist

### Image Won't Display
- ✓ Check if the Cloudinary URL is valid
- ✓ Try opening the URL directly in browser
- ✓ Verify CORS settings on your hosting
- ✓ Check image file is not corrupted

## Best Practices

1. **Prepare Your Resume Image**
   - Scan or take a clear screenshot of your resume
   - Ensure good lighting and contrast
   - Crop excess white space
   - Use landscape orientation for better readability

2. **Image Quality**
   - Use JPG or PNG format for best results
   - Ensure resolution is high enough to read text
   - Recommended: 1200x1600 pixels for letter-size resume
   - Keep file under 2MB for mobile optimization

3. **Content**
   - Make sure all text is clearly visible
   - Include your contact information
   - Highlight key skills and achievements
   - Update when making significant career changes

4. **Testing**
   - Always test the view button before publishing
   - Verify image opens correctly
   - Test on mobile devices
   - Check zoom functionality works

5. **Keeping it Updated**
   - Update your resume image regularly
   - Upload new version to replace old one
   - One-click update process from admin panel

## Admin Navigation
- **Dashboard**: `/admin`
- **Profile Settings**: `/admin/profile`
- **Resume Image Field**: Under "Social Links" section (below LinkedIn)

## Support
For issues or questions about the resume feature:
1. Check this guide first
2. Review the implementation in `src/components/HeroSection.tsx`
3. Check admin profile implementation in `src/pages/admin/AdminProfile.tsx`
4. Verify Cloudinary upload settings

