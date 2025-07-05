import { usePopupStore } from '../store/popupStore';
import { useState } from 'react';
import { Check, Copy, X } from 'lucide-react';

const ShareLinkPopup = () => {
  const { showPopup, link, setShowPopup } = usePopupStore();
  const [copied, setCopied] = useState(false);

  if (!showPopup) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">🔗 Share Brain Link</h2>
          <button
            onClick={() => setShowPopup(false)}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Link box */}
        <div className="bg-gray-100 rounded-lg flex items-center justify-between px-4 py-3 mb-4 border border-gray-200">
          <span
            className="text-sm text-gray-700 truncate max-w-[80%]"
            title={link}
          >
            {link}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>

        {/* Close Button */}
        <div className="text-right">
          <button
            onClick={() => setShowPopup(false)}
            className="text-sm text-gray-500 hover:text-gray-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareLinkPopup;
