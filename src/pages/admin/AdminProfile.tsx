import { useEffect, useState } from "react";
import { profilesService } from "@/integrations/firebase/services";
import type { Profile } from "@/integrations/firebase/types";
import { auth } from "@/integrations/firebase/config";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Upload, X } from "lucide-react";

export default function AdminProfile() {
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await profilesService.getCurrent();
      setProfile(data || {});
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await profilesService.update(profile);

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof Profile, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      event.target.value = '';
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      });
      event.target.value = '';
      return;
    }

    setUploading(true);
    console.log('Starting upload to Cloudinary...', { fileName: file.name, fileSize: file.size });
    
    try {
      // Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'portfolio');
      formData.append('folder', 'portfolio/avatars');

      console.log('Uploading to Cloudinary...');
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dobktsnix/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Upload failed');
      }

      const data = await response.json();
      console.log('Upload complete:', data.secure_url);

      // Update profile with the new avatar URL
      setProfile({ ...profile, avatar_url: data.secure_url });
      setImagePreview(data.secure_url);

      toast({
        title: "Success",
        description: "Image uploaded successfully!",
      });
      
      // Reset file input
      event.target.value = '';
    } catch (error: any) {
      console.error('Upload error:', error);
      
      let errorMessage = error.message || 'Failed to upload image';
      
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Reset file input
      event.target.value = '';
    } finally {
      setUploading(false);
      console.log('Upload process finished');
    }
  };

  const removeImage = () => {
    setProfile({ ...profile, avatar_url: "" });
    setImagePreview(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your personal information and links</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Your primary profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={profile.full_name || ""}
                onChange={(e) => updateField("full_name", e.target.value)}
                placeholder="Your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={profile.title || ""}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="e.g., Full Stack Developer"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Textarea
              id="subtitle"
              value={profile.subtitle || ""}
              onChange={(e) => updateField("subtitle", e.target.value)}
              placeholder="A brief tagline or description"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={profile.bio || ""}
              onChange={(e) => updateField("bio", e.target.value)}
              placeholder="Tell your story..."
              rows={4}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profile.location || ""}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="Your location"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email || ""}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={profile.phone || ""}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="+91 1234567890"
              />
            </div>
            <div className="space-y-2">
              <Label>Profile Picture</Label>
              
              {/* Image Preview */}
              {(imagePreview || profile.avatar_url) && (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-border">
                  <img
                    src={imagePreview || profile.avatar_url}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
                    type="button"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Upload Button */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploading}
                  className="gap-2"
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload from Device
                    </>
                  )}
                </Button>
                <Input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              
              {/* Or Manual URL Input */}
              <div className="space-y-2">
                <Label htmlFor="avatar_url" className="text-sm text-muted-foreground">Or paste image URL</Label>
                <Input
                  id="avatar_url"
                  value={profile.avatar_url || ""}
                  onChange={(e) => updateField("avatar_url", e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
          <CardDescription>Connect your social profiles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="github_url">GitHub</Label>
            <Input
              id="github_url"
              value={profile.github_url || ""}
              onChange={(e) => updateField("github_url", e.target.value)}
              placeholder="https://github.com/yourusername"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin_url">LinkedIn</Label>
            <Input
              id="linkedin_url"
              value={profile.linkedin_url || ""}
              onChange={(e) => updateField("linkedin_url", e.target.value)}
              placeholder="https://linkedin.com/in/yourusername"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resume_url">Resume URL</Label>
            <Input
              id="resume_url"
              value={profile.resume_url || ""}
              onChange={(e) => updateField("resume_url", e.target.value)}
              placeholder="https://..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
