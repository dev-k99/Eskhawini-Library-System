import { useState, useEffect, useCallback } from 'react';
import { booksApi, loansApi, reservationsApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  Search, Mic, MicOff, BookOpen, Filter, Grid, List, 
  ChevronLeft, ChevronRight, Loader2, ShoppingCart, Clock,
  Plus, Pencil, Trash2, X, Check
} from 'lucide-react';

// ─── Add / Edit Modal ────────────────────────────────────────────────────────
function BookModal({ isOpen, onClose, onSave, editBook }) {
  const [form, setForm] = useState({
    title: '',
    author: '',
    isbn: '',
    genre: 'Fiction',
    description: '',
    coverUrl: '',
    totalCopies: 1,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Populate form when editing
  useEffect(() => {
    if (editBook) {
      setForm({
        title: editBook.title || '',
        author: editBook.author || '',
        isbn: editBook.isbn || '',
        genre: editBook.genre || 'Fiction',
        description: editBook.description || '',
        coverUrl: editBook.coverUrl || '',
        totalCopies: editBook.totalCopies || 1,
      });
    } else {
      setForm({ title: '', author: '', isbn: '', genre: 'Fiction', description: '', coverUrl: '', totalCopies: 1 });
    }
    setError('');
  }, [editBook, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'totalCopies' ? parseInt(value) || 1 : value }));
  };

  const handleSubmit = async () => {
    setError('');
    if (!form.title.trim()) return setError('Title is required');
    if (!form.author.trim()) return setError('Author is required');

    setSaving(true);
    try {
      if (editBook) {
        await booksApi.update(editBook.id, form);
      } else {
        await booksApi.create(form);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || (editBook ? 'Failed to update book' : 'Failed to create book'));
    } finally {
      setSaving(false);
    }
  };

  const genres = ['Fiction', 'Programming', 'Science', 'History', 'Biography', 'Mystery'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white border border-gray-200 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {editBook ? 'Edit Book' : 'Add New Book'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {error && (
            <div className="px-4 py-2 bg-red-100 border border-red-500/30 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-700 mb-1">Title *</label>
            <input name="title" value={form.title} onChange={handleChange}
              placeholder="e.g. Clean Code"
              className="input-field w-full" />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Author *</label>
            <input name="author" value={form.author} onChange={handleChange}
              placeholder="e.g. Robert C. Martin"
              className="input-field w-full" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">ISBN</label>
              <input name="isbn" value={form.isbn} onChange={handleChange}
                placeholder="978-..."
                className="input-field w-full" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Copies</label>
              <input name="totalCopies" type="number" min="1" value={form.totalCopies} onChange={handleChange}
                className="input-field w-full" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Genre</label>
            <select name="genre" value={form.genre} onChange={handleChange} className="input-field w-full">
              {genres.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              rows={3} placeholder="Short description of the book..."
              className="input-field w-full resize-none" />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Cover URL</label>
            <input name="coverUrl" value={form.coverUrl} onChange={handleChange}
              placeholder="https://..."
              className="input-field w-full" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-gray-900 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={saving}
            className="btn-primary flex items-center gap-2 text-sm">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            {saving ? 'Saving...' : editBook ? 'Save Changes' : 'Add Book'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirmation Modal ───────────────────────────────────────────────
function DeleteModal({ isOpen, book, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);

  if (!isOpen || !book) return null;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await booksApi.remove(book.id);
      onConfirm();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete book');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white border border-gray-200 rounded-2xl shadow-2xl">
        <div className="p-6">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Delete Book?</h3>
          <p className="text-sm text-gray-400 mt-1">
            Are you sure you want to delete <span className="text-gray-800 font-medium">"{book.title}"</span>? This action cannot be undone.
          </p>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 pb-6">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-gray-900 transition-colors">
            Cancel
          </button>
          <button onClick={handleDelete} disabled={deleting}
            className="px-4 py-2 text-sm bg-red-100 hover:bg-red-100 text-red-600 rounded-xl transition-colors flex items-center gap-2">
            {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main BookCatalog Component ──────────────────────────────────────────────
export default function BookCatalog() {
  const { isLibrarian, isAdmin } = useAuth();
  const canManage = isLibrarian || isAdmin; // Create + Edit
  const canDelete = isAdmin;                // Delete is admin-only (matches backend)

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isListening, setIsListening] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editBook, setEditBook] = useState(null); // null = add mode, object = edit mode
  const [deleteBook, setDeleteBook] = useState(null);

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

  // Voice search
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
      setSearchQuery(event.results[0][0].transcript);
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

  // Modal handlers
  const openAddModal = () => { setEditBook(null); setModalOpen(true); };
  const openEditModal = (book) => { setEditBook(book); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditBook(null); };
  const handleSave = () => { closeModal(); fetchBooks(); };
  const handleDeleteConfirm = () => { setDeleteBook(null); fetchBooks(); };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">Book Catalog</h1>
          <p className="text-gray-700">
            {canManage ? 'Manage and browse your library collection' : 'Discover your next great read'}
          </p>
        </div>
        {/* Add Book Button — visible to Admin & Librarian */}
        {canManage && (
          <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Book
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="card p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              placeholder="Search by title, author, or ISBN..."
              className="input-field pl-12 pr-12"
            />
            <button onClick={startVoiceSearch}
              className={`absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors
                ${isListening ? 'text-emerald-600 voice-pulse' : 'text-gray-400 hover:text-gray-900'}`}>
              {isListening ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </button>
          </div>

          <div className="flex gap-2 items-center">
            <Filter className="h-5 w-5 text-gray-400" />
            <select value={selectedGenre}
              onChange={(e) => { setSelectedGenre(e.target.value); setPage(1); }}
              className="input-field w-40">
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-1 bg-gray-50 rounded-xl p-1">
            <button onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-900'}`}>
              <Grid className="h-5 w-5" />
            </button>
            <button onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-900'}`}>
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading / Empty */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        </div>
      ) : books.length === 0 ? (
        <div className="card p-12 text-center">
          <BookOpen className="h-16 w-16 mx-auto text-gray-700 mb-4" />
          <h3 className="text-xl font-medium text-gray-700">No books found</h3>
          <p className="text-gray-700 mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          {/* Book Grid / List */}
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {books.map((book) => (
              <div key={book.id} className={`card-hover ${viewMode === 'list' ? 'flex gap-4' : ''}`}>
                {/* Cover */}
                <div className={`bg-gradient-to-br from-primary-600/20 to-accent-600/20 flex items-center justify-center
                  ${viewMode === 'grid' ? 'h-48 rounded-t-xl' : 'w-32 h-40 rounded-l-2xl flex-shrink-0'}`}>
                  {book.coverUrl ? (
                    <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover rounded-t-2xl" />
                  ) : (
                    <BookOpen className="h-16 w-16 text-gray-700" />
                  )}
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">{book.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{book.author}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="px-2 py-1 text-xs bg-gray-50 rounded-lg text-gray-700">{book.genre}</span>
                    <span className={`px-2 py-1 text-xs rounded-lg ${
                      book.availableCopies > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {book.availableCopies > 0 ? `${book.availableCopies} available` : 'Unavailable'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto pt-4">
                    {/* Borrow / Reserve — always visible */}
                    {book.availableCopies > 0 ? (
                      <button onClick={() => handleBorrow(book.id)} disabled={actionLoading === book.id}
                        className="btn-primary flex-1 text-sm flex items-center justify-center gap-2">
                        {actionLoading === book.id
                          ? <Loader2 className="h-4 w-4 animate-spin" />
                          : <><ShoppingCart className="h-4 w-4" /> Borrow</>}
                      </button>
                    ) : (
                      <button onClick={() => handleReserve(book.id)} disabled={actionLoading === book.id}
                        className="btn-secondary flex-1 text-sm flex items-center justify-center gap-2">
                        {actionLoading === book.id
                          ? <Loader2 className="h-4 w-4 animate-spin" />
                          : <><Clock className="h-4 w-4" /> Reserve</>}
                      </button>
                    )}

                    {/* Edit — Admin & Librarian */}
                    {canManage && (
                      <button onClick={() => openEditModal(book)}
                        className="p-2 rounded-xl bg-gray-50 hover:bg-blue-100 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit book">
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}

                    {/* Delete — Admin only */}
                    {canDelete && (
                      <button onClick={() => setDeleteBook(book)}
                        className="p-2 rounded-xl bg-gray-50 hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete book">
                        <Trash2 className="h-4 w-4" />
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
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="btn-secondary flex items-center gap-2">
                <ChevronLeft className="h-5 w-5" /> Previous
              </button>
              <span className="text-gray-400">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="btn-secondary flex items-center gap-2">
                Next <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <BookModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSave={handleSave}
        editBook={editBook}
      />
      <DeleteModal
        isOpen={!!deleteBook}
        book={deleteBook}
        onClose={() => setDeleteBook(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}