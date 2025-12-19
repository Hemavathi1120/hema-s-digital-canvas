import { useState, useEffect } from "react";
import { projectQuestionsService, projectFeedbackService } from "@/integrations/firebase/services";
import type { ProjectQuestion, ProjectFeedback } from "@/integrations/firebase/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Mail, User, Calendar, Trash2, CheckCircle, Archive, ThumbsUp, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function AdminQuestions() {
  const [questions, setQuestions] = useState<ProjectQuestion[]>([]);
  const [feedback, setFeedback] = useState<ProjectFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<ProjectQuestion | null>(null);
  const [isAnswerDialogOpen, setIsAnswerDialogOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [questionsData, feedbackData] = await Promise.all([
        projectQuestionsService.getAll(),
        projectFeedbackService.getAll(),
      ]);
      setQuestions(questionsData);
      setFeedback(feedbackData);
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

  const loadQuestions = loadData;

  const handleAnswer = (question: ProjectQuestion) => {
    setSelectedQuestion(question);
    setAnswer(question.answer || "");
    setIsAnswerDialogOpen(true);
  };

  const handleSubmitAnswer = async () => {
    if (!selectedQuestion) return;

    setIsSubmitting(true);
    try {
      await projectQuestionsService.update(selectedQuestion.id, {
        answer,
        status: "answered",
      });

      toast({
        title: "Success",
        description: "Answer submitted successfully",
      });

      setIsAnswerDialogOpen(false);
      setSelectedQuestion(null);
      setAnswer("");
      loadQuestions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: ProjectQuestion["status"]) => {
    try {
      await projectQuestionsService.update(id, { status });
      toast({
        title: "Success",
        description: `Question marked as ${status}`,
      });
      loadQuestions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;

    try {
      await projectQuestionsService.delete(id);
      toast({
        title: "Success",
        description: "Question deleted successfully",
      });
      loadQuestions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: ProjectQuestion["status"]) => {
    const variants: Record<ProjectQuestion["status"], { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      pending: { variant: "default", label: "Pending" },
      answered: { variant: "secondary", label: "Answered" },
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

  const handleDeleteFeedback = async (id: string) => {
    if (!confirm("Are you sure you want to delete this feedback?")) return;

    try {
      await projectFeedbackService.delete(id);
      toast({
        title: "Success",
        description: "Feedback deleted successfully",
      });
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateFeedbackStatus = async (id: string, status: ProjectFeedback["status"]) => {
    try {
      await projectFeedbackService.update(id, { status });
      toast({
        title: "Success",
        description: "Feedback status updated successfully",
      });
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getFeedbackStatusBadge = (status: ProjectFeedback["status"]) => {
    const variants: Record<ProjectFeedback["status"], { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      pending: { variant: "default", label: "Pending" },
      reviewed: { variant: "secondary", label: "Reviewed" },
      archived: { variant: "outline", label: "Archived" },
    };
    const config = variants[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Project Feedback & Questions</h1>
        <p className="text-muted-foreground mt-2">
          Manage questions, inquiries, and feedback from visitors about your projects
        </p>
      </div>

      <Tabs defaultValue="questions" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="questions" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Questions ({questions.length})
          </TabsTrigger>
          <TabsTrigger value="feedback" className="flex items-center gap-2">
            <ThumbsUp className="w-4 h-4" />
            Feedback ({feedback.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="mt-6">
          <div className="grid gap-4">
            {questions.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No questions yet</p>
                  <p className="text-sm text-muted-foreground">Questions from visitors will appear here</p>
                </CardContent>
              </Card>
            ) : (
              questions.map((question) => (
            <Card key={question.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      Question about: {question.projectTitle}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {question.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {question.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(question.createdAt)}
                      </span>
                    </CardDescription>
                  </div>
                  {getStatusBadge(question.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Question:</h4>
                  <p className="text-muted-foreground">{question.question}</p>
                </div>

                {question.answer && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Your Answer:</h4>
                    <p className="text-muted-foreground">{question.answer}</p>
                    {question.answeredAt && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Answered on {formatDate(question.answeredAt)}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t">
                  {question.status !== "answered" && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleAnswer(question)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {question.answer ? "Update Answer" : "Answer"}
                    </Button>
                  )}
                  {question.status === "pending" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateStatus(question.id, "archived")}
                    >
                      <Archive className="w-4 h-4 mr-2" />
                      Archive
                    </Button>
                  )}
                  {question.status === "archived" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateStatus(question.id, "pending")}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Restore
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(question.id)}
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
        </TabsContent>

        <TabsContent value="feedback" className="mt-6">
          <div className="grid gap-4">
            {feedback.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ThumbsUp className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No feedback yet</p>
                  <p className="text-sm text-muted-foreground">Feedback from visitors will appear here</p>
                </CardContent>
              </Card>
            ) : (
              feedback.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <ThumbsUp className="w-5 h-5 text-primary" />
                          Feedback for: {item.projectTitle}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {item.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {item.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(item.createdAt)}
                          </span>
                        </CardDescription>
                      </div>
                      {getFeedbackStatusBadge(item.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        Rating: {renderStars(item.rating)}
                        <span className="text-sm text-muted-foreground">({item.rating}/5)</span>
                      </h4>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Feedback:</h4>
                      <p className="text-muted-foreground">{item.feedback}</p>
                    </div>

                    <div className="flex gap-2 pt-4 border-t">
                      {item.status === "pending" && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleUpdateFeedbackStatus(item.id, "reviewed")}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark as Reviewed
                        </Button>
                      )}
                      {item.status === "pending" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateFeedbackStatus(item.id, "archived")}
                        >
                          <Archive className="w-4 h-4 mr-2" />
                          Archive
                        </Button>
                      )}
                      {item.status === "archived" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateFeedbackStatus(item.id, "pending")}
                        >
                          <ThumbsUp className="w-4 h-4 mr-2" />
                          Restore
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteFeedback(item.id)}
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
        </TabsContent>
      </Tabs>

      {/* Answer Dialog */}
      <Dialog open={isAnswerDialogOpen} onOpenChange={setIsAnswerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Answer Question</DialogTitle>
            <DialogDescription>
              Provide a detailed answer to {selectedQuestion?.name}'s question
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Question:</h4>
              <p className="text-sm text-muted-foreground">{selectedQuestion?.question}</p>
            </div>
            <div>
              <Label htmlFor="answer">Your Answer</Label>
              <Textarea
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={6}
                placeholder="Type your answer here..."
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSubmitAnswer}
                disabled={isSubmitting || !answer.trim()}
                className="flex-1"
              >
                {isSubmitting ? "Submitting..." : "Submit Answer"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAnswerDialogOpen(false);
                  setSelectedQuestion(null);
                  setAnswer("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
