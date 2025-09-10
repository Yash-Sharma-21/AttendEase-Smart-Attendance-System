import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download, TrendingUp, Users, AlertTriangle } from "lucide-react";

interface AttendanceReport {
  studentName: string;
  rollNumber: string;
  class: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  attendanceRate: number;
}

export const AttendanceReports = () => {
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  
  const classes = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'];
  const periods = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'term', label: 'This Term' },
    { value: 'year', label: 'This Year' }
  ];

  // Sample report data
  const [reportData] = useState<AttendanceReport[]>([
    {
      studentName: 'Rahul Kumar',
      rollNumber: '001',
      class: 'Class 5',
      totalDays: 22,
      presentDays: 21,
      absentDays: 1,
      lateDays: 2,
      attendanceRate: 95.5
    },
    {
      studentName: 'Priya Sharma',
      rollNumber: '002',
      class: 'Class 4',
      totalDays: 22,
      presentDays: 19,
      absentDays: 3,
      lateDays: 1,
      attendanceRate: 86.4
    },
    {
      studentName: 'Amit Singh',
      rollNumber: '003',
      class: 'Class 3',
      totalDays: 22,
      presentDays: 20,
      absentDays: 2,
      lateDays: 0,
      attendanceRate: 90.9
    },
    {
      studentName: 'Sunita Devi',
      rollNumber: '004',
      class: 'Class 5',
      totalDays: 22,
      presentDays: 17,
      absentDays: 5,
      lateDays: 3,
      attendanceRate: 77.3
    },
    {
      studentName: 'Ravi Kumar',
      rollNumber: '005',
      class: 'Class 2',
      totalDays: 22,
      presentDays: 18,
      absentDays: 4,
      lateDays: 1,
      attendanceRate: 81.8
    },
  ]);

  const filteredReports = reportData.filter(report => 
    selectedClass === 'all' || report.class === selectedClass
  );

  const getOverallStats = () => {
    const totalStudents = filteredReports.length;
    const avgAttendance = filteredReports.reduce((sum, r) => sum + r.attendanceRate, 0) / totalStudents || 0;
    const excellentCount = filteredReports.filter(r => r.attendanceRate >= 90).length;
    const poorCount = filteredReports.filter(r => r.attendanceRate < 75).length;
    
    return {
      totalStudents,
      avgAttendance: avgAttendance.toFixed(1),
      excellentCount,
      poorCount
    };
  };

  const stats = getOverallStats();

  const getAttendanceBadge = (rate: number) => {
    if (rate >= 90) return <Badge className="bg-success text-success-foreground">Excellent</Badge>;
    if (rate >= 85) return <Badge variant="default">Good</Badge>;
    if (rate >= 75) return <Badge variant="secondary">Average</Badge>;
    return <Badge variant="destructive">Poor</Badge>;
  };

  const handleExportReport = () => {
    // In a real app, this would generate and download a CSV/PDF
    const csvContent = [
      ['Name', 'Roll Number', 'Class', 'Total Days', 'Present', 'Absent', 'Late', 'Attendance Rate'],
      ...filteredReports.map(r => [
        r.studentName,
        r.rollNumber,
        r.class,
        r.totalDays,
        r.presentDays,
        r.absentDays,
        r.lateDays,
        `${r.attendanceRate}%`
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-report-${selectedPeriod}-${selectedClass}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Attendance Reports</h2>
          <p className="text-muted-foreground">View and analyze attendance patterns</p>
        </div>
        
        <Button onClick={handleExportReport} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-border shadow-[var(--shadow-card)]">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((period) => (
                    <SelectItem key={period.value} value={period.value}>
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall Statistics */}
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
              Average Attendance
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.avgAttendance}%</div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-[var(--shadow-card)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Excellent (90%+)
            </CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.excellentCount}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.excellentCount / stats.totalStudents) * 100).toFixed(0)}% of students
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-[var(--shadow-card)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Need Attention
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.poorCount}</div>
            <p className="text-xs text-muted-foreground">
              Below 75% attendance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Report */}
      <Card className="border-border shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="text-foreground">
            Detailed Attendance Report - {periods.find(p => p.value === selectedPeriod)?.label}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReports.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No data available for the selected filters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 font-medium text-foreground">Student</th>
                      <th className="text-left py-2 font-medium text-foreground">Class</th>
                      <th className="text-center py-2 font-medium text-foreground">Present</th>
                      <th className="text-center py-2 font-medium text-foreground">Absent</th>
                      <th className="text-center py-2 font-medium text-foreground">Late</th>
                      <th className="text-center py-2 font-medium text-foreground">Rate</th>
                      <th className="text-center py-2 font-medium text-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((report, index) => (
                      <tr key={index} className="border-b border-border/50">
                        <td className="py-3">
                          <div>
                            <div className="font-medium text-foreground">{report.studentName}</div>
                            <div className="text-sm text-muted-foreground">Roll: {report.rollNumber}</div>
                          </div>
                        </td>
                        <td className="py-3 text-muted-foreground">{report.class}</td>
                        <td className="py-3 text-center text-success font-medium">{report.presentDays}</td>
                        <td className="py-3 text-center text-destructive font-medium">{report.absentDays}</td>
                        <td className="py-3 text-center text-warning font-medium">{report.lateDays}</td>
                        <td className="py-3 text-center font-medium text-foreground">{report.attendanceRate}%</td>
                        <td className="py-3 text-center">{getAttendanceBadge(report.attendanceRate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};