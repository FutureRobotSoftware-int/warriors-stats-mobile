const API_KEY: string = 'AIzaSyBKJF5do5iaLEranDvxHSHUOj-sAUWYQWw';

export function getGoogleDriveVideoUrl(id: string): string {
    // return `https://drive.google.com/uc?export=download&id=${id}`
    return `https://www.googleapis.com/drive/v3/files/${id}?alt=media&key=${API_KEY}`;
}

const cache = new Map<string, string | null>();

export async function fetchDriveIdByVideoName(
    videoName: string,
    folderId: string
): Promise<string | null> {
    const cacheKey = `${folderId}/${videoName}`;
    if (cache.has(cacheKey)) {
        return cache.get(cacheKey)!;
    }

    const fileName = `${videoName}.mp4`;
    const query = encodeURIComponent(`'${folderId}' in parents and name='${fileName}'`);
    const url = `https://www.googleapis.com/drive/v3/files?q=${query}&key=${API_KEY}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        const id = data.files?.[0]?.id ?? null;
        cache.set(cacheKey, id);
        return id;
    } catch (err) {
        console.error(`Error fetching video ${videoName}:`, err);
        return null;
    }
}
