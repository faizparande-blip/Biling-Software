import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import './PwaInstallButton.css';

export default function PwaInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIosModal, setShowIosModal] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // Capture Android / Chrome / Edge install prompt
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  if (isInstalled) {
    return null; // Don't show if already installed
  }

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else if (isIos) {
      setShowIosModal(true);
    } else {
      setShowIosModal(true); // Show manual guide
    }
  };

  return (
    <>
      <button
        type="button"
        className="btn-pwa-install"
        onClick={handleInstallClick}
        title="Install M.A.B TRADERS Application on Phone or PC"
      >
        <Smartphone size={16} />
        <span>Install App</span>
      </button>

      {/* Manual / iOS Instructions Modal */}
      {showIosModal && (
        <div className="install-modal-backdrop" onClick={() => setShowIosModal(false)}>
          <div className="install-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="install-modal-header">
              <h3>📲 How to Install the App</h3>
              <button className="btn-close-install" onClick={() => setShowIosModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="install-modal-body">
              {isIos ? (
                <ol className="install-steps">
                  <li>In Safari browser, tap the <strong>Share Button [⎋]</strong> at the bottom.</li>
                  <li>Scroll down and tap <strong>'Add to Home Screen'</strong>.</li>
                  <li>Tap <strong>'Add'</strong> in the top-right corner. The app will be installed on your device!</li>
                </ol>
              ) : (
                <ol className="install-steps">
                  <li>Click the <strong>three dots menu (⋮)</strong> in the browser's top-right corner.</li>
                  <li>Select <strong>'Install M.A.B TRADERS'</strong> or <strong>'Add to Home Screen'</strong>.</li>
                  <li>The app will install in one click and open like a native app!</li>
                </ol>
              )}
            </div>
            <div className="install-modal-footer">
              <button
                type="button"
                className="btn-modal-got-it"
                onClick={() => setShowIosModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
