import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  CreditCard, 
  MessageSquare, 
  ClipboardCheck,
  LogOut,
  UserCheck,
  Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const adminLinks = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/students', icon: Users, label: 'Students' },
    { path: '/wardens', icon: UserCheck, label: 'Wardens' },
    { path: '/rooms', icon: Building2, label: 'Rooms' },
    { path: '/payments', icon: CreditCard, label: 'Payments' },
    { path: '/complaints', icon: MessageSquare, label: 'Complaints' },
    { path: '/attendance', icon: ClipboardCheck, label: 'Attendance' },
    { path: '/activity-log', icon: Activity, label: 'Activity Log' },
  ];

  const wardenLinks = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/warden/rooms', icon: Building2, label: 'My Rooms' },
    { path: '/warden/complaints', icon: MessageSquare, label: 'Complaints' },
    { path: '/attendance', icon: ClipboardCheck, label: 'Attendance' },
  ];

  const studentLinks = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/profile', icon: Users, label: 'Profile' },
    { path: '/payments', icon: CreditCard, label: 'Payments' },
    { path: '/complaints', icon: MessageSquare, label: 'Complaints' },
    { path: '/attendance', icon: ClipboardCheck, label: 'Attendance' },
  ];

  const links = user?.role === 'admin' ? adminLinks : 
                user?.role === 'warden' ? wardenLinks : studentLinks;

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-primary-600">Hostel Hub</h1>
        <p className="text-sm text-gray-500 mt-1 capitalize">{user?.role} Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-primary-50 text-primary-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={20} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full transition-all duration-200"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
