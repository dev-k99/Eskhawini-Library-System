import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  BookOpen, 
  Home, 
  Book, 
  Clock, 
  TrendingUp, 
  Leaf, 
  Users,
  BarChart3,
  LogOut, 
  Bell,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import NotificationToast from '../Notifications/NotificationToast';

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin, isLibrarian } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getNavItems = () => {
    if (isAdmin) {
      return [
        { icon: Home, label: 'Dashboard', path: '/' },
        { icon: Book, label: 'Catalog', path: '/books' },
        { icon: Clock, label: 'All Loans', path: '/loans' },
        { icon: Users, label: 'Users', path: '/users' },
        { icon: BarChart3, label: 'Analytics', path: '/analytics' },
        { icon: Leaf, label: 'Sustainability', path: '/sustainability' },
      ];
    }

    if (isLibrarian) {
      return [
        { icon: Home, label: 'Dashboard', path: '/' },
        { icon: Book, label: 'Catalog', path: '/books' },
        { icon: Clock, label: 'All Loans', path: '/loans' },
        { icon: BarChart3, label: 'Analytics', path: '/analytics' },
        { icon: Leaf, label: 'Sustainability', path: '/sustainability' },
      ];
    }

    return [
      { icon: Home, label: 'Dashboard', path: '/' },
      { icon: Book, label: 'Catalog', path: '/books' },
      { icon: Clock, label: 'My Loans', path: '/loans' },
      { icon: Leaf, label: 'Eco Impact', path: '/sustainability' },
    ];
  };

  const navItems = getNavItems();

  const NavLinks = () => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Icon className="h-5 w-5" strokeWidth={2} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">LibraryOS</h1>
              <p className="text-xs text-gray-500">
                {isAdmin ? 'Admin Panel' : isLibrarian ? 'Librarian Panel' : 'Library System'}
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <NavLinks />
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors font-medium"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white flex flex-col shadow-xl">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">LibraryOS</h1>
                  <p className="text-xs text-gray-500">
                    {isAdmin ? 'Admin' : isLibrarian ? 'Librarian' : 'Library'}
                  </p>
                </div>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              <NavLinks />
            </nav>

            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-3 mb-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors font-medium"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar - Mobile */}
        <header className="lg:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="h-6 w-6 text-gray-700" />
            </button>
            
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <h1 className="text-lg font-bold text-gray-900">LibraryOS</h1>
            </Link>

            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
              <Bell className="h-6 w-6 text-gray-700" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white py-6 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
            <p>© 2026 LibraryOS. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Support</a>
            </div>
          </div>
        </footer>
      </div>

      <NotificationToast />
    </div>
  );
}
