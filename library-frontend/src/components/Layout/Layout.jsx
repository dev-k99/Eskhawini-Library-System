import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  BookOpen, Home, User, LogOut, Menu, X, 
  BarChart2, Users, Clock, Leaf, Bell
} from 'lucide-react';

export default function Layout({ children }) {
  const { user, logout, isAdmin, isLibrarian } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/books', icon: BookOpen, label: 'Catalog' },
    { path: '/loans', icon: Clock, label: 'My Loans' },
    ...(isLibrarian ? [{ path: '/analytics', icon: BarChart2, label: 'Analytics' }] : []),
    ...(isAdmin ? [{ path: '/users', icon: Users, label: 'Users' }] : []),
    { path: '/sustainability', icon: Leaf, label: 'Eco Impact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 
        bg-gray-800/80 backdrop-blur-xl border-r border-gray-700/50
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-700/50">
            <Link to="/" className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">LibraryOS</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive(path) 
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' 
                    : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-100'}
                `}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{label}</span>
              </Link>
            ))}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-700/50">
            <div className="card p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-100 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-400">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full btn-secondary flex items-center justify-center gap-2 text-sm"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top navbar */}
        <header className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-400 hover:text-gray-100"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex-1" />

            {/* Notifications */}
            <button 
              className="relative p-2 text-gray-400 hover:text-gray-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent-500 rounded-full" />
              )}
            </button>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
