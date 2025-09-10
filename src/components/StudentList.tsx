import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, User, Book } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Student {
  id: string;
  name: string;
  class: string;
  rollNumber: string;
  attendanceRate: number;
  status: 'active' | 'inactive';
}

export const StudentList = () => {
  const [students, setStudents] = useState<Student[]>([
    { id: '1', name: 'Rahul Kumar', class: 'Class 5', rollNumber: '001', attendanceRate: 95, status: 'active' },
    { id: '2', name: 'Priya Sharma', class: 'Class 4', rollNumber: '002', attendanceRate: 88, status: 'active' },
    { id: '3', name: 'Amit Singh', class: 'Class 3', rollNumber: '003', attendanceRate: 92, status: 'active' },
    { id: '4', name: 'Sunita Devi', class: 'Class 5', rollNumber: '004', attendanceRate: 78, status: 'active' },
    { id: '5', name: 'Ravi Kumar', class: 'Class 2', rollNumber: '005', attendanceRate: 85, status: 'active' },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    class: '',
    rollNumber: ''
  });
  
  const { toast } = useToast();

  const classes = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNumber.includes(searchTerm);
    const matchesClass = filterClass === 'all' || student.class === filterClass;
    return matchesSearch && matchesClass;
  });

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.class || !newStudent.rollNumber) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const student: Student = {
      id: Date.now().toString(),
      name: newStudent.name,
      class: newStudent.class,
      rollNumber: newStudent.rollNumber,
      attendanceRate: 0,
      status: 'active'
    };

    setStudents([...students, student]);
    setNewStudent({ name: '', class: '', rollNumber: '' });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Student added successfully",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Student Management</h2>
          <p className="text-muted-foreground">Manage student records and information</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Student Name</Label>
                <Input
                  id="name"
                  placeholder="Enter student name"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="class">Class</Label>
                <Select 
                  value={newStudent.class} 
                  onValueChange={(value) => setNewStudent({...newStudent, class: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="rollNumber">Roll Number</Label>
                <Input
                  id="rollNumber"
                  placeholder="Enter roll number"
                  value={newStudent.rollNumber}
                  onChange={(e) => setNewStudent({...newStudent, rollNumber: e.target.value})}
                />
              </div>
              
              <Button onClick={handleAddStudent} className="w-full bg-primary hover:bg-primary/90">
                Add Student
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="border-border shadow-[var(--shadow-card)]">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by name or roll number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="min-w-[200px]">
              <Select value={filterClass} onValueChange={setFilterClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student List */}
      <Card className="border-border shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="text-foreground">Students ({filteredStudents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredStudents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No students found matching your criteria.
              </div>
            ) : (
              filteredStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-foreground">{student.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Book className="h-3 w-3" />
                          {student.class}
                        </span>
                        <span>Roll: {student.rollNumber}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-medium text-foreground">
                        {student.attendanceRate}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Attendance
                      </div>
                    </div>
                    
                    <Badge 
                      variant={student.attendanceRate >= 90 ? "default" : 
                               student.attendanceRate >= 75 ? "secondary" : "destructive"}
                    >
                      {student.attendanceRate >= 90 ? "Excellent" : 
                       student.attendanceRate >= 75 ? "Good" : "Poor"}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};