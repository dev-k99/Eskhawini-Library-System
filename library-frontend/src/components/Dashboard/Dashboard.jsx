import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { loansApi, analyticsApi } from '../../services/api';
import signalRService from '../../services/signalr';
import { 
  BookOpen, Clock, TrendingUp, Users, 
  ArrowRight, Bell, Loader2, AlertCircle
} from 'lucide-react';

// Backend sends LoanStatus as an integer enum: 0 = Active, 1 = Returned, 2 = Overdue.
// Normalise to lowercase strings on arrival so every filter below just compares strings.
const STATUS_MAP = { 0: 'active', 1: 'returned', 2: 'overdue' };
const normaliseStatus = (raw) =>
  typeof raw === 'number' ? (STATUS_MAP[raw] ?? 'active') : String(raw).toLowerCase();

const normLoans = (loans) => (loans || []).map(l => ({ ...l, status: normaliseStatus(l.status) }));

export default function Dashboard() {
  const { user, isLibrarian, isAdmin } = useAuth();
  const [myLoans, setMyLoans] = useState([]);
  const [allLoans, setAllLoans] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);

  // Auto-hide welcome banner after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loansResponse = await loansApi.getMy();
        setMyLoans(normLoans(loansResponse.data));

        if (isLibrarian || isAdmin) {
          try {
            const allLoansResponse = await loansApi.getAll();
            setAllLoans(normLoans(allLoansResponse.data));
          } catch (error) {
            console.error('Failed to fetch all loans:', error);
            setAllLoans(normLoans(loansResponse.data));
          }

          try {
            const statsResponse = await analyticsApi.getSummary();
            setStats(statsResponse.data);
          } catch (error) {
            console.error('Failed to fetch stats:', error);
          }
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    signalRService.on('BookAvailable', (data) => {
      setNotifications(prev => [...prev, { type: 'success', message: data.message }]);
    });

    signalRService.on('LoanDueSoon', (data) => {
      setNotifications(prev => [...prev, { type: 'warning', message: data.message }]);
    });

    if (user) {
      signalRService.joinUserGroup(user.id);
    }

    return () => {
      signalRService.off('BookAvailable');
      signalRService.off('LoanDueSoon');
      if (user) {
        signalRService.leaveUserGroup(user.id);
      }
    };
  }, [user, isLibrarian, isAdmin]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
      </div>
    );
  }

  const displayLoans = (isLibrarian || isAdmin) ? allLoans : myLoans;
  const activeLoans  = displayLoans.filter(l => l.status === 'active');
  const overdueLoans = activeLoans.filter(l => new Date(l.dueDate) < new Date());

  return (
    <div className="space-y-8">
      {/* Welcome Section — fades out after 5 seconds, then collapses away */}
      <div
        className="overflow-hidden transition-all duration-700 ease-in-out"
        style={{
          maxHeight: showWelcome ? '200px' : '0px',
          opacity: showWelcome ? 1 : 0,
          marginBottom: showWelcome ? undefined : '0px',
        }}
      >
        <div className="bg-white border border-blue-200 rounded-xl p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            {isAdmin ? 'Admin dashboard - Full system overview' : 
             isLibrarian ? 'Librarian dashboard - Manage library operations' :
             'Your library dashboard is ready with the latest updates.'}
          </p>
        </div>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="space-y-2">
          {notifications.map((notif, index) => (
            <div 
              key={index}
              className={`bg-white border rounded-xl p-4 flex items-center gap-3 animate-slide-up shadow-sm ${
                notif.type === 'warning' ? 'border-yellow-300' : 'border-emerald-300'
              }`}
            >
              <Bell className={`h-5 w-5 ${
                notif.type === 'warning' ? 'text-yellow-600' : 'text-emerald-600'
              }`} strokeWidth={2} />
              <span className="text-gray-700 flex-1">{notif.message}</span>
              <button 
                onClick={() => setNotifications(prev => prev.filter((_, i) => i !== index))}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">
                {(isLibrarian || isAdmin) ? 'Total Active Loans' : 'Active Loans'}
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{activeLoans.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" strokeWidth={2} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">
                {(isLibrarian || isAdmin) ? 'Total Overdue' : 'Overdue'}
              </p>
              <p className={`text-3xl font-bold mt-2 ${
                overdueLoans.length > 0 ? 'text-red-600' : 'text-gray-900'
              }`}>
                {overdueLoans.length}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${
              overdueLoans.length > 0 ? 'bg-red-100' : 'bg-gray-100'
            }`}>
              <AlertCircle className={`h-6 w-6 ${
                overdueLoans.length > 0 ? 'text-red-600' : 'text-gray-400'
              }`} strokeWidth={2} />
            </div>
          </div>
        </div>

        {(isLibrarian || isAdmin) && stats && (
          <>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Books</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalBooks}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" strokeWidth={2} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <Users className="h-6 w-6 text-emerald-600" strokeWidth={2} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Active Loans */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {(isLibrarian || isAdmin) ? 'Recent Active Loans' : 'Your Active Loans'}
          </h2>
          <Link to="/loans" className="text-blue-600 hover:text-blue-700 flex items-center gap-1 font-semibold">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        {activeLoans.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-600">
              {(isLibrarian || isAdmin) ? 'No active loans in the system' : 'No active loans'}
            </p>
            {!isLibrarian && !isAdmin && (
              <Link to="/books" className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                Browse Catalog <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {activeLoans.slice(0, 5).map((loan) => {
              const dueDate = new Date(loan.dueDate);
              const isOverdue = dueDate < new Date();
              const daysLeft = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));

              return (
                <div key={loan.id} className="p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <BookOpen className="h-6 w-6 text-gray-600" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {loan.bookTitle || loan.book?.title || 'Unknown Book'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {(isLibrarian || isAdmin) && loan.userName && (
                        <span>Borrowed by {loan.userName} • </span>
                      )}
                      Due: {dueDate.toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap ${
                    isOverdue 
                      ? 'bg-red-100 text-red-700' 
                      : daysLeft <= 3 
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {isOverdue ? 'Overdue' : `${daysLeft} days left`}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/books" className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all">
          <BookOpen className="h-8 w-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" strokeWidth={2} />
          <h3 className="font-bold text-gray-900 text-lg">
            {(isLibrarian || isAdmin) ? 'Manage Catalog' : 'Browse Catalog'}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {(isLibrarian || isAdmin) ? 'Add and edit books' : 'Find your next read'}
          </p>
        </Link>

        <Link to="/loans" className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-purple-300 hover:shadow-md transition-all">
          <Clock className="h-8 w-8 text-purple-600 mb-3 group-hover:scale-110 transition-transform" strokeWidth={2} />
          <h3 className="font-bold text-gray-900 text-lg">
            {(isLibrarian || isAdmin) ? 'All Loans' : 'My Loans'}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {(isLibrarian || isAdmin) ? 'Manage all borrowings' : 'Manage your borrowings'}
          </p>
        </Link>

        {isAdmin ? (
          <Link to="/users" className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-emerald-300 hover:shadow-md transition-all">
            <Users className="h-8 w-8 text-emerald-600 mb-3 group-hover:scale-110 transition-transform" strokeWidth={2} />
            <h3 className="font-bold text-gray-900 text-lg">User Management</h3>
            <p className="text-sm text-gray-600 mt-1">Manage users and roles</p>
          </Link>
        ) : (isLibrarian || isAdmin) ? (
          <Link to="/analytics" className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-emerald-300 hover:shadow-md transition-all">
            <TrendingUp className="h-8 w-8 text-emerald-600 mb-3 group-hover:scale-110 transition-transform" strokeWidth={2} />
            <h3 className="font-bold text-gray-900 text-lg">Analytics</h3>
            <p className="text-sm text-gray-600 mt-1">View library statistics</p>
          </Link>
        ) : (
          <Link to="/sustainability" className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-emerald-300 hover:shadow-md transition-all">
            <TrendingUp className="h-8 w-8 text-emerald-600 mb-3 group-hover:scale-110 transition-transform" strokeWidth={2} />
            <h3 className="font-bold text-gray-900 text-lg">Eco Impact</h3>
            <p className="text-sm text-gray-600 mt-1">See your green footprint</p>
          </Link>
        )}
      </div>
    </div>
  );
}
