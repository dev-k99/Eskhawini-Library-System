import { useState, useEffect } from 'react';
import { loansApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  BookOpen, Clock, CheckCircle, AlertTriangle, 
  QrCode, Loader2, RotateCcw, X, AlertCircle
} from 'lucide-react';

// ─── Normalise the status field ──────────────────────────────────────────────
// Backend sends LoanStatus as an enum number: 0 = Active, 1 = Returned, 2 = Overdue
// Normalise everything to a lowercase string so the rest of the page is simple.
const STATUS_MAP = { 0: 'active', 1: 'returned', 2: 'overdue' };

function normaliseStatus(raw) {
  if (typeof raw === 'number') return STATUS_MAP[raw] || 'active';
  if (typeof raw === 'string') return raw.toLowerCase();
  return 'active';
}

// ─── QR Code Modal ───────────────────────────────────────────────────────────
function QRModal({ loan, onClose }) {
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetch = async () => {
      try {
        const response = await loansApi.getQRCode(loan.id);
        if (!cancelled) {
          setQrCode(response.data.qrCode);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || 'Failed to load QR code');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();
    return () => { cancelled = true; };
  }, [loan.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Card */}
      <div className="relative w-full max-w-sm bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-500/20 rounded-xl">
              <QrCode className="h-5 w-5 text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-100">Loan QR Code</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded-lg transition-colors">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Book title */}
          <p className="text-gray-300 font-medium text-center">{loan.bookTitle}</p>

          {/* QR / Spinner / Error */}
          {loading && (
            <div className="flex justify-center py-10">
              <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center gap-3 py-6">
              <div className="p-3 bg-red-500/10 rounded-full">
                <AlertCircle className="h-8 w-8 text-red-400" />
              </div>
              <p className="text-red-400 text-sm text-center">{error}</p>
              <button
                onClick={() => { setError(null); setLoading(true); }}
                className="btn-secondary text-sm flex items-center gap-2 mt-1"
              >
                <RotateCcw className="h-4 w-4" /> Retry
              </button>
            </div>
          )}

          {qrCode && !error && (
            <div className="bg-white p-4 rounded-xl flex items-center justify-center">
              <img src={qrCode} alt="Loan QR Code" className="w-48 h-48" />
            </div>
          )}

          {/* Loan details summary */}
          {!loading && !error && (
            <div className="bg-gray-700/40 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Loan ID</span>
                <span className="text-gray-200 font-medium">#{loan.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Book</span>
                <span className="text-gray-200 font-medium truncate ml-4 text-right">{loan.bookTitle}</span>
              </div>
              {loan.userName && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Borrower</span>
                  <span className="text-gray-200 font-medium">{loan.userName}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400">Checked out</span>
                <span className="text-gray-200 font-medium">{new Date(loan.checkoutDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Due date</span>
                <span className={`font-medium ${new Date(loan.dueDate) < new Date() ? 'text-red-400' : 'text-green-400'}`}>
                  {new Date(loan.dueDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}

          <p className="text-xs text-gray-500 text-center">
            Scan this code at the library kiosk for quick checkout / return
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <button onClick={onClose} className="w-full btn-secondary">Close</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main LoansPage ──────────────────────────────────────────────────────────
export default function LoansPage() {
  const { isLibrarian } = useAuth();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [qrLoan, setQrLoan] = useState(null);        // loan whose QR modal is open
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

      // Normalise every loan's status on the way in
      const normalised = (response.data || []).map(loan => ({
        ...loan,
        status: normaliseStatus(loan.status),
      }));
      setLoans(normalised);
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

  // ─── Filtering (all statuses are lowercase strings now) ─────────────────
  const filteredLoans = loans.filter(loan => {
    if (filter === 'active')   return loan.status === 'active';
    if (filter === 'returned') return loan.status === 'returned';
    if (filter === 'overdue')  return loan.status === 'active' && new Date(loan.dueDate) < new Date();
    return true; // 'all'
  });

  // ─── Status badge ───────────────────────────────────────────────────────
  const getStatusBadge = (loan) => {
    const isOverdue = loan.status === 'active' && new Date(loan.dueDate) < new Date();

    if (loan.status === 'returned') {
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

  // ─── Render ─────────────────────────────────────────────────────────────
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

      {/* Filter pills */}
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

      {/* Loans list */}
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
                {/* Book info */}
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

                {/* Status + actions */}
                <div className="flex items-center gap-3 flex-wrap">
                  {getStatusBadge(loan)}

                  {loan.status === 'active' && (
                    <>
                      <button
                        onClick={() => setQrLoan(loan)}
                        className="btn-secondary flex items-center gap-2"
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

      {/* QR modal — rendered only when a loan is selected */}
      {qrLoan && <QRModal loan={qrLoan} onClose={() => setQrLoan(null)} />}
    </div>
  );
}