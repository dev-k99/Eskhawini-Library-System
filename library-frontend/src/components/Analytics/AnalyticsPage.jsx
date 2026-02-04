import { useState, useEffect } from 'react';
import { analyticsApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { 
  TrendingUp, BookOpen, Users, Clock, 
  Loader2, BarChart2
} from 'lucide-react';

const COLORS = ['#0ea5e9', '#d946ef', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AnalyticsPage() {
  const { isLibrarian } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await analyticsApi.getSummary();
      setSummary(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLibrarian) {
    return (
      <div className="card p-12 text-center">
        <BarChart2 className="h-16 w-16 mx-auto text-gray-600 mb-4" />
        <h3 className="text-xl font-medium text-gray-300">Access Denied</h3>
        <p className="text-gray-500 mt-2">Analytics are only available to librarians and admins</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-black">Analytics Dashboard</h1>
        <p className="text-gray-700">Library usage insights and trends</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black-700">Total Books</p>
              <p className="text-3xl font-bold text-black-100 mt-1">{summary?.totalBooks || 0}</p>
            </div>
            <div className="p-3 bg-primary-500/20 rounded-xl">
              <BookOpen className="h-6 w-6 text-primary-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black-700">Total Users</p>
              <p className="text-3xl font-bold text-black-100 mt-1">{summary?.totalUsers || 0}</p>
            </div>
            <div className="p-3 bg-accent-500/20 rounded-xl">
              <Users className="h-6 w-6 text-accent-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black-700">Active Loans</p>
              <p className="text-3xl font-bold text-black-100 mt-1">{summary?.activeLoans || 0}</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-xl">
              <Clock className="h-6 w-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black-700">This Month</p>
              <p className="text-3xl font-bold text-black-100 mt-1">{summary?.totalLoansThisMonth || 0}</p>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-xl">
              <TrendingUp className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Borrowed Books */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-black-100 mb-4">Most Borrowed Books</h3>
          {summary?.topBooks?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={summary.topBooks} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9ca3af" />
                <YAxis 
                  type="category" 
                  dataKey="title" 
                  stroke="#9ca3af"
                  width={150}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '12px'
                  }}
                />
                <Bar dataKey="borrowCount" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No data available
            </div>
          )}
        </div>

        {/* Genre Distribution */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-black-100 mb-4">Genre Distribution</h3>
          {summary?.genreTrends?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={summary.genreTrends}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="borrowCount"
                  nameKey="genre"
                  label={({ genre, percentage }) => `${genre} (${percentage}%)`}
                  labelLine={false}
                >
                  {summary.genreTrends.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '12px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Top Books Table */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-gray-700/50">
          <h3 className="text-lg font-semibold text-black-100">Top Borrowed Books</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700/30">
                <th className="text-left p-4 text-sm font-medium text-black-400">#</th>
                <th className="text-left p-4 text-sm font-medium text-black-400">Title</th>
                <th className="text-left p-4 text-sm font-medium text-black-400">Author</th>
                <th className="text-right p-4 text-sm font-medium text-black-400">Borrows</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {summary?.topBooks?.map((book, index) => (
                <tr key={book.bookId} className="hover:bg-gray-700/20">
                  <td className="p-4 text-black-400">{index + 1}</td>
                  <td className="p-4 text-black-100 font-medium">{book.title}</td>
                  <td className="p-4 text-black-400">{book.author}</td>
                  <td className="p-4 text-right">
                    <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-lg">
                      {book.borrowCount}
                    </span>
                  </td>
                </tr>
              ))}
              {(!summary?.topBooks || summary.topBooks.length === 0) && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-700">
                    No borrowing data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
