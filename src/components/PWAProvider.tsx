'use client';

import { useEffect, useState } from 'react';

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
  
  interface Navigator {
    standalone?: boolean;
  }
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAProvider() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);

  useEffect(() => {
    // Register service worker
    const registerSW = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
          });
          
          console.log('🎯 SW registered successfully:', registration);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('🔄 New content available, please refresh.');
                  // You could show a "Update available" toast here
                }
              });
            }
          });
        } catch (error) {
          console.error('❌ SW registration failed:', error);
        }
      }
    };

    // Check if app is already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInAppBrowser = navigator.standalone;
      
      if (isStandalone || isInAppBrowser) {
        console.log('📱 App running in standalone mode');
        setIsInstalled(true);
        setIsInstallable(false);
        setShowCustomPrompt(false);
      }
    };

    // Handle install prompt
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      console.log('📱 PWA install prompt available');
      
      // Show custom prompt after 3 seconds (better UX than auto-showing native prompt)
      setTimeout(() => {
        if (!isInstalled) {
          setShowCustomPrompt(true);
        }
      }, 3000);
    };

    // Handle app installation
    const handleAppInstalled = () => {
      console.log('✅ PWA installed successfully');
      setDeferredPrompt(null);
      setIsInstallable(false);
      setIsInstalled(true);
      setShowCustomPrompt(false);
    };

    // Register events
    if (document.readyState === 'complete') {
      registerSW();
      checkInstalled();
    } else {
      window.addEventListener('load', () => {
        registerSW();
        checkInstalled();
      });
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const showInstallPrompt = async () => {
    if (!deferredPrompt) return;

    try {
      // Hide our custom prompt first
      setShowCustomPrompt(false);
      
      // Show native install prompt
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response: ${outcome}`);
      
      // Clear the prompt whether accepted or dismissed
      setDeferredPrompt(null);
      setIsInstallable(false);
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
      } else {
        // User dismissed - don't show again for this session
        localStorage.setItem('pwaPromptDismissed', 'true');
      }
    } catch (error) {
      console.error('Install prompt failed:', error);
      setShowCustomPrompt(true); // Show custom prompt again if native fails
    }
  };

  const dismissInstallPrompt = () => {
    setShowCustomPrompt(false);
    setDeferredPrompt(null);
    setIsInstallable(false);
    // Remember dismissal for this session
    localStorage.setItem('pwaPromptDismissed', 'true');
  };

  const handleLaterClick = () => {
    setShowCustomPrompt(false);
    // Show again after 1 hour
    setTimeout(() => {
      if (isInstallable && !isInstalled) {
        setShowCustomPrompt(true);
      }
    }, 60 * 60 * 1000); // 1 hour
  };

  // Don't show if already installed or user dismissed recently
  if (!showCustomPrompt || isInstalled) return null;

  // Check if user dismissed prompt in this session
  if (typeof window !== 'undefined' && localStorage.getItem('pwaPromptDismissed') === 'true') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200/80 backdrop-blur-sm p-4 max-w-xs animate-scale-in">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm mb-1">
              Install Keyat App
            </h3>
            <p className="text-gray-600 text-xs mb-3">
              Fast, offline, app-like experience
            </p>
            <div className="flex space-x-2">
              <button
                onClick={showInstallPrompt}
                className="bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-blue-700 transition-all duration-200 flex-1 shadow-sm hover:shadow-md active:scale-95"
              >
                Install Now
              </button>
              <button
                onClick={handleLaterClick}
                className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors border border-gray-200"
              >
                Later
              </button>
            </div>
          </div>
          <button
            onClick={dismissInstallPrompt}
            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors -mt-1 -mr-1"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        
        {/* App features badges */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-1">
            <span className="text-green-500 text-xs">⚡</span>
            <span className="text-gray-500 text-xs">Fast</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-blue-500 text-xs">📱</span>
            <span className="text-gray-500 text-xs">App-like</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-orange-500 text-xs">🔒</span>
            <span className="text-gray-500 text-xs">Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
}