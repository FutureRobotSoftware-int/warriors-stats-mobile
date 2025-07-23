import { withRetry } from "./retry";

const API_KEY: string = 'AIzaSyBKJF5do5iaLEranDvxHSHUOj-sAUWYQWw';
const CACHE_KEY = 'driveVideoCache';

// Interface para tipar los datos del caché
interface CacheEntry {
    id: string | null;
    timestamp: number;
}

// Cargar caché desde LocalStorage al iniciar
function loadCache(): Map<string, CacheEntry> {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
        try {
            const parsed = JSON.parse(cachedData);
            return new Map<string, CacheEntry>(parsed);
        } catch (e) {
            console.error('Error parsing cache', e);
        }
    }
    return new Map<string, CacheEntry>();
}

// Guardar caché en LocalStorage
function saveCache(cache: Map<string, CacheEntry>) {
    const serializable = Array.from(cache.entries());
    localStorage.setItem(CACHE_KEY, JSON.stringify(serializable));
}

// Cache con tiempo de vida (TTL) de 24 horas
const cache = loadCache();

export function getGoogleDriveVideoUrl(id: string): string {
    return `https://www.googleapis.com/drive/v3/files/${id}?alt=media&key=${API_KEY}`;
}

export async function fetchDriveIdByVideoName(
    videoName: string,
    folderId: string
): Promise<string | null> {
    const cacheKey = `${folderId}/${videoName}`;
    const now = Date.now();
    const TTL = 24 * 60 * 60 * 1000;

    const cached = cache.get(cacheKey);
    if (cached && (now - cached.timestamp < TTL)) {
        return cached.id;
    }

    const fetchData = async () => {
        const fileName = `${videoName}.mp4`;
        const query = encodeURIComponent(`'${folderId}' in parents and name='${fileName}'`);
        const url = `https://www.googleapis.com/drive/v3/files?q=${query}&key=${API_KEY}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        return data.files?.[0]?.id ?? null;
    };

    try {
        const id = await withRetry(fetchData);
        cache.set(cacheKey, { id, timestamp: now });
        saveCache(cache);
        return id;
    } catch (err) {
        console.error(`Error fetching video ${videoName}:`, err);
        return cached?.id || null;
    }
}