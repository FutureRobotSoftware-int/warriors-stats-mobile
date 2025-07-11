const API_KEY: string = 'AIzaSyBKJF5do5iaLEranDvxHSHUOj-sAUWYQWw';
const FOLDER_ID: string = '1-mNn968Sp2YvvufNnEG-U16WoM2s-LGd';

export function getGoogleDriveVideoUrl(id: string): string {
    // return `https://drive.google.com/uc?export=download&id=${id}`
    return `https://www.googleapis.com/drive/v3/files/${id}?alt=media&key=${API_KEY}`;
}

export async function fetchDriveIdByVideoName(videoName: string): Promise<string | null> {
    const fileName = `${videoName}.mp4`;
    const query = encodeURIComponent(`'${FOLDER_ID}' in parents and name='${fileName}'`);
    const url = `https://www.googleapis.com/drive/v3/files?q=${query}&key=${API_KEY}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.files?.length > 0) {
            return data.files[0].id;
        }
    } catch (err) {
        console.error(`Error fetching video ${videoName}:`, err);
    }

    return null;
}