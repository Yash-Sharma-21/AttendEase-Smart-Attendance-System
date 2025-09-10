import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, XCircle, User, Calendar, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  status: 'present' | 'absent' | 'late' | null;
}

interface AttendanceRecord {
  date: string;
  class: string;
  students: Student[];
}

export const AttendanceTracker = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord | null>(null);
  
  const { toast } = useToast();

  const classes = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'];
  
  // Sample student data for each class
  const classStudents: { [key: string]: Student[] } = {
    'Class 1': [
      { id: '1', name: 'Aarav Patel', rollNumber: '001', status: null },
      { id: '2', name: 'Diya Singh', rollNumber: '002', status: null },
      { id: '3', name: 'Arjun Kumar', rollNumber: '003', status: null },
      { id: '4', name: 'Kavya Sharma', rollNumber: '004', status: null },
    ],
    'Class 2': [
      { id: '5', name: 'Ravi Kumar', rollNumber: '005', status: null },
      { id: '6', name: 'Meera Devi', rollNumber: '006', status: null },
      { id: '7', name: 'Suresh Singh', rollNumber: '007', status: null },
    ],
    'Class 3': [
      { id: '8', name: 'Amit Singh', rollNumber: '008', status: null },
      { id: '9', name: 'Pooja Kumari', rollNumber: '009', status: null },
      { id: '10', name: 'Vikram Yadav', rollNumber: '010', status: null },
    ],
    'Class 4': [
      { id: '11', name: 'Priya Sharma', rollNumber: '011', status: null },
      { id: '12', name: 'Rohit Gupta', rollNumber: '012', status: null },
    ],
    'Class 5': [
      { id: '13', name: 'Rahul Kumar', rollNumber: '013', status: null },
      { id: '14', name: 'Sunita Devi', rollNumber: '014', status: null },
    ],
  };

  const handleLoadClass = () => {
    if (!selectedClass) {
      toast({
        title: "Error",
        description: "Please select a class",
        variant: "destructive"
      });
      return;
    }

    const students = classStudents[selectedClass] || [];
    setAttendanceData({
      date: selectedDate,
      class: selectedClass,
      students: students.map(s => ({ ...s, status: null }))
    });
  };

  const handleMarkAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    if (!attendanceData) return;

    setAttendanceData({
      ...attendanceData,
      students: attendanceData.students.map(student =>
        student.id === studentId ? { ...student, status } : student
      )
    });
  };

  const handleMarkAllPresent = () => {
    if (!attendanceData) return;

    setAttendanceData({
      ...attendanceData,
      students: attendanceData.students.map(student => ({ ...student, status: 'present' as const }))
    });
    
    toast({
      title: "Success",
      description: "Marked all students as present",
    });
  };

  const handleSaveAttendance = () => {
    if (!attendanceData) return;

    const unmarked = attendanceData.students.filter(s => s.status === null);
    if (unmarked.length > 0) {
      toast({
        title: "Warning",
        description: `${unmarked.length} students still unmarked`,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Attendance saved successfully",
    });
    
    // Reset form
    setAttendanceData(null);
    setSelectedClass('');
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'present': return 'bg-success text-success-foreground';
      case 'absent': return 'bg-destructive text-destructive-foreground';
      case 'late': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStats = () => {
    if (!attendanceData) return { present: 0, absent: 0, late: 0, total: 0 };
    
    const present = attendanceData.students.filter(s => s.status === 'present').length;
    const absent = attendanceData.students.filter(s => s.status === 'absent').length;
    const late = attendanceData.students.filter(s => s.status === 'late').length;
    
    return { present, absent, late, total: attendanceData.students.length };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Mark Attendance</h2>
        <p className="text-muted-foreground">Record daily attendance for students</p>
      </div>

      {/* Class Selection */}
      <Card className="border-border shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Calendar className="h-5 w-5 text-primary" />
            Select Class & Date
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
              />
            </div>
            
            <Button 
              onClick={handleLoadClass}
              className="bg-primary hover:bg-primary/90"
            >
              Load Class
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Stats */}
      {attendanceData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-border">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-success">{stats.present}</div>
              <div className="text-sm text-muted-foreground">Present</div>
            </CardContent>
          </Card>
          
          <Card className="border-border">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-destructive">{stats.absent}</div>
              <div className="text-sm text-muted-foreground">Absent</div>
            </CardContent>
          </Card>
          
          <Card className="border-border">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-warning">{stats.late}</div>
              <div className="text-sm text-muted-foreground">Late</div>
            </CardContent>
          </Card>
          
          <Card className="border-border">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Student List */}
      {attendanceData && (
        <Card className="border-border shadow-[var(--shadow-card)]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-foreground">
              {attendanceData.class} - {new Date(attendanceData.date).toLocaleDateString()}
            </CardTitle>
            <div className="space-x-2">
              <Button
                onClick={handleMarkAllPresent}
                variant="outline"
                size="sm"
              >
                Mark All Present
              </Button>
              <Button
                onClick={handleSaveAttendance}
                className="bg-success hover:bg-success/90"
                size="sm"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Attendance
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {attendanceData.students.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-foreground">{student.name}</h4>
                      <p className="text-sm text-muted-foreground">Roll: {student.rollNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(student.status)}>
                      {student.status || 'Not Marked'}
                    </Badge>
                    
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant={student.status === 'present' ? 'default' : 'outline'}
                        onClick={() => handleMarkAttendance(student.id, 'present')}
                        className="h-8 w-8 p-0"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant={student.status === 'late' ? 'default' : 'outline'}
                        onClick={() => handleMarkAttendance(student.id, 'late')}
                        className="h-8 w-12 px-2"
                      >
                        Late
                      </Button>
                      
                      <Button
                        size="sm"
                        variant={student.status === 'absent' ? 'destructive' : 'outline'}
                        onClick={() => handleMarkAttendance(student.id, 'absent')}
                        className="h-8 w-8 p-0"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};