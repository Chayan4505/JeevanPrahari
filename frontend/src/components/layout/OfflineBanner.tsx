import React from 'react';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useOffline } from '../../context/OfflineContext';
import { useLanguage } from '../../context/LanguageContext';

export const OfflineBanner: React.FC = () => {
  const { isOnline, unsyncedCount, isSyncing, syncPendingReports } = useOffline();
  const { t } = useLanguage();

  if (isOnline && unsyncedCount === 0) return null;

  return (
    <div className={`w-full py-2 px-4 transition-colors z-30 flex items-center justify-between text-xs font-semibold ${
      !isOnline 
        ? 'bg-amber-600/90 text-amber-950 shadow-md' 
        : 'bg-gov-saffron-500 text-white'
    }`}>
      <div className="w-full flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          {!isOnline ? (
            <>
              <WifiOff className="w-4 h-4 text-amber-950 animate-pulse" />
              <span>{t.offlineMode}</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Back Online. {unsyncedCount} report(s) ready to sync.</span>
            </>
          )}
        </div>

        {unsyncedCount > 0 && (
          <button
            onClick={() => syncPendingReports()}
            disabled={!isOnline || isSyncing}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 text-[11px]"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? t.offlineQueueSyncing : `Sync (${unsyncedCount})`}</span>
          </button>
        )}
      </div>
    </div>
  );
};
