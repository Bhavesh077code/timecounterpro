import { useEffect, useState } from "react";

export default function InstallAppButton() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );

    window.addEventListener("appinstalled", handleAppInstalled);

    // Check if already installed
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (standalone) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );

      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();

    const { outcome } = await installPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
    }

    setInstallPrompt(null);
  };

  // Don't show if app is already installed
  if (isInstalled || !installPrompt) {
    return null;
  }

  return (
    <div className="w-full max-w-md">
      <button
        onClick={handleInstall}
        className="
          w-full
          flex items-center justify-center gap-3
          px-5 py-3.5
          rounded-xl
          bg-gradient-to-r from-purple-600 to-indigo-600
          text-white
          font-semibold
          text-sm sm:text-base
          shadow-lg shadow-purple-500/20
          border border-white/10
          hover:scale-[1.02]
          active:scale-[0.98]
          transition-all duration-200
        "
      >
        <span className="text-xl">📲</span>

        <span>
          Install TimeCounterPro
        </span>
      </button>

      <p className="text-center text-xs text-gray-400 mt-2">
        Install for faster access and offline use
      </p>
    </div>
  );
}