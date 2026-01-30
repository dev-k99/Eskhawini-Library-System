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
import { useState, useEffect } from 'react';

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin, isLibrarian } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // DEBUG: Remove this after confirming it works
  useEffect(() => {
    console.log('🔍 Layout Debug:');
    console.log('User:', user);
    console.log('isAdmin:', isAdmin);
    console.log('isLibrarian:', isLibrarian);
  }, [user, isAdmin, isLibrarian]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Navigation items based on user role
  const getNavItems = () => {
    console.log('🧭 Getting nav items for:', { isAdmin, isLibrarian });
    
    // Admin gets EVERYTHING - check this FIRST
    if (isAdmin) {
      console.log('✅ Returning ADMIN navigation');
      return [
        { icon: Home, label: 'Dashboard', path: '/' },
        { icon: Book, label: 'Catalog', path: '/books' },
        { icon: Clock, label: 'All Loans', path: '/loans' },
        { icon: Users, label: 'Users', path: '/users' },
        { icon: BarChart3, label: 'Analytics', path: '/analytics' },
        { icon: Leaf, label: 'Sustainability', path: '/sustainability' },
      ];
    }

    // Librarian gets most features
    if (isLibrarian) {
      console.log('✅ Returning LIBRARIAN navigation');
      return [
        { icon: Home, label: 'Dashboard', path: '/' },
        { icon: Book, label: 'Catalog', path: '/books' },
        { icon: Clock, label: 'All Loans', path: '/loans' },
        { icon: BarChart3, label: 'Analytics', path: '/analytics' },
        { icon: Leaf, label: 'Sustainability', path: '/sustainability' },
      ];
    }

    // Patron gets basic features
    console.log('✅ Returning PATRON navigation');
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
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive
                ? 'bg-primary-600/20 text-primary-400 font-medium'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-gray-800/50 backdrop-blur-xl border-r border-gray-700/50">
        {/* Logo */}
        <div className="p-6 border-b border-gray-700/50">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">LibraryOS</h1>
              <p className="text-xs text-gray-400">
                {isAdmin ? 'Admin Panel' : isLibrarian ? 'Librarian Panel' : 'Library System'}
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <NavLinks />
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-700/50">
          <div className="flex items-center gap-3 mb-3 p-3 bg-gray-700/50 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-100 truncate">{user?.name}</p>
              <p className="text-xs text-gray-400">
                {user?.role}
                {isAdmin && ' 🛡️'}
                {isLibrarian && !isAdmin && ' 📚'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          
          {/* Sidebar */}
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-gray-800 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-gray-700/50 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold gradient-text">LibraryOS</h1>
                  <p className="text-xs text-gray-400">
                    {isAdmin ? 'Admin' : isLibrarian ? 'Librarian' : 'Library'}
                  </p>
                </div>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              <NavLinks />
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-gray-700/50">
              <div className="flex items-center gap-3 mb-3 p-3 bg-gray-700/50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-100 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-400">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar - Mobile */}
        <header className="lg:hidden sticky top-0 z-40 bg-gray-800/90 backdrop-blur-xl border-b border-gray-700/50 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <Menu className="h-6 w-6 text-gray-100" />
            </button>
            
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-lg font-bold gradient-text">LibraryOS</h1>
            </Link>

            <button className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors relative">
              <Bell className="h-6 w-6 text-gray-100" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
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
        <footer className="border-t border-gray-700/50 bg-gray-800/30 py-6 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>© 2026 LibraryOS. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-gray-200 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-200 transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-200 transition-colors">Support</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}