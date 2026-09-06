import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUnsyncedReports, markReportSynced, QueuedReport, saveQueuedReport } from '../services/offlineStore';
import { api } from '../services/api';

interface OfflineContextType {
  isOnline: boolean;
  unsyncedCount: number;
  isSyncing: boolean;
  queueOfflineReport: (report: Omit<QueuedReport, 'synced'>) => Promise<string>;
  syncPendingReports: () => Promise<void>;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [unsyncedCount, setUnsyncedCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const refreshUnsyncedCount = async () => {
    try {
      const pending = await getUnsyncedReports();
      setUnsyncedCount(pending.length);
    } catch (e) {
      console.warn('Could not read offline queue:', e);
    }
  };

  const syncPendingReports = async () => {
    if (!navigator.onLine || isSyncing) return;
    setIsSyncing(true);

    try {
      const pending = await getUnsyncedReports();
      for (const item of pending) {
        try {
          await api.reports.submit({
            latitude: item.latitude,
            longitude: item.longitude,
            locationDescription: item.locationDescription,
            districtId: item.districtId,
            landslideType: item.landslideType as any,
            severity: item.severity as any,
            description: item.description,
            reporterName: item.reporterName,
            reporterPhone: item.reporterPhone,
            reporterRole: item.reporterRole,
            offlineSyncId: item.offlineSyncId,
            roadBlocked: item.roadBlocked,
            casualtiesReported: item.casualtiesReported,
          });
          await markReportSynced(item.offlineSyncId);
        } catch (err) {
          console.error('[PahaarSaathi Offline Sync] Failed syncing report item:', item.offlineSyncId, err);
        }
      }
      await refreshUnsyncedCount();
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncPendingReports();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    refreshUnsyncedCount();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const queueOfflineReport = async (report: Omit<QueuedReport, 'synced'>): Promise<string> => {
    const syncId = await saveQueuedReport(report);
    await refreshUnsyncedCount();

    if (navigator.onLine) {
      syncPendingReports();
    }
    return syncId;
  };

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        unsyncedCount,
        isSyncing,
        queueOfflineReport,
        syncPendingReports,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};

export function useOffline() {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
}
