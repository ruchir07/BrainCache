import { usePopupStore } from '../store/popupStore';

const ShareLinkPopup = () => {
  const { showPopup, link, setShowPopup } = usePopupStore();

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded shadow-md w-[400px]">
        <h2 className="text-lg font-bold mb-2">🔗 Share Brain Link</h2>
        <div className="flex items-center justify-between border px-3 py-2 rounded">
          <span className="text-sm truncate">{link}</span>
          <button
            onClick={() => navigator.clipboard.writeText(link)}
            className="text-blue-600 font-medium"
          >
            Copy
          </button>
        </div>
        <div className="text-right mt-4">
          <button
            onClick={() => setShowPopup(false)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareLinkPopup;