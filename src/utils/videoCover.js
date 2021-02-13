export function GetVideoCover(_file, seekTo = 0.0, isLocalBlobPath = false) {

    // const file = isLocalBlobPath ? _file : URL.createObjectURL(_file);
    const file = _file;

    // console.log("getting video cover for file: ", file);
    return new Promise((resolve, reject) => {
        // load the file to a video player
        const vp = document.createElement('video');
        vp.setAttribute('src', file);
        vp.load();
        vp.addEventListener('error', (ex) => {
            reject("error when loading video file", ex);
        });
        // load metadata of the video to get video duration and dimensions
        vp.addEventListener('loadedmetadata', () => {
            // seek to user defined timestamp (in seconds) if possible
            if (vp.duration < seekTo) {
                reject("video is too short.");
                return;
            }
            // delay seeking or else 'seeked' event won't fire on Safari
            setTimeout(() => {
                vp.currentTime = seekTo;
            }, 200);
            // extract video thumbnail once seeking is complete
            vp.addEventListener('seeked', () => {
                // console.log('video is now paused at %ss.', seekTo);
                /// define a canvas to have the same dimension as the video
                const canvas = document.createElement("canvas");
                canvas.width = vp.videoWidth;
                canvas.height = vp.videoHeight;
                // draw the video frame to canvas
                
                const ctx = canvas.getContext("2d");
                
                ctx.drawImage(vp, 0, 0, canvas.width, canvas.height);
                // return the canvas image as a blob    
                ctx.canvas.toBlob(
                    blob => {
                        resolve(blob);
                    },
                    "image/jpeg",
                    0.75 /* quality */
                );
            });
        });
    });
}