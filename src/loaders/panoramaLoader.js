import * as SocketManager from '../managers/socketManager.js';
import { UserManager } from '../managers/userManager.js';


const jsonObj = {
    class: "PanoramaLoader",
}

var viewer;
var markersPlugin;
var images;
const container = document.getElementById('window-main');



export class PanoramaLoader {

    static Load(data, usertype) {
        images = data.root.image;

        const firstImage = images[0].url;

        viewer = new PhotoSphereViewer.Viewer({
            navbar: ['zoom'],
            container: container,
            panorama: firstImage,
            plugins: [
                [PhotoSphereViewer.MarkersPlugin],
            ],
        });

        viewer.once('ready', () => {

            if (UserManager.interactionType == "receiver") {
                PanoramaLoader.HideUI();
            }

            /// create markers for 1st image
            markersPlugin = viewer.getPlugin(PhotoSphereViewer.MarkersPlugin);
            const markers = images[0].marker;
            PanoramaLoader.AddMarkers(markers);


            /// register on clicked marker
            markersPlugin.on('select-marker', (e, marker, data) => {
                PanoramaLoader.OnMarkerClicked(marker);
            });


            /// register on interactionType changed
            /// to show-hide the UI
            UserManager.OnInteractionTypeChanged.push(() => {
                console.log("change UI")
                if (UserManager.interactionType == "receiver")
                    PanoramaLoader.HideUI();

                if (UserManager.interactionType == "sender")
                    PanoramaLoader.ShowUI();
            })
        });

        viewer.on('click', (e, data) => {
            console.log(`${data.rightclick ? 'right clicked' : 'clicked'} at longitude: ${data.longitude} latitude: ${data.latitude}`);
        });

        viewer.on('position-updated', (e, position) => {
            if (UserManager.interactionType == "sender") {
                jsonObj.action = "rotate";
                jsonObj.position = position;
                SocketManager.FMEmitStringToOthers(JSON.stringify(jsonObj));
            }
        });

        viewer.on('zoom-updated', (e, level) => {
            if (UserManager.interactionType == "sender") {
                jsonObj.action = "zoom";
                jsonObj.level = level;
                SocketManager.FMEmitStringToOthers(JSON.stringify(jsonObj));
            }
        });


    };

    static LoadNewImage(image) {
        if (viewer) {
            markersPlugin.clearMarkers();
            viewer.setPanorama(image.url)
                .then(function () {
                    const markers = image.marker;
                    PanoramaLoader.AddMarkers(markers);
                });
        }
    }

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

    static ShowUI() {
        if (viewer) {
            viewer.navbar.show();
        }
    };

    static HideUI() {
        if (viewer) {
            viewer.navbar.hide();
        }
    };

    static Destroy() {
        if (viewer) {
            viewer.destroy();
            viewer = null;
        }
    };


    static AddMarkers(markers) {
        if (viewer) {
            if (Array.isArray(markers)) {
                for (let i = 0; i < markers.length; i++) {
                    const marker = markers[i];
                    PanoramaLoader.AddMarker(i.toString(), marker.tooltip, marker.longitude, marker.latitude, "img/pin-red.png", 32, marker.data);
                }
            }
            else {
                PanoramaLoader.AddMarker("0", markers.tooltip, markers.longitude, markers.latitude, "img/pin-red.png", 32, markers.data);
            }
        }
    };


    static AddMarker(id, tooltip, longitude, latitude, image, size, data) {
        if (viewer) {
            console.log(tooltip)
            markersPlugin.addMarker({
                id: id,
                tooltip: { content: tooltip },
                longitude: longitude,
                latitude: latitude,
                image: image,
                width: size,
                height: size,
                data: data,
                style: { cursor: 'pointer', }
            });
        }
    };


    static OnMarkerClicked(marker) {

        /// Load new image
        if (!isNaN(marker.data)) {
            console.log("carico altra img")
            PanoramaLoader.LoadNewImage(images[marker.data]);

            if (UserManager.interactionType == "sender") {
                jsonObj.action = "markerClicked";
                jsonObj.marker = marker;
                SocketManager.FMEmitStringToOthers(JSON.stringify(jsonObj));
            }
        }

        /// or open scheda



    }



    ///
    /// receive data from socket
    ///
    static ReceiveData(obj) {
        if (viewer) {

            if (obj.action == "rotate") {
                PanoramaLoader.Rotate(obj.position);
            }

            if (obj.action == "zoom") {
                PanoramaLoader.Zoom(obj.level);
            }

            if (obj.action == "markerClicked") {
                PanoramaLoader.OnMarkerClicked(obj.marker);
            }
        }
    };
}