import { useEffect, useState } from "react";
import { achievementsService } from "@/integrations/firebase/services";
import { auth } from "@/integrations/firebase/config";
import { Achievement } from "@/integrations/firebase/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, Trophy, Upload, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const emptyAchievement: Partial<Achievement> = {
  title: "",
  description: "",
  date: "",
  certificate_url: "",
  image_url: "",
  display_order: 0,
};

export default function AdminAchievements() {
  const [items, setItems] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Achievement>>(emptyAchievement);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await achievementsService.getAll();
      setItems(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if ("id" in editing && editing.id) {
        await achievementsService.update(editing.id, editing);
        toast({ title: "Success", description: "Achievement updated!" });
      } else {
        await achievementsService.create(editing as Omit<Achievement, 'id' | 'userId' | 'createdAt' | 'updatedAt'>);
        toast({ title: "Success", description: "Achievement added!" });
      }
      setDialogOpen(false);
      setEditing(emptyAchievement);
      fetchItems();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await achievementsService.delete(id);
      toast({ title: "Success", description: "Deleted!" });
      fetchItems();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: "Error", description: "Please select an image file", variant: "destructive" });
      event.target.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "Error", description: "Image size should be less than 10MB", variant: "destructive" });
      event.target.value = '';
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'portfolio');
      formData.append('folder', 'portfolio/achievements');

      const response = await fetch('https://api.cloudinary.com/v1_1/dobktsnix/image/upload', { method: 'POST', body: formData });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Upload failed');
      }

      const data = await response.json();
      setEditing({ ...editing, image_url: data.secure_url });
      toast({ title: "Success", description: "Image uploaded successfully!" });
      event.target.value = '';
    } catch (error: any) {
      toast({ title: "Upload Failed", description: error.message || 'Failed to upload image', variant: "destructive" });
      event.target.value = '';
    } finally {
      setUploading(false);
    }
  };

  const openDialog = (item?: Achievement) => {
    setEditing(item ? { ...item } : emptyAchievement);
    setDialogOpen(true);
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
          <h1 className="text-3xl font-bold tracking-tight">Achievements</h1>
          <p className="text-muted-foreground">Track your accomplishments</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Achievement
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing.id ? "Edit Achievement" : "Add Achievement"}</DialogTitle>
              <DialogDescription>Fill in the details below</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={editing.title || ""}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  placeholder="Achievement title"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editing.description || ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  placeholder="Brief description..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={editing.date || ""}
                  onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Certificate URL</Label>
                <Input
                  value={editing.certificate_url || ""}
                  onChange={(e) => setEditing({ ...editing, certificate_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label>Achievement Image</Label>
                
                {editing.image_url && (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-border">
                    <img
                      src={editing.image_url}
                      alt="Achievement preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setEditing({ ...editing, image_url: "" })}
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
                    onClick={() => document.getElementById('achievement-image-upload')?.click()}
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
                    id="achievement-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Or paste image URL</Label>
                  <Input
                    value={editing.image_url || ""}
                    onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={editing.display_order || 0}
                  onChange={(e) => setEditing({ ...editing, display_order: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </div>
                  {item.date && (
                    <CardDescription>{new Date(item.date).toLocaleDateString()}</CardDescription>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openDialog(item)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {item.description && (
                  <p className="text-muted-foreground">{item.description}</p>
                )}
                {item.date && (
                  <div className="text-muted-foreground">
                    {new Date(item.date).toLocaleDateString()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {items.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No achievements yet</p>
            <Button onClick={() => openDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Your First Achievement
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
