import * as SocketManager from '../managers/socketManager.js';

const jsonObj = {
    class: "ImageLoader",
}

var viewer;
const container = document.getElementById('window-main');

export class PanoramaLoader {

    static Load(xml) {

        console.log(xml)

        viewer = new PhotoSphereViewer.Viewer({
            navbar: [
                'zoom',
            ],
            container: container,
            panorama: 'image.jpg',

            plugins: [
                [PhotoSphereViewer.MarkersPlugin, {
                    markers: [
                        {
                            id: 'new-marker',
                            longitude: '45deg',
                            latitude: '0deg',
                            image: 'pin-red.png',
                            width: 32,
                            height: 32,
                        },
                    ],
                }],
            ],
        });

        viewer.on('click', (e, data) => {
            console.log("iiiiiiiiiiii")
            // console.log(`${data.rightclick ? 'right clicked' : 'clicked'} at longitude: ${data.longitude} latitude: ${data.latitude}`);
        });

        viewer.on('position-updated', (e, position) => {
            console.log(`new position is longitude: ${position.longitude} latitude: ${position.latitude}`);
        });

        viewer.on('zoom-updated', (e, level) => {
            console.log(level);
        });
    };

    static Destroy() {
        if (viewer) {
            // viewer.destroy();
            viewer = null;
        }
        
    };

    // static ZoomTo(ratio) {
    //     console.log(ratio)
    //     if (viewer) viewer.zoomTo(ratio);

    // };

    // static MoveTo(x, y) {
    //     if (viewer) viewer.moveTo(x, y);
    // };

    ///
    /// receive data from socket
    ///
    static ReceiveData(obj) {
        if (viewer) {
            console.log(obj.action);

            if (obj.action == "move") {
                ImageLoader.MoveTo(obj.x, obj.y);
            }

            if (obj.action == "zoom") {
                ImageLoader.ZoomTo(obj.ratio);
            }
        }
    };
}