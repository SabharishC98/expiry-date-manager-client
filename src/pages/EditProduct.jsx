import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Camera, Barcode, Calendar, Tag, MapPin, Package, FileText, Edit3, RefreshCw } from 'lucide-react';
import { productAPI } from '../utils/api';
import CameraScannerModal from '../components/CameraScannerModal';

const CATEGORIES = ['General', 'Dairy', 'Produce', 'Bakery', 'Pantry', 'Meat & Seafood', 'Beverages', 'Frozen', 'Medicine', 'Personal Care'];
const LOCATIONS = ['Pantry', 'Fridge', 'Freezer', 'Kitchen Cabinet', 'Medicine Cabinet', 'Countertop'];

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    upc: '',
    amount: '',
    category: 'General',
    location: 'Pantry',
    expiryDate: '',
    notes: ''
  });

  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      setIsFetching(true);
      setError('');
      try {
        const res = await productAPI.getProductById(id);
        const product = res.product;
        if (product) {
          setFormData({
            title: product.title || '',
            upc: product.upc || '',
            amount: product.amount || '',
            category: product.category || 'General',
            location: product.location || 'Pantry',
            expiryDate: product.expiryDate ? new Date(product.expiryDate).toISOString().split('T')[0] : '',
            notes: product.notes || ''
          });
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch product details');
      } finally {
        setIsFetching(false);
      }
    }
    loadProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBarcodeDetected = (scannedCode) => {
    setFormData(prev => ({
      ...prev,
      upc: scannedCode
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Product title is required.');
      return;
    }
    if (!formData.amount.trim()) {
      setError('Amount is required.');
      return;
    }
    if (!formData.expiryDate) {
      setError('Expiry date is required.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await productAPI.updateProduct(id, formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to update product');
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-[#0b0c10] flex items-center justify-center text-gray-400">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
          <span>Loading product details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0c10] text-gray-100 font-sans py-8 px-4 sm:px-6 lg:px-8 selection:bg-amber-500/30 selection:text-amber-200">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Top Header / Back Button */}
        <div className="flex items-center justify-between">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#12141a] hover:bg-gray-800 border border-gray-800 text-gray-300 rounded-xl text-xs sm:text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" /> Back to Dashboard
          </Link>
          <span className="text-xs text-gray-500">Edit Product Page</span>
        </div>

        {/* Main Card Container */}
        <div className="bg-[#12141a] border border-amber-500/20 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-6 border-b border-gray-800">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Edit3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Edit Product</h1>
              <p className="text-xs text-gray-400">Update product attributes or scan new barcode</p>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Barcode & Device Camera Scanning */}
            <div className="bg-[#171a22] border border-gray-800 p-4 rounded-xl space-y-2">
              <label className="block text-xs font-semibold text-gray-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <Barcode className="w-4 h-4" /> UPC Barcode Code
                </span>
                <span className="text-gray-500 text-[11px]">Manual entry or camera scan</span>
              </label>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  id="edit-upc-barcode-input"
                  type="text"
                  name="upc"
                  value={formData.upc}
                  onChange={handleChange}
                  placeholder="e.g. 012345678905"
                  className="flex-1 bg-[#1a1d26] border border-gray-700/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/60 font-mono"
                />

                <button
                  id="edit-open-camera-scanner-btn"
                  type="button"
                  onClick={() => setIsCameraOpen(true)}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <Camera className="w-4 h-4" /> Scan with Device Camera
                </button>
              </div>
            </div>

            {/* Product Title */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-amber-400" /> Title / Product Name <span className="text-amber-400">*</span>
              </label>
              <input
                id="edit-product-title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Fresh Organic Milk 1L"
                className="w-full bg-[#1a1d26] border border-gray-700/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/60 transition-all"
                required
              />
            </div>

            {/* Amount & Expiry Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-amber-400" /> Amount / Quantity <span className="text-amber-400">*</span>
                </label>
                <input
                  id="edit-product-amount"
                  type="text"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="e.g. 500 ml or 2 packs"
                  className="w-full bg-[#1a1d26] border border-gray-700/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/60 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" /> Expiry Date <span className="text-amber-400">*</span>
                </label>
                <input
                  id="edit-product-expiry"
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full bg-[#1a1d26] border border-gray-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/60 transition-all"
                  required
                />
              </div>
            </div>

            {/* Category & Storage Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-400" /> Category
                </label>
                <select
                  id="edit-product-category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-[#1a1d26] border border-gray-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/60 transition-all"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat} className="bg-[#12141a] text-white">{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" /> Storage Location
                </label>
                <select
                  id="edit-product-location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full bg-[#1a1d26] border border-gray-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/60 transition-all"
                >
                  {LOCATIONS.map(loc => (
                    <option key={loc} value={loc} className="bg-[#12141a] text-white">{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-gray-400" /> Optional Notes
              </label>
              <textarea
                id="edit-product-notes"
                name="notes"
                rows="3"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add optional notes..."
                className="w-full bg-[#1a1d26] border border-gray-700/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/60 transition-all"
              />
            </div>

            {/* Form Action Buttons */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-800">
              <Link
                to="/dashboard"
                className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm font-medium transition-colors"
              >
                Cancel
              </Link>
              <button
                id="submit-edit-product-btn"
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold rounded-xl text-sm shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
              >
                {isLoading ? 'Updating Product...' : 'Update Product'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Device Camera Scanner Modal */}
      <CameraScannerModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onDetected={handleBarcodeDetected}
      />
    </div>
  );
}
