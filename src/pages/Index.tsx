import { useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import { StudentList } from "@/components/StudentList";
import { AttendanceTracker } from "@/components/AttendanceTracker";
import { AttendanceReports } from "@/components/AttendanceReports";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  BarChart3,
  Menu,
  X
} from "lucide-react";

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'attendance', label: 'Mark Attendance', icon: UserCheck },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveSection} />;
      case 'students':
        return <StudentList />;
      case 'attendance':
        return <AttendanceTracker />;
      case 'reports':
        return <AttendanceReports />;
      default:
        return <Dashboard onNavigate={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-card border-border shadow-[var(--shadow-card)]"
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border shadow-[var(--shadow-elegant)]
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="p-6 border-b border-border">
            <h2 className="text-4xl font-bold text-foreground">
              AttendEase
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Attendance Made Easy
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  className={`
                    w-full justify-start gap-3 h-12 
                    ${activeSection === item.id 
                      ? 'bg-primary text-primary-foreground shadow-[var(--shadow-elegant)]' 
                      : 'hover:bg-muted text-foreground'
                    }
                  `}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Version 1.0.0
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 z-30 bg-background/80 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Content Area */}
        <main className="p-4 lg:p-8"
          style={{ marginTop: "-64vh" }}
          >
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
