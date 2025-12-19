import { useEffect, useState } from "react";
import { projectsService } from "@/integrations/firebase/services";
import { auth } from "@/integrations/firebase/config";
import { Project } from "@/integrations/firebase/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, ExternalLink, Github, X, Upload } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const emptyProject: Partial<Project> = {
  title: "",
  description: "",
  tech_stack: [],
  is_featured: false,
  github_url: "",
  live_url: "",
  image_url: "",
  display_order: 0,
};

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project>>(emptyProject);
  const [tagInput, setTagInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await projectsService.getAll();
      setProjects(data.sort((a, b) => (a.display_order || 0) - (b.display_order || 0)));
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
      if ("id" in editingProject && editingProject.id) {
        await projectsService.update(editingProject.id, editingProject);
        toast({ title: "Success", description: "Project updated successfully!" });
      } else {
        await projectsService.create(editingProject as Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt'>);
        toast({ title: "Success", description: "Project created successfully!" });
      }
      setDialogOpen(false);
      setEditingProject(emptyProject);
      fetchProjects();
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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await projectsService.delete(id);
      toast({ title: "Success", description: "Project deleted successfully!" });
      fetchProjects();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (project?: Project) => {
    setEditingProject(project ? { ...project } : emptyProject);
    setDialogOpen(true);
  };

  const addTag = () => {
    if (tagInput.trim() && !editingProject.tech_stack?.includes(tagInput.trim())) {
      setEditingProject({
        ...editingProject,
        tech_stack: [...(editingProject.tech_stack || []), tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setEditingProject({
      ...editingProject,
      tech_stack: editingProject.tech_stack?.filter((t) => t !== tag) || [],
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is image or video
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      toast({
        title: "Error",
        description: "Please select an image or video file",
        variant: "destructive",
      });
      event.target.value = '';
      return;
    }

    // Check file size (max 10MB for images, 50MB for videos)
    const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "Error",
        description: `File size should be less than ${isVideo ? '50MB' : '10MB'}`,
        variant: "destructive",
      });
      event.target.value = '';
      return;
    }

    setUploading(true);
    console.log('Starting media upload to Cloudinary...', { fileName: file.name, fileSize: file.size, type: file.type });
    
    try {
      // Determine upload endpoint based on file type
      const uploadEndpoint = isVideo ? 'video/upload' : 'image/upload';
      
      // Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'portfolio');
      formData.append('folder', 'portfolio/projects');

      console.log(`Uploading ${isVideo ? 'video' : 'image'} to Cloudinary...`);
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dobktsnix/${uploadEndpoint}`,
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

      setEditingProject({ ...editingProject, image_url: data.secure_url });

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage your portfolio projects</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openEditDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>
              {("id" in editingProject && editingProject.id) ? "Edit Project" : "Add New Project"}
            </DialogTitle>
            <DialogDescription>
              Fill in the project details below
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={editingProject.title || ""}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, title: e.target.value })
                  }
                  placeholder="Project name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={editingProject.description || ""}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, description: e.target.value })
                  }
                  placeholder="Project description"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tech Stack</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    placeholder="Add a technology"
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {editingProject.tech_stack?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="github_url">GitHub URL</Label>
                    <Input
                      id="github_url"
                      value={editingProject.github_url || ""}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, github_url: e.target.value })
                      }
                      placeholder="https://github.com/..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="live_url">Live URL</Label>
                    <Input
                      id="live_url"
                      value={editingProject.live_url || ""}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, live_url: e.target.value })
                      }
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Project Image</Label>
                  
                  {editingProject.image_url && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-border">
                      <img
                        src={editingProject.image_url}
                        alt="Project preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => setEditingProject({ ...editingProject, image_url: "" })}
                        className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
                        type="button"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={uploading}
                      className="gap-2"
                      onClick={() => document.getElementById('project-image-upload')?.click()}
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Upload Image
                        </>
                      )}
                    </Button>
                    <Input
                      id="project-image-upload"
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />/video
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image_url" className="text-sm text-muted-foreground">Or paste image URL</Label>
                    <Input
                      id="image_url"
                      value={editingProject.image_url || ""}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, image_url: e.target.value })
                      }
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_featured"
                      checked={editingProject.is_featured || false}
                      onCheckedChange={(checked) =>
                        setEditingProject({ ...editingProject, is_featured: checked })
                      }
                    />
                    <Label htmlFor="is_featured">Featured</Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="display_order">Display Order</Label>
                    <Input
                      id="display_order"
                      type="number"
                      value={editingProject.display_order || 0}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          display_order: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </ScrollArea>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Project"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {project.title}
                    {project.is_featured && (
                      <Badge variant="secondary" className="text-xs">
                        Featured
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 mt-2">
                    {project.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1">
                  {project.tech_stack?.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {project.tech_stack?.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.tech_stack.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex gap-2">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(project)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(project.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No projects yet</p>
            <Button onClick={() => openEditDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Your First Project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
