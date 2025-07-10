export function getGoogleDriveVideoUrl(id: string) {
    // return `https://drive.google.com/uc?export=download&id=${id}`
    return `https://www.googleapis.com/drive/v3/files/${id}?alt=media&key=AIzaSyBKJF5do5iaLEranDvxHSHUOj-sAUWYQWw`
}
