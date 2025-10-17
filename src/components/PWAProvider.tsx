'use client';

import { useEffect, useState } from 'react';

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAProvider() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

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
                }
              });
            }
          });
        } catch (error) {
          console.error('❌ SW registration failed:', error);
        }
      }
    };

    if (document.readyState === 'complete') {
      registerSW();
    } else {
      window.addEventListener('load', registerSW);
    }

    // Handle install prompt
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      console.log('📱 PWA install prompt available');
      
      // Auto-show install prompt after delay
      setTimeout(() => {
        if (deferredPrompt) {
          showInstallPrompt();
        }
      }, 5000);
    };

    // Check if app is already installed
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('📱 App running in standalone mode');
        setIsInstallable(false);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', () => {
      console.log('✅ PWA installed successfully');
      setDeferredPrompt(null);
      setIsInstallable(false);
    });

    checkInstalled();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [deferredPrompt]);

  const showInstallPrompt = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response: ${outcome}`);
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsInstallable(false);
      }
    } catch (error) {
      console.error('Install prompt failed:', error);
    }
  };

  const dismissInstallPrompt = () => {
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  // Auto-show install prompt after 8 seconds if not dismissed
  useEffect(() => {
    if (isInstallable && deferredPrompt) {
      const timer = setTimeout(() => {
        showInstallPrompt();
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [isInstallable, deferredPrompt]);

  if (!isInstallable) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 max-w-xs">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm mb-1">
              Install Keyat App
            </h3>
            <p className="text-gray-600 text-xs mb-2">
              Get the best experience with our app
            </p>
            <div className="flex space-x-2">
              <button
                onClick={showInstallPrompt}
                className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors flex-1"
              >
                Install
              </button>
              <button
                onClick={dismissInstallPrompt}
                className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-300 transition-colors"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}