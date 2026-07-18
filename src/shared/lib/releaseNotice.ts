import { storage } from './storage';

const RELEASE_SEEN_KEY = 'lastSeenReleaseVersion';

interface ManifestVersion {
  version?: string;
}

async function readCurrentVersion(): Promise<string | null> {
  if (typeof chrome !== 'undefined' && chrome.runtime?.getManifest) {
    return chrome.runtime.getManifest().version;
  }

  try {
    const response = await fetch('/manifest.json');
    if (!response.ok) return null;
    const manifest = await response.json() as ManifestVersion;
    return manifest.version ?? null;
  } catch {
    return null;
  }
}

export async function getPendingReleaseVersion(): Promise<string | null> {
  const currentVersion = await readCurrentVersion();
  if (!currentVersion) return null;

  const lastSeenVersion = await storage.get<string>(RELEASE_SEEN_KEY, '');
  return lastSeenVersion === currentVersion ? null : currentVersion;
}

export async function markReleaseVersionSeen(version: string): Promise<void> {
  await storage.set(RELEASE_SEEN_KEY, version);
}
