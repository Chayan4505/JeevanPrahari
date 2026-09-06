import { openDB } from 'idb';

export interface QueuedReport {
  offlineSyncId: string;
  latitude: number;
  longitude: number;
  locationDescription: string;
  districtId: string;
  landslideType: string;
  severity: string;
  description: string;
  reporterName: string;
  reporterPhone?: string;
  reporterRole: string;
  mediaBase64?: string;
  roadBlocked: boolean;
  casualtiesReported: number;
  createdAt: string;
  synced: boolean;
}

const DB_NAME = 'pahaarsaathi-offline-db';
const DB_VERSION = 1;
const STORE_NAME = 'queuedReports';

async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'offlineSyncId' });
        store.createIndex('by-synced', 'synced');
      }
    },
  });
}

export async function saveQueuedReport(report: Omit<QueuedReport, 'synced'>): Promise<string> {
  const db = await getDB();
  const item: QueuedReport = {
    ...report,
    synced: false,
  };
  await db.put(STORE_NAME, item);
  return report.offlineSyncId;
}

export async function getUnsyncedReports(): Promise<QueuedReport[]> {
  const db = await getDB();
  const all: QueuedReport[] = await db.getAll(STORE_NAME);
  return all.filter((r) => !r.synced);
}

export async function markReportSynced(offlineSyncId: string): Promise<void> {
  const db = await getDB();
  const item: QueuedReport | undefined = await db.get(STORE_NAME, offlineSyncId);
  if (item) {
    item.synced = true;
    await db.put(STORE_NAME, item);
  }
}

export async function clearSyncedReports(): Promise<void> {
  const db = await getDB();
  const all: QueuedReport[] = await db.getAll(STORE_NAME);
  for (const item of all) {
    if (item.synced) {
      await db.delete(STORE_NAME, item.offlineSyncId);
    }
  }
}
