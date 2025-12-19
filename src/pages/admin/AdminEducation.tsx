import { useEffect, useState } from "react";
import { educationService } from "@/integrations/firebase/services";
import { auth } from "@/integrations/firebase/config";
import { Education } from "@/integrations/firebase/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const emptyEducation: Partial<Education> = {
  institution: "",
  degree: "",
  field_of_study: "",
  start_year: new Date().getFullYear(),
  end_year: undefined,
  is_current: false,
  grade: "",
  description: "",
  display_order: 0,
};

export default function AdminEducation() {
  const [items, setItems] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Education>>(emptyEducation);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await educationService.getAll();
      setItems(data.sort((a, b) => (a.display_order || 0) - (b.display_order || 0)));
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
        await educationService.update(editing.id, editing);
        toast({ title: "Success", description: "Education updated!" });
      } else {
        await educationService.create(editing as Omit<Education, 'id' | 'userId' | 'createdAt' | 'updatedAt'>);
        toast({ title: "Success", description: "Education added!" });
      }
      setDialogOpen(false);
      setEditing(emptyEducation);
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
      await educationService.delete(id);
      toast({ title: "Success", description: "Deleted!" });
      fetchItems();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const openDialog = (item?: Education) => {
    setEditing(item ? { ...item } : emptyEducation);
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
          <h1 className="text-3xl font-bold tracking-tight">Education</h1>
          <p className="text-muted-foreground">Manage your educational background</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Education
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>{editing.id ? "Edit Education" : "Add Education"}</DialogTitle>
              <DialogDescription>Fill in the details below</DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Institution *</Label>
                  <Input
                    value={editing.institution || ""}
                    onChange={(e) => setEditing({ ...editing, institution: e.target.value })}
                    placeholder="University name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Degree *</Label>
                    <Input
                      value={editing.degree || ""}
                      onChange={(e) => setEditing({ ...editing, degree: e.target.value })}
                      placeholder="B.Tech, M.Tech, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Field of Study</Label>
                    <Input
                      value={editing.field_of_study || ""}
                      onChange={(e) => setEditing({ ...editing, field_of_study: e.target.value })}
                      placeholder="Computer Science"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Year *</Label>
                    <Input
                      type="number"
                      value={editing.start_year || ""}
                      onChange={(e) => setEditing({ ...editing, start_year: parseInt(e.target.value) })}
                      placeholder="2020"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Year</Label>
                    <Input
                      type="number"
                      value={editing.end_year || ""}
                      onChange={(e) => setEditing({ ...editing, end_year: parseInt(e.target.value) || undefined })}
                      placeholder="2024"
                      disabled={editing.is_current}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editing.is_current || false}
                    onCheckedChange={(checked) => setEditing({ ...editing, is_current: checked })}
                  />
                  <Label>Currently Studying</Label>
                </div>

                <div className="space-y-2">
                  <Label>Grade/GPA</Label>
                  <Input
                    value={editing.grade || ""}
                    onChange={(e) => setEditing({ ...editing, grade: e.target.value })}
                    placeholder="9.5 GPA or 95%"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={editing.description || ""}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    placeholder="Additional details..."
                    rows={3}
                  />
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
            </ScrollArea>
            <div className="flex justify-end gap-2 pt-4">
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

      <div className="grid gap-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{item.degree} - {item.field_of_study}</CardTitle>
                  <CardDescription>{item.institution}</CardDescription>
                </div>
                <div className="flex gap-2">
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
                <div className="flex gap-2">
                  <span className="text-muted-foreground">Period:</span>
                  <span>
                    {item.start_year} - {item.is_current ? "Present" : item.end_year}
                  </span>
                </div>
                {item.grade && (
                  <div className="flex gap-2">
                    <span className="text-muted-foreground">Grade:</span>
                    <span>{item.grade}</span>
                  </div>
                )}
                {item.description && <p className="text-muted-foreground">{item.description}</p>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {items.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No education entries yet</p>
            <Button onClick={() => openDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Your First Entry
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
