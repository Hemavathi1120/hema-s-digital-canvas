import { useState, useEffect } from "react";
import { contactMessagesService } from "@/integrations/firebase/services";
import type { ContactMessage } from "@/integrations/firebase/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Mail, User, Calendar, Trash2, CheckCircle, Archive, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function AdminConnections() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await contactMessagesService.getAll();
      setMessages(data);
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

  const handleViewMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsViewDialogOpen(true);

    // Mark as read if it's new
    if (message.status === "new") {
      try {
        await contactMessagesService.update(message.id, { status: "read" });
        loadMessages();
      } catch (error: any) {
        console.error("Failed to update status:", error);
      }
    }
  };

  const handleUpdateStatus = async (id: string, status: ContactMessage["status"]) => {
    try {
      await contactMessagesService.update(id, { status });
      toast({
        title: "Success",
        description: "Message status updated successfully",
      });
      loadMessages();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      await contactMessagesService.delete(id);
      toast({
        title: "Success",
        description: "Message deleted successfully",
      });
      loadMessages();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: ContactMessage["status"]) => {
    const variants: Record<ContactMessage["status"], { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      new: { variant: "default", label: "New" },
      read: { variant: "secondary", label: "Read" },
      archived: { variant: "outline", label: "Archived" },
    };
    const config = variants[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Connections</h1>
        <p className="text-muted-foreground mt-2">
          Manage messages and connection requests from visitors
        </p>
      </div>

      <div className="grid gap-4">
        {messages.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Mail className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No messages yet</p>
              <p className="text-sm text-muted-foreground">Messages from visitors will appear here</p>
            </CardContent>
          </Card>
        ) : (
          messages.map((message) => (
            <Card key={message.id} className={message.status === "new" ? "border-primary" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Mail className="w-5 h-5 text-primary" />
                      Connection Request
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {message.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {message.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(message.createdAt)}
                      </span>
                    </CardDescription>
                  </div>
                  {getStatusBadge(message.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Message Preview:</h4>
                  <p className="text-muted-foreground line-clamp-2">{message.message}</p>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleViewMessage(message)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Full Message
                  </Button>
                  {message.status !== "read" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateStatus(message.id, "read")}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Read
                    </Button>
                  )}
                  {message.status !== "archived" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateStatus(message.id, "archived")}
                    >
                      <Archive className="w-4 h-4 mr-2" />
                      Archive
                    </Button>
                  )}
                  {message.status === "archived" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateStatus(message.id, "new")}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Restore
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(message.id)}
                    className="ml-auto"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* View Message Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Message from {selectedMessage?.name}</DialogTitle>
            <DialogDescription>
              Received on {selectedMessage && formatDate(selectedMessage.createdAt)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Name</h4>
                <p className="text-foreground">{selectedMessage?.name}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Email</h4>
                <a 
                  href={`mailto:${selectedMessage?.email}`}
                  className="text-primary hover:underline"
                >
                  {selectedMessage?.email}
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Message</h4>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-foreground whitespace-pre-wrap">{selectedMessage?.message}</p>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                variant="default"
                onClick={() => {
                  if (selectedMessage?.email) {
                    window.open(`mailto:${selectedMessage.email}?subject=Re: Your Message`);
                  }
                }}
                className="flex-1"
              >
                <Mail className="w-4 h-4 mr-2" />
                Reply via Email
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsViewDialogOpen(false);
                  setSelectedMessage(null);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
