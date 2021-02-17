import * as SocketManager from '../managers/socketManager.js';

const jsonObj = {
    class: "PanoramaLoader",
}

var viewer;
var images = [];
const container = document.getElementById('window-main');

export class PanoramaLoader {

    static Load(data, usertype) {
        images = data.root.image;
        const firstImage = images[0];
        const navbar = usertype == "master" ? ['zoom'] : null;

        viewer = new PhotoSphereViewer.Viewer({
            navbar: navbar,
            container: container,
            panorama: firstImage,

            plugins: [
                [PhotoSphereViewer.MarkersPlugin, {
                    markers: [
                        {
                            id: 'new-marker',
                            longitude: '45deg',
                            latitude: '0deg',
                            image: 'img/pin-red.png',
                            width: 32,
                            height: 32,
                        },
                    ],
                }],
            ],
        });

        viewer.on('click', (e, data) => {
            // console.log(`${data.rightclick ? 'right clicked' : 'clicked'} at longitude: ${data.longitude} latitude: ${data.latitude}`);
        });

        viewer.on('position-updated', (e, position) => {
            // console.log(`new position is longitude: ${position.longitude} latitude: ${position.latitude}`);
            jsonObj.action = "rotate";
            jsonObj.position = position;
            SocketManager.FMEmitStringToOthers(JSON.stringify(jsonObj));
        });

        viewer.on('zoom-updated', (e, level) => {
            // console.log(level);
            jsonObj.action = "zoom";
            jsonObj.level = level;
            SocketManager.FMEmitStringToOthers(JSON.stringify(jsonObj));
        });
    };


    static Rotate(position) {
        if (viewer) {
            viewer.rotate(position);
        }
    };


    static Zoom(level) {
        if (viewer) {
            viewer.zoom(level);
        }
    };




    static Destroy() {
        if (viewer) {
            viewer.destroy();
            viewer = null;
        }
    };

    

    ///
    /// receive data from socket
    ///
    static ReceiveData(obj) {
        if (viewer) {
            console.log(obj.action);

            if (obj.action == "rotate") {
                PanoramaLoader.Rotate(obj.position);
            }

            if (obj.action == "zoom") {
                PanoramaLoader.Zoom(obj.level);
            }
        }
    };
}