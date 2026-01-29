import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { loansApi, analyticsApi } from '../../services/api';
import signalRService from '../../services/signalr';
import { 
  BookOpen, Clock, TrendingUp, Users, 
  ArrowRight, Bell, Loader2, AlertCircle
} from 'lucide-react';

export default function Dashboard() {
  const { user, isLibrarian } = useAuth();
  const [myLoans, setMyLoans] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loansResponse = await loansApi.getMy();
        setMyLoans(loansResponse.data);

        if (isLibrarian) {
          const statsResponse = await analyticsApi.getSummary();
          setStats(statsResponse.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up real-time notifications
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
  }, [user, isLibrarian]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
      </div>
    );
  }

  const activeLoans = myLoans.filter(l => l.status === 'Active');
  const overdueLoans = activeLoans.filter(l => new Date(l.dueDate) < new Date());

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="card p-8 bg-gradient-to-br from-primary-600/20 to-accent-600/20">
        <h1 className="text-3xl font-bold text-gray-100">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-400 mt-2">
          Your library dashboard is ready with the latest updates.
        </p>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="space-y-2">
          {notifications.map((notif, index) => (
            <div 
              key={index}
              className={`card p-4 flex items-center gap-3 animate-slide-up ${
                notif.type === 'warning' ? 'border-yellow-500/30' : 'border-green-500/30'
              }`}
            >
              <Bell className={`h-5 w-5 ${
                notif.type === 'warning' ? 'text-yellow-400' : 'text-green-400'
              }`} />
              <span className="text-gray-300">{notif.message}</span>
              <button 
                onClick={() => setNotifications(prev => prev.filter((_, i) => i !== index))}
                className="ml-auto text-gray-500 hover:text-gray-300"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Active Loans</p>
              <p className="text-2xl font-bold text-gray-100 mt-1">{activeLoans.length}</p>
            </div>
            <div className="p-3 bg-primary-500/20 rounded-xl">
              <BookOpen className="h-6 w-6 text-primary-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Overdue</p>
              <p className={`text-2xl font-bold mt-1 ${
                overdueLoans.length > 0 ? 'text-red-400' : 'text-gray-100'
              }`}>
                {overdueLoans.length}
              </p>
            </div>
            <div className={`p-3 rounded-xl ${
              overdueLoans.length > 0 ? 'bg-red-500/20' : 'bg-gray-700/50'
            }`}>
              <AlertCircle className={`h-6 w-6 ${
                overdueLoans.length > 0 ? 'text-red-400' : 'text-gray-400'
              }`} />
            </div>
          </div>
        </div>

        {isLibrarian && stats && (
          <>
            <div className="card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Books</p>
                  <p className="text-2xl font-bold text-gray-100 mt-1">{stats.totalBooks}</p>
                </div>
                <div className="p-3 bg-accent-500/20 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-accent-400" />
                </div>
              </div>
            </div>

            <div className="card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Users</p>
                  <p className="text-2xl font-bold text-gray-100 mt-1">{stats.totalUsers}</p>
                </div>
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <Users className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Active Loans */}
      <div className="card">
        <div className="p-5 border-b border-gray-700/50 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-100">Your Active Loans</h2>
          <Link to="/loans" className="text-primary-400 hover:text-primary-300 flex items-center gap-1">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        {activeLoans.length === 0 ? (
          <div className="p-8 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-gray-600 mb-3" />
            <p className="text-gray-400">No active loans</p>
            <Link to="/books" className="btn-primary inline-flex items-center gap-2 mt-4">
              Browse Catalog <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-700/50">
            {activeLoans.slice(0, 5).map((loan) => {
              const dueDate = new Date(loan.dueDate);
              const isOverdue = dueDate < new Date();
              const daysLeft = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));

              return (
                <div key={loan.id} className="p-5 flex items-center gap-4 hover:bg-gray-700/20">
                  <div className="p-3 bg-gray-700/50 rounded-xl">
                    <BookOpen className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-100 truncate">{loan.bookTitle}</h3>
                    <p className="text-sm text-gray-400">
                      Due: {dueDate.toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-lg text-sm ${
                    isOverdue 
                      ? 'bg-red-500/20 text-red-400' 
                      : daysLeft <= 3 
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-green-500/20 text-green-400'
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
        <Link to="/books" className="card-hover p-6 group">
          <BookOpen className="h-8 w-8 text-primary-400 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-gray-100">Browse Catalog</h3>
          <p className="text-sm text-gray-400 mt-1">Find your next read</p>
        </Link>

        <Link to="/loans" className="card-hover p-6 group">
          <Clock className="h-8 w-8 text-accent-400 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-gray-100">My Loans</h3>
          <p className="text-sm text-gray-400 mt-1">Manage your borrowings</p>
        </Link>

        <Link to="/sustainability" className="card-hover p-6 group">
          <TrendingUp className="h-8 w-8 text-green-400 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-gray-100">Eco Impact</h3>
          <p className="text-sm text-gray-400 mt-1">See your green footprint</p>
        </Link>
      </div>
    </div>
  );
}
