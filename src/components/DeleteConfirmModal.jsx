import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, itemTitle, isLoading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#12141a] border border-red-500/30 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            id="close-delete-modal"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-xl font-bold text-white mb-2">Delete Product?</h3>
        <p className="text-sm text-gray-400 mb-6">
          Are you sure you want to delete <span className="text-white font-medium">"{itemTitle}"</span>? This action cannot be undone.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            id="cancel-delete-btn"
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            id="confirm-delete-btn"
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-red-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
