import { useEffect, useState } from "react";
import { experiencesService } from "@/integrations/firebase/services";
import { auth } from "@/integrations/firebase/config";
import { Experience } from "@/integrations/firebase/types";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const emptyExperience: Partial<Experience> = {
  title: "",
  organization: "",
  description: "",
  start_date: "",
  end_date: "",
  is_current: false,
  type: "leadership",
  display_order: 0,
};

export default function AdminLeadership() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Experience>>(emptyExperience);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await experiencesService.getAll("leadership");
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
        await experiencesService.update(editing.id, editing);
        toast({ title: "Success", description: "Leadership experience updated!" });
      } else {
        await experiencesService.create({ ...editing, type: "leadership" } as Omit<Experience, 'id' | 'userId' | 'createdAt' | 'updatedAt'>);
        toast({ title: "Success", description: "Leadership experience added!" });
      }
      setDialogOpen(false);
      setEditing(emptyExperience);
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
      await experiencesService.delete(id);
      toast({ title: "Success", description: "Deleted!" });
      fetchItems();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const openDialog = (item?: Experience) => {
    setEditing(item ? { ...item } : emptyExperience);
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
          <h1 className="text-3xl font-bold tracking-tight">Leadership</h1>
          <p className="text-muted-foreground">Manage your leadership roles</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Leadership
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>{editing.id ? "Edit Leadership" : "Add Leadership"}</DialogTitle>
              <DialogDescription>Fill in the details below</DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input
                    value={editing.title || ""}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    placeholder="Secretary, President, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Organization *</Label>
                  <Input
                    value={editing.organization || ""}
                    onChange={(e) => setEditing({ ...editing, organization: e.target.value })}
                    placeholder="Organization name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={editing.description || ""}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    placeholder="Brief description of your role..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={editing.start_date || ""}
                      onChange={(e) => setEditing({ ...editing, start_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={editing.end_date || ""}
                      onChange={(e) => setEditing({ ...editing, end_date: e.target.value })}
                      disabled={editing.is_current}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editing.is_current || false}
                    onCheckedChange={(checked) => setEditing({ ...editing, is_current: checked })}
                  />
                  <Label>Current Position</Label>
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

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.organization}</CardDescription>
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
              <div className="space-y-3 text-sm">
                {item.description && <p className="text-muted-foreground">{item.description}</p>}
                <div className="flex gap-2">
                  <span className="text-muted-foreground">Period:</span>
                  <span>
                    {item.start_date} - {item.is_current ? "Present" : item.end_date}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {items.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No leadership roles yet</p>
            <Button onClick={() => openDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Your First Role
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
