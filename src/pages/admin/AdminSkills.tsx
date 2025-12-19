import { useEffect, useState } from "react";
import { skillsService } from "@/integrations/firebase/services";
import { auth } from "@/integrations/firebase/config";
import { Skill } from "@/integrations/firebase/types";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const emptySkill: Partial<Skill> = {
  name: "",
  category: "frontend",
  proficiency: 50,
  icon: "",
  display_order: 0,
};

const categories = ["frontend", "backend", "tools", "other"];

export default function AdminSkills() {
  const [items, setItems] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Skill>>(emptySkill);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await skillsService.getAll();
      setItems(data.sort((a, b) => {
        if (a.category !== b.category) return a.category.localeCompare(b.category);
        return (a.display_order || 0) - (b.display_order || 0);
      }));
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
        await skillsService.update(editing.id, editing);
        toast({ title: "Success", description: "Skill updated!" });
      } else {
        await skillsService.create(editing as Omit<Skill, 'id' | 'userId' | 'createdAt' | 'updatedAt'>);
        toast({ title: "Success", description: "Skill added!" });
      }
      setDialogOpen(false);
      setEditing(emptySkill);
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
      await skillsService.delete(id);
      toast({ title: "Success", description: "Deleted!" });
      fetchItems();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const openDialog = (item?: Skill) => {
    setEditing(item ? { ...item } : emptySkill);
    setDialogOpen(true);
  };

  const groupedSkills = categories.map((category) => ({
    category,
    skills: items.filter((s) => s.category === category),
  }));

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
          <h1 className="text-3xl font-bold tracking-tight">Skills</h1>
          <p className="text-muted-foreground">Manage your technical skills</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Skill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing.id ? "Edit Skill" : "Add Skill"}</DialogTitle>
              <DialogDescription>Fill in the details below</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Skill Name *</Label>
                <Input
                  value={editing.name || ""}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  placeholder="React, Python, etc."
                />
              </div>

              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={editing.category}
                  onValueChange={(value) => setEditing({ ...editing, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Proficiency (0-100): {editing.proficiency}%</Label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={editing.proficiency || 50}
                  onChange={(e) =>
                    setEditing({ ...editing, proficiency: parseInt(e.target.value) })
                  }
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Icon (Lucide icon name)</Label>
                <Input
                  value={editing.icon || ""}
                  onChange={(e) => setEditing({ ...editing, icon: e.target.value })}
                  placeholder="Code, Database, etc."
                />
              </div>

              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={editing.display_order || 0}
                  onChange={(e) =>
                    setEditing({ ...editing, display_order: parseInt(e.target.value) })
                  }
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

      {groupedSkills.map(({ category, skills }) => (
        skills.length > 0 && (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="capitalize">{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skills.map((skill) => (
                  <div key={skill.id} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-sm text-muted-foreground">{skill.proficiency}%</span>
                      </div>
                      <Progress value={skill.proficiency} className="h-2" />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openDialog(skill)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(skill.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      ))}

      {items.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No skills yet</p>
            <Button onClick={() => openDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Your First Skill
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
