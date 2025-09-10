import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, CheckCircle, AlertCircle, BookOpen, UserCheck } from "lucide-react";

interface DashboardProps {
  onNavigate: (section: string) => void;
}

export const Dashboard = ({ onNavigate }: DashboardProps) => {
  const [stats] = useState({
    totalStudents: 245,
    presentToday: 198,
    absentToday: 47,
    attendanceRate: 80.8,
    totalClasses: 8,
    activeClasses: 6
  });

  const todayAttendance = [
    { class: "Class 1", present: 28, total: 32, rate: 87.5 },
    { class: "Class 2", present: 25, total: 30, rate: 83.3 },
    { class: "Class 3", present: 22, total: 28, rate: 78.6 },
    { class: "Class 4", present: 30, total: 35, rate: 85.7 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Rural Schools Attendance System
        </h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border shadow-[var(--shadow-card)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalStudents}</div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-[var(--shadow-card)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Present Today
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.presentToday}</div>
            <p className="text-xs text-muted-foreground">
              {stats.attendanceRate}% attendance rate
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-[var(--shadow-card)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Absent Today
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.absentToday}</div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-[var(--shadow-card)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Classes
            </CardTitle>
            <BookOpen className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.activeClasses}</div>
            <p className="text-xs text-muted-foreground">
              out of {stats.totalClasses} classes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <UserCheck className="h-5 w-5 text-primary" />
              Mark Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Record student attendance for today's classes
            </p>
            <Button 
              onClick={() => onNavigate('attendance')}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Start Marking
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Users className="h-5 w-5 text-secondary" />
              Manage Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Add new students or update existing records
            </p>
            <Button 
              onClick={() => onNavigate('students')}
              variant="secondary"
              className="w-full"
            >
              View Students
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Calendar className="h-5 w-5 text-accent" />
              View Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Generate attendance reports and analytics
            </p>
            <Button 
              onClick={() => onNavigate('reports')}
              variant="outline"
              className="w-full"
            >
              View Reports
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Today's Class Attendance */}
      <Card className="border-border shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="text-foreground">Today's Class Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todayAttendance.map((classData) => (
              <div key={classData.class} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <h4 className="font-medium text-foreground">{classData.class}</h4>
                    <p className="text-sm text-muted-foreground">
                      {classData.present} / {classData.total} students
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge 
                    variant={classData.rate >= 85 ? "default" : classData.rate >= 75 ? "secondary" : "destructive"}
                    className="px-3 py-1"
                  >
                    {classData.rate}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};