import { useState, useEffect, useCallback } from 'react';
import { booksApi, loansApi, reservationsApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  Search, Mic, MicOff, BookOpen, Filter, Grid, List, 
  ChevronLeft, ChevronRight, Loader2, ShoppingCart, Clock
} from 'lucide-react';

export default function BookCatalog() {
  const { user, isLibrarian } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isListening, setIsListening] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const genres = ['Fiction', 'Programming', 'Science', 'History', 'Biography', 'Mystery'];

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await booksApi.getAll({
        query: searchQuery,
        genre: selectedGenre,
        page,
        pageSize: 12,
      });
      setBooks(response.data.items);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch books:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedGenre, page]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Voice search functionality
  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice search is not supported in your browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setPage(1);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  const handleBorrow = async (bookId) => {
    setActionLoading(bookId);
    try {
      await loansApi.create({ bookId });
      fetchBooks();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to borrow book');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReserve = async (bookId) => {
    setActionLoading(bookId);
    try {
      await reservationsApi.create({ bookId });
      alert('Book reserved successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to reserve book');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Book Catalog</h1>
          <p className="text-gray-400 mt-1">Discover your next great read</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by title, author, or ISBN..."
              className="input-field pl-12 pr-12"
              aria-label="Search books"
            />
            <button
              onClick={startVoiceSearch}
              className={`absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors
                ${isListening ? 'text-accent-400 voice-pulse' : 'text-gray-400 hover:text-gray-100'}`}
              aria-label="Voice search"
            >
              {isListening ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </button>
          </div>

          {/* Genre Filter */}
          <div className="flex gap-2 items-center">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={selectedGenre}
              onChange={(e) => {
                setSelectedGenre(e.target.value);
                setPage(1);
              }}
              className="input-field w-40"
              aria-label="Filter by genre"
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex gap-1 bg-gray-700/50 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-gray-400 hover:text-gray-100'
              }`}
              aria-label="Grid view"
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-gray-400 hover:text-gray-100'
              }`}
              aria-label="List view"
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
        </div>
      ) : books.length === 0 ? (
        <div className="card p-12 text-center">
          <BookOpen className="h-16 w-16 mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-medium text-gray-300">No books found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          {/* Books Grid/List */}
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {books.map((book) => (
              <div key={book.id} className={`card-hover ${viewMode === 'list' ? 'flex gap-4' : ''}`}>
                {/* Book Cover */}
                <div className={`
                  bg-gradient-to-br from-primary-600/20 to-accent-600/20 
                  flex items-center justify-center
                  ${viewMode === 'grid' ? 'h-48 rounded-t-2xl' : 'w-32 h-40 rounded-l-2xl flex-shrink-0'}
                `}>
                  {book.coverUrl ? (
                    <img 
                      src={book.coverUrl} 
                      alt={book.title}
                      className="w-full h-full object-cover rounded-t-2xl"
                    />
                  ) : (
                    <BookOpen className="h-16 w-16 text-gray-500" />
                  )}
                </div>

                {/* Book Details */}
                <div className="p-4 flex-1">
                  <h3 className="font-semibold text-gray-100 line-clamp-2">{book.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{book.author}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-1 text-xs bg-gray-700/50 rounded-lg text-gray-300">
                      {book.genre}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-lg ${
                      book.availableCopies > 0 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {book.availableCopies > 0 ? `${book.availableCopies} available` : 'Unavailable'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    {book.availableCopies > 0 ? (
                      <button
                        onClick={() => handleBorrow(book.id)}
                        disabled={actionLoading === book.id}
                        className="btn-primary flex-1 text-sm flex items-center justify-center gap-2"
                      >
                        {actionLoading === book.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <ShoppingCart className="h-4 w-4" />
                            Borrow
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReserve(book.id)}
                        disabled={actionLoading === book.id}
                        className="btn-secondary flex-1 text-sm flex items-center justify-center gap-2"
                      >
                        {actionLoading === book.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Clock className="h-4 w-4" />
                            Reserve
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary flex items-center gap-2"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-5 w-5" />
                Previous
              </button>
              <span className="text-gray-400">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-secondary flex items-center gap-2"
                aria-label="Next page"
              >
                Next
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
