import useAuth from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { User, BookOpen, Clock, Target, Trophy } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

interface SpiritualTask {
  id: string;
  title: string;
  description: string;
  category: string;
  defaultTarget: number;
  unit: string;
}

interface UserProgress {
  id: string;
  taskId: string;
  target: number;
  completed: number;
  task: SpiritualTask;
}

export default function Dashboard() {
  const { user, isLoading: authLoading, logout, isLoggingOut } = useAuth();
  const { toast } = useToast();
  const [taskProgress, setTaskProgress] = useState<Record<string, { target: number; completed: number }>>({});

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/membership";
      }, 500);
      return;
    }
  }, [user, authLoading, toast]);

  // Fetch user progress
  const { data: progress = [], isLoading: progressLoading } = useQuery({
    queryKey: ["/api/user-progress"],
    enabled: !!user,
    retry: false,
  });

  // Fetch spiritual tasks
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ["/api/spiritual-tasks"],
    retry: false,
  });

  // Update progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async (data: { taskId: string; target: number; completed: number }) => {
      const response = await fetch('/api/user-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-progress"] });
      toast({
        title: "Progress Updated",
        description: "Your spiritual progress has been recorded.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/membership";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Initialize task progress state
  useEffect(() => {
    if (Array.isArray(progress) && progress.length > 0) {
      const progressMap = (progress as UserProgress[]).reduce((acc: Record<string, { target: number; completed: number }>, p: UserProgress) => {
        acc[p.taskId] = { target: p.target, completed: p.completed };
        return acc;
      }, {});
      setTaskProgress(progressMap);
    }
  }, [progress]);

  const handleProgressUpdate = (taskId: string, completed: number) => {
    const currentProgress = taskProgress[taskId];
    const target = currentProgress?.target || tasksArray.find((t: SpiritualTask) => t.id === taskId)?.defaultTarget || 1;
    
    setTaskProgress(prev => ({
      ...prev,
      [taskId]: { target, completed }
    }));
    
    updateProgressMutation.mutate({
      taskId,
      target,
      completed,
    });
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your spiritual dashboard...</p>
        </div>
      </div>
    );
  }

  const tasksArray = Array.isArray(tasks) ? tasks as SpiritualTask[] : [];
  const totalProgress = tasksArray.reduce((acc: number, task: SpiritualTask) => {
    const userProg = taskProgress[task.id];
    if (!userProg) return acc;
    return acc + (userProg.completed / userProg.target) * 100;
  }, 0);

  const averageProgress = tasksArray.length > 0 ? totalProgress / tasksArray.length : 0;

  return (
    <div className="min-h-screen pt-16">
      {/* Welcome Banner */}
      <section className="py-12 bg-gradient-to-br from-card via-background to-chart-2/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              {user.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover"
                  data-testid="img-user-avatar"
                />
              ) : (
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-serif font-bold text-foreground" data-testid="text-welcome-title">
                  Hare Krishna, {user.firstName || user.email}!
                </h1>
                <p className="text-lg text-muted-foreground" data-testid="text-welcome-subtitle">
                  Welcome to your spiritual journey dashboard
                </p>
              </div>
            </div>
            <div className="ml-auto">
              <Button
                variant="outline"
                onClick={() => logout()}
                disabled={isLoggingOut}
                data-testid="button-logout"
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Progress Overview */}
          <div className="lg:col-span-1">
            <Card data-testid="progress-overview-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Progress Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2" data-testid="text-overall-progress">
                    {Math.round(averageProgress)}%
                  </div>
                  <p className="text-sm text-muted-foreground">Overall Progress</p>
                  <Progress value={averageProgress} className="mt-3" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Tasks Completed Today</span>
                    <Badge variant="secondary" data-testid="badge-tasks-completed">
                      {Object.values(taskProgress).filter(p => p.completed >= p.target).length}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Active Tasks</span>
                    <Badge variant="outline" data-testid="badge-active-tasks">
                      {tasksArray.length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Task Tracker */}
          <div className="lg:col-span-2">
            <Card data-testid="task-tracker-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Today's Spiritual Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                {tasksLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading tasks...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tasksArray.map((task: SpiritualTask) => {
                      const userProg = taskProgress[task.id] || { target: task.defaultTarget, completed: 0 };
                      const progressPercentage = (userProg.completed / userProg.target) * 100;
                      
                      return (
                        <Card key={task.id} className="bg-card/50" data-testid={`task-card-${task.id}`}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  {task.category === 'chanting' && <BookOpen className="h-4 w-4 text-primary" />}
                                  {task.category === 'reading' && <BookOpen className="h-4 w-4 text-primary" />}
                                  {task.category === 'meditation' && <Clock className="h-4 w-4 text-primary" />}
                                  {task.category === 'service' && <User className="h-4 w-4 text-primary" />}
                                  <h3 className="font-semibold text-foreground" data-testid={`text-task-title-${task.id}`}>
                                    {task.title}
                                  </h3>
                                  <Badge variant="outline" className="text-xs">
                                    {task.category}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3" data-testid={`text-task-description-${task.id}`}>
                                  {task.description}
                                </p>
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-2">
                                    <Label htmlFor={`task-${task.id}`} className="text-sm">
                                      Progress:
                                    </Label>
                                    <Input
                                      id={`task-${task.id}`}
                                      type="number"
                                      min="0"
                                      max={userProg.target}
                                      value={userProg.completed}
                                      onChange={(e) => {
                                        const completed = parseInt(e.target.value) || 0;
                                        handleProgressUpdate(task.id, Math.min(completed, userProg.target));
                                      }}
                                      className="w-20 h-8"
                                      data-testid={`input-progress-${task.id}`}
                                    />
                                    <span className="text-sm text-muted-foreground">
                                      / {userProg.target} {task.unit}
                                    </span>
                                  </div>
                                </div>
                                <Progress 
                                  value={progressPercentage} 
                                  className="mt-2"
                                  data-testid={`progress-bar-${task.id}`}
                                />
                              </div>
                              {progressPercentage >= 100 && (
                                <Badge className="bg-green-100 text-green-800" data-testid={`badge-completed-${task.id}`}>
                                  Completed ✓
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Admin Panel Sections - Will be connected to admin panel later */}
        {user.role === "admin" && (
          <div className="mt-8">
            <h2 className="text-2xl font-serif font-bold mb-6" data-testid="text-admin-heading">
              Admin Panel
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card data-testid="admin-task-management-card">
                <CardHeader>
                  <CardTitle className="text-lg">Task Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create and manage spiritual tasks for all users
                  </p>
                  <Button variant="outline" className="w-full" disabled data-testid="button-manage-tasks">
                    Manage Tasks (Coming Soon)
                  </Button>
                </CardContent>
              </Card>

              <Card data-testid="admin-user-management-card">
                <CardHeader>
                  <CardTitle className="text-lg">User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    View and manage user accounts and permissions
                  </p>
                  <Button variant="outline" className="w-full" disabled data-testid="button-manage-users">
                    Manage Users (Coming Soon)
                  </Button>
                </CardContent>
              </Card>

              <Card data-testid="admin-analytics-card">
                <CardHeader>
                  <CardTitle className="text-lg">Analytics & Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    View community progress and engagement metrics
                  </p>
                  <Button variant="outline" className="w-full" disabled data-testid="button-view-analytics">
                    View Analytics (Coming Soon)
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Spiritual Quote */}
        <Card className="mt-8 bg-primary/5 border-primary/20" data-testid="spiritual-quote-card">
          <CardContent className="p-8 text-center">
            <p className="font-devanagari text-2xl text-primary mb-4">
              कर्मण्येवाधिकारस्ते मा फलेषु कदाचन
            </p>
            <p className="text-muted-foreground italic" data-testid="text-quote-translation">
              "You have the right to perform your actions, but you are not entitled to the fruits of action."
            </p>
            <p className="text-sm text-muted-foreground mt-2">- Bhagavad Gita 2.47</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}