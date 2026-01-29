import { useState, useEffect } from 'react';
import { loansApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  BookOpen, Clock, CheckCircle, AlertTriangle, 
  QrCode, Loader2, RotateCcw
} from 'lucide-react';

export default function LoansPage() {
  const { isLibrarian } = useAuth();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchLoans();
  }, [isLibrarian]);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const response = isLibrarian 
        ? await loansApi.getAll()
        : await loansApi.getMy();
      setLoans(response.data);
    } catch (error) {
      console.error('Failed to fetch loans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (loanId) => {
    setActionLoading(loanId);
    try {
      await loansApi.return(loanId);
      fetchLoans();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to return book');
    } finally {
      setActionLoading(null);
    }
  };

  const handleShowQR = async (loan) => {
    setSelectedLoan(loan);
    try {
      const response = await loansApi.getQRCode(loan.id);
      setQrCode(response.data.qrCode);
    } catch (error) {
      console.error('Failed to get QR code:', error);
    }
  };

  const filteredLoans = loans.filter(loan => {
    if (filter === 'active') return loan.status === 'Active';
    if (filter === 'returned') return loan.status === 'Returned';
    if (filter === 'overdue') return loan.status === 'Active' && new Date(loan.dueDate) < new Date();
    return true;
  });

  const getStatusBadge = (loan) => {
    const isOverdue = loan.status === 'Active' && new Date(loan.dueDate) < new Date();
    
    if (loan.status === 'Returned') {
      return (
        <span className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm">
          <CheckCircle className="h-4 w-4" /> Returned
        </span>
      );
    }
    if (isOverdue) {
      return (
        <span className="flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm">
          <AlertTriangle className="h-4 w-4" /> Overdue
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 px-3 py-1 bg-primary-500/20 text-primary-400 rounded-lg text-sm">
        <Clock className="h-4 w-4" /> Active
      </span>
    );
  };

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">
            {isLibrarian ? 'All Loans' : 'My Loans'}
          </h1>
          <p className="text-gray-400 mt-1">
            {isLibrarian ? 'Manage all library loans' : 'Track your borrowed books'}
          </p>
        </div>
        <button onClick={fetchLoans} className="btn-secondary flex items-center gap-2">
          <RotateCcw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-2">
          {['all', 'active', 'overdue', 'returned'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl transition-all ${
                filter === f 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Loans List */}
      {filteredLoans.length === 0 ? (
        <div className="card p-12 text-center">
          <BookOpen className="h-16 w-16 mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-medium text-gray-300">No loans found</h3>
          <p className="text-gray-500 mt-2">
            {filter !== 'all' ? 'Try a different filter' : 'Start by borrowing a book'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLoans.map((loan) => (
            <div key={loan.id} className="card p-5">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Book Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-3 bg-gray-700/50 rounded-xl">
                    <BookOpen className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-100">{loan.bookTitle}</h3>
                    {isLibrarian && (
                      <p className="text-sm text-gray-400">Borrowed by: {loan.userName}</p>
                    )}
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-400">
                      <span>Checkout: {new Date(loan.checkoutDate).toLocaleDateString()}</span>
                      <span>Due: {new Date(loan.dueDate).toLocaleDateString()}</span>
                      {loan.returnDate && (
                        <span>Returned: {new Date(loan.returnDate).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center gap-3">
                  {getStatusBadge(loan)}
                  
                  {loan.status === 'Active' && (
                    <>
                      <button
                        onClick={() => handleShowQR(loan)}
                        className="btn-secondary flex items-center gap-2"
                        title="Show QR Code"
                      >
                        <QrCode className="h-4 w-4" />
                        <span className="hidden sm:inline">QR Code</span>
                      </button>
                      <button
                        onClick={() => handleReturn(loan.id)}
                        disabled={actionLoading === loan.id}
                        className="btn-primary flex items-center gap-2"
                      >
                        {actionLoading === loan.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            <span className="hidden sm:inline">Return</span>
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Code Modal */}
      {selectedLoan && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => { setSelectedLoan(null); setQrCode(null); }}
        >
          <div 
            className="card p-6 max-w-sm w-full animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-gray-100 mb-4 text-center">
              Loan QR Code
            </h3>
            <p className="text-gray-400 text-center mb-4">{selectedLoan.bookTitle}</p>
            
            {qrCode ? (
              <div className="bg-white p-4 rounded-xl flex items-center justify-center">
                <img src={qrCode} alt="Loan QR Code" className="w-48 h-48" />
              </div>
            ) : (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
              </div>
            )}
            
            <p className="text-xs text-gray-500 text-center mt-4">
              Scan this code at the library kiosk for checkout/return
            </p>
            
            <button 
              onClick={() => { setSelectedLoan(null); setQrCode(null); }}
              className="w-full btn-secondary mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
