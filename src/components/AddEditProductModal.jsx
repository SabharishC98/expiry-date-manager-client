import { useState, useEffect } from 'react';
import { X, Barcode, Calendar, Tag, MapPin, Package, FileText, Sparkles, Camera } from 'lucide-react';

const CATEGORIES = ['General', 'Dairy', 'Produce', 'Bakery', 'Pantry', 'Meat & Seafood', 'Beverages', 'Frozen', 'Medicine', 'Personal Care'];
const LOCATIONS = ['Pantry', 'Fridge', 'Freezer', 'Kitchen Cabinet', 'Medicine Cabinet', 'Countertop'];

export default function AddEditProductModal({ isOpen, onClose, onSave, initialData = null, isLoading = false }) {
  const [formData, setFormData] = useState({
    title: '',
    upc: '',
    amount: '',
    category: 'General',
    location: 'Pantry',
    expiryDate: '',
    notes: ''
  });
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        upc: initialData.upc || '',
        amount: initialData.amount || '',
        category: initialData.category || 'General',
        location: initialData.location || 'Pantry',
        expiryDate: initialData.expiryDate ? new Date(initialData.expiryDate).toISOString().split('T')[0] : '',
        notes: initialData.notes || ''
      });
    } else {
      // Default expiry date to 7 days from now
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 7);
      setFormData({
        title: '',
        upc: '',
        amount: '1 unit',
        category: 'General',
        location: 'Pantry',
        expiryDate: defaultDate.toISOString().split('T')[0],
        notes: ''
      });
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      // Generate a realistic 12-digit UPC code sample
      const randomUPC = Math.floor(100000000000 + Math.random() * 900000000000).toString();
      setFormData(prev => ({
        ...prev,
        upc: randomUPC,
        title: prev.title || 'Scanned Item #' + randomUPC.slice(-4)
      }));
      setIsScanning(false);
    }, 800);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Product title is required');
      return;
    }
    if (!formData.amount.trim()) {
      setError('Amount is required');
      return;
    }
    if (!formData.expiryDate) {
      setError('Expiry date is required');
      return;
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#12141a] border border-amber-500/20 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-amber-500/10 flex items-center justify-between bg-gradient-to-r from-amber-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {initialData ? 'Edit Product' : 'Add New Product'}
              </h2>
              <p className="text-xs text-gray-400">Enter product details & expiry date</p>
            </div>
          </div>
          <button
            id="close-modal-btn"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* UPC Barcode Section */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Barcode className="w-3.5 h-3.5 text-amber-400" /> UPC Barcode
              </span>
              <span className="text-gray-500 text-[10px]">Optional / Scan</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  id="product-upc-input"
                  type="text"
                  name="upc"
                  value={formData.upc}
                  onChange={handleChange}
                  placeholder="e.g. 012345678905"
                  className="w-full bg-[#1a1d26] border border-gray-700/60 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/60 transition-all font-mono"
                />
              </div>
              <button
                id="scan-barcode-btn"
                type="button"
                onClick={handleSimulateScan}
                disabled={isScanning}
                className="px-4 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-medium flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Camera className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
                {isScanning ? 'Scanning...' : 'Scan Code'}
              </button>
            </div>
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Title / Product Name <span className="text-amber-400">*</span>
            </label>
            <input
              id="product-title-input"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Fresh Organic Milk 1L"
              className="w-full bg-[#1a1d26] border border-gray-700/60 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/60 transition-all"
              required
            />
          </div>

          {/* Amount & Expiry Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-amber-400" /> Amount / Quantity <span className="text-amber-400">*</span>
              </label>
              <input
                id="product-amount-input"
                type="text"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="e.g. 500 ml or 2 packs"
                className="w-full bg-[#1a1d26] border border-gray-700/60 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/60 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" /> Expiry Date <span className="text-amber-400">*</span>
              </label>
              <input
                id="product-expiry-input"
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className="w-full bg-[#1a1d26] border border-gray-700/60 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/60 transition-all"
                required
              />
            </div>
          </div>

          {/* Category & Location Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-400" /> Category
              </label>
              <select
                id="product-category-select"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-[#1a1d26] border border-gray-700/60 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/60 transition-all"
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
                id="product-location-select"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full bg-[#1a1d26] border border-gray-700/60 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/60 transition-all"
              >
                {LOCATIONS.map(loc => (
                  <option key={loc} value={loc} className="bg-[#12141a] text-white">{loc}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-gray-400" /> Notes
            </label>
            <textarea
              id="product-notes-input"
              name="notes"
              rows="2"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add optional notes (e.g., opened on Monday, keep in top drawer)"
              className="w-full bg-[#1a1d26] border border-gray-700/60 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/60 transition-all"
            ></textarea>
          </div>

          {/* Modal Footer */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-800">
            <button
              id="cancel-modal-btn"
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              id="save-product-btn"
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold rounded-xl text-sm shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : initialData ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
