import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Plus, Search, Filter, Trash2, Edit3, LogOut, Clock, AlertTriangle, 
  Calendar, CheckCircle2, ChevronLeft, ChevronRight, Package, RefreshCw, Barcode, MapPin, Tag
} from 'lucide-react';
import { productAPI, authAPI } from '../utils/api';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

export default function Dashboard() {
  const navigate = useNavigate();
  
  // User state
  const [user, setUser] = useState(null);
  
  // Data state
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ total: 0, expired: 0, expiring7Days: 0, expiring30Days: 0 });
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalProducts: 0, limit: 20 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [timeframeFilter, setTimeframeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  // Delete modal state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch current user details
  useEffect(() => {
    authAPI.getMe()
      .then(res => setUser(res.user))
      .catch(err => {
        console.error('Failed to load user session:', err);
        navigate('/login');
      });
  }, [navigate]);

  // Fetch products & stats whenever search or filters change
  const fetchProducts = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const [productData, statsData] = await Promise.all([
        productAPI.getProducts({
          page,
          limit: 20,
          search: searchTerm,
          timeframe: timeframeFilter,
          category: categoryFilter,
          location: locationFilter
        }),
        productAPI.getStats()
      ]);

      setProducts(productData.products || []);
      setPagination(productData.pagination || { currentPage: 1, totalPages: 1, totalProducts: 0, limit: 20 });
      setStats(statsData.stats || { total: 0, expired: 0, expiring7Days: 0, expiring30Days: 0 });
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, [searchTerm, timeframeFilter, categoryFilter, locationFilter]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      navigate('/login');
    }
  };

  // Navigation handlers for separate Add and Edit pages
  const handleGoToAddPage = () => {
    navigate('/products/add');
  };

  const handleGoToEditPage = (productId) => {
    navigate(`/products/edit/${productId}`);
  };

  // Delete handlers
  const handleOpenDeleteModal = (product) => {
    setDeletingProduct(product);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    try {
      await productAPI.deleteProduct(deletingProduct._id);
      setIsDeleteOpen(false);
      setDeletingProduct(null);
      fetchProducts(pagination.currentPage);
    } catch (err) {
      alert(err.message || 'Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper for Expiry Badge Styling
  const getExpiryBadge = (expiryDateStr) => {
    const expiry = new Date(expiryDateStr);
    const now = new Date();
    const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 border border-red-500/30 text-red-400">
          <AlertTriangle className="w-3 h-3" /> Expired ({Math.abs(diffDays)}d ago)
        </span>
      );
    } else if (diffDays <= 7) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-400">
          <Clock className="w-3 h-3" /> Expires in {diffDays}d
        </span>
      );
    } else if (diffDays <= 30) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">
          <Calendar className="w-3 h-3" /> Expires in {diffDays}d
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <CheckCircle2 className="w-3 h-3" /> Fresh ({diffDays}d)
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-gray-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#12141a]/80 backdrop-blur-md border-b border-amber-500/10 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-black font-bold shadow-lg shadow-amber-500/20">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-wide">ExpiryManager</span>
              <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400">
                Dashboard
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-semibold text-white">{user.name}</span>
                <span className="text-xs text-gray-400">{user.email}</span>
              </div>
            )}
            
            <Link
              to="/products/add"
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Product Page
            </Link>

            <button
              id="logout-btn"
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors border border-transparent hover:border-red-500/20"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-6">

        {/* Overview Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#12141a] border border-gray-800/80 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Total Products</p>
              <h3 className="text-2xl font-bold text-white mt-0.5">{stats.total}</h3>
            </div>
          </div>

          <div className="bg-[#12141a] border border-red-500/20 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Expired Items</p>
              <h3 className="text-2xl font-bold text-red-400 mt-0.5">{stats.expired}</h3>
            </div>
          </div>

          <div className="bg-[#12141a] border border-amber-500/20 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Expiring in 7 Days</p>
              <h3 className="text-2xl font-bold text-amber-400 mt-0.5">{stats.expiring7Days}</h3>
            </div>
          </div>

          <div className="bg-[#12141a] border border-yellow-500/20 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Expiring in 30 Days</p>
              <h3 className="text-2xl font-bold text-yellow-400 mt-0.5">{stats.expiring30Days}</h3>
            </div>
          </div>
        </div>

        {/* Search & Filters Toolbar */}
        <div className="bg-[#12141a] border border-gray-800/80 rounded-2xl p-4 space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="search-input"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products by title or UPC barcode..."
                className="w-full bg-[#1a1d26] border border-gray-700/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/60 transition-all"
              />
            </div>

            {/* Expiry Timeframe Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-amber-400 hidden sm:inline-block" />
              <select
                id="filter-timeframe-select"
                value={timeframeFilter}
                onChange={(e) => setTimeframeFilter(e.target.value)}
                className="bg-[#1a1d26] border border-gray-700/60 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/60 transition-all"
              >
                <option value="">All Expiry Dates</option>
                <option value="7days">Expiring within 7 days</option>
                <option value="1month">Expiring within 1 month</option>
                <option value="3months">Expiring within 3 months</option>
                <option value="expired">Expired Products</option>
                <option value="upcoming">Upcoming Expirations</option>
              </select>

              {/* Category Filter */}
              <select
                id="filter-category-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-[#1a1d26] border border-gray-700/60 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/60 transition-all hidden sm:block"
              >
                <option value="">All Categories</option>
                <option value="Dairy">Dairy</option>
                <option value="Produce">Produce</option>
                <option value="Bakery">Bakery</option>
                <option value="Pantry">Pantry</option>
                <option value="Beverages">Beverages</option>
                <option value="Medicine">Medicine</option>
              </select>

              {/* Refresh button */}
              <button
                id="refresh-products-btn"
                onClick={() => fetchProducts(pagination.currentPage)}
                className="p-2.5 bg-[#1a1d26] border border-gray-700/60 hover:bg-gray-800 text-gray-300 rounded-xl transition-colors"
                title="Refresh Product List"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => fetchProducts(1)} className="underline text-xs">Try again</button>
          </div>
        )}

        {/* Products Table / Empty State */}
        <div className="bg-[#12141a] border border-gray-800/80 rounded-2xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-12 text-center text-gray-400 space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-amber-400" />
              <p className="text-sm">Loading your products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="p-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
                <Package className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-bold text-white mb-1">No products found</h3>
                <p className="text-xs text-gray-400 mb-6">
                  {searchTerm || timeframeFilter || categoryFilter
                    ? 'No products match your search/filter criteria. Try resetting filters or search term.'
                    : 'You have no products tracked yet. Add your first item on the Add Product page!'}
                </p>
                <Link
                  to="/products/add"
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Go to Add Product Page
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#171a22] border-b border-gray-800 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4 sm:px-6">Product & Barcode</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Category & Location</th>
                    <th className="py-3.5 px-4">Expiry Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 text-sm">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-white/[0.02] transition-colors group">
                      {/* Product Name & UPC */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="font-semibold text-white group-hover:text-amber-400 transition-colors">
                          {product.title}
                        </div>
                        {product.upc ? (
                          <div className="text-xs text-gray-400 font-mono flex items-center gap-1 mt-0.5">
                            <Barcode className="w-3 h-3 text-amber-500/70" /> {product.upc}
                          </div>
                        ) : (
                          <div className="text-xs text-gray-500 italic mt-0.5">No UPC Code</div>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-4 text-gray-300 font-medium">
                        {product.amount}
                      </td>

                      {/* Category & Location */}
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1.5">
                          <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-gray-800 text-gray-300 border border-gray-700">
                            <Tag className="w-2.5 h-2.5 text-amber-400" /> {product.category || 'General'}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-gray-800 text-gray-300 border border-gray-700">
                            <MapPin className="w-2.5 h-2.5 text-amber-400" /> {product.location || 'Pantry'}
                          </span>
                        </div>
                      </td>

                      {/* Expiry Date */}
                      <td className="py-4 px-4 font-mono text-gray-300">
                        {new Date(product.expiryDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>

                      {/* Expiry Status Badge */}
                      <td className="py-4 px-4">
                        {getExpiryBadge(product.expiryDate)}
                      </td>

                      {/* Action buttons (Edit Page / Delete Modal) */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            id={`edit-page-btn-${product._id}`}
                            onClick={() => handleGoToEditPage(product._id)}
                            className="p-1.5 text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
                            title="Edit Product on Separate Page"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            id={`delete-btn-${product._id}`}
                            onClick={() => handleOpenDeleteModal(product)}
                            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete Product Inline"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-800/80 bg-[#12141a] flex items-center justify-between text-xs text-gray-400">
              <div>
                Showing page <span className="text-white font-bold">{pagination.currentPage}</span> of{' '}
                <span className="text-white font-bold">{pagination.totalPages}</span> ({pagination.totalProducts} items total)
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="prev-page-btn"
                  onClick={() => fetchProducts(pagination.currentPage - 1)}
                  disabled={pagination.currentPage <= 1 || loading}
                  className="px-3 py-1.5 bg-[#1a1d26] hover:bg-gray-800 text-gray-300 border border-gray-700/60 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-40 disabled:hover:bg-[#1a1d26]"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Prev
                </button>
                <button
                  id="next-page-btn"
                  onClick={() => fetchProducts(pagination.currentPage + 1)}
                  disabled={pagination.currentPage >= pagination.totalPages || loading}
                  className="px-3 py-1.5 bg-[#1a1d26] hover:bg-gray-800 text-gray-300 border border-gray-700/60 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-40 disabled:hover:bg-[#1a1d26]"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Inline Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        itemTitle={deletingProduct?.title || 'Product'}
        isLoading={isDeleting}
      />
    </div>
  );
}
