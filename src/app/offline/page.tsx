// src/app/offline/page.tsx
'use client'; // Add this at the top

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4 safe-area-padding">
      <div className="text-center max-w-md w-full">
        <div className="w-24 h-24 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-3">You're Offline</h1>
        <p className="text-gray-600 mb-2 text-lg">
          It looks like you've lost your internet connection.
        </p>
        <p className="text-gray-500 mb-8 text-sm">
          Some features may not be available until you're back online.
        </p>
        
        <div className="space-y-3">
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
          >
            🔄 Try Again
          </button>
          <button 
            onClick={() => window.history.back()}
            className="w-full bg-gray-200 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
          >
            ↩️ Go Back
          </button>
        </div>

        <div className="mt-8 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
          <p className="text-yellow-800 text-sm">
            <strong>Tip:</strong> Keyat works better with an internet connection for real-time property updates and search.
          </p>
        </div>
      </div>
    </div>
  );
}