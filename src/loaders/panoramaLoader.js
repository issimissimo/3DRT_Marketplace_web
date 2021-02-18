import * as SocketManager from '../managers/socketManager.js';

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
        // console.log(images)


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
            markersPlugin = viewer.getPlugin(PhotoSphereViewer.MarkersPlugin);

            ///
            /// create markers for 1st image
            ///
            const markers = images[0].marker;
            console.log(markers)
            PanoramaLoader.AddMarkers(markers);

            ///
            /// on clicked marker
            ///
            markersPlugin.on('select-marker', (e, marker, data) => {
                PanoramaLoader.OnMarkerClicked(marker);
            });

        });

        viewer.on('click', (e, data) => {
            console.log(`${data.rightclick ? 'right clicked' : 'clicked'} at longitude: ${data.longitude} latitude: ${data.latitude}`);
        });

        viewer.on('position-updated', (e, position) => {
            jsonObj.action = "rotate";
            jsonObj.position = position;
            SocketManager.FMEmitStringToOthers(JSON.stringify(jsonObj));
        });

        viewer.on('zoom-updated', (e, level) => {
            jsonObj.action = "zoom";
            jsonObj.level = level;
            SocketManager.FMEmitStringToOthers(JSON.stringify(jsonObj));
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
        // markersPlugin.clearMarkers();

        if (Array.isArray(markers)) {
            for (let i = 0; i < markers.length; i++) {
                const marker = markers[i];
                PanoramaLoader.AddMarker(i.toString(), marker.tooltip, marker.longitude, marker.latitude, "img/pin-red.png", 32, marker.data);
            }
        }
        else {
            console.log("non è array")
            console.log(markers)
            PanoramaLoader.AddMarker("1", markers.tooltip, markers.longitude, markers.latitude, "img/pin-red.png", 32, markers.data);
        }
    };


    static AddMarker(id, tooltip, longitude, latitude, image, size, data) {
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
    };


    static OnMarkerClicked(marker) {

        /// Load new image
        if (!isNaN(marker.data.imageToLoad)) {
            console.log("carico altra img")
            PanoramaLoader.LoadNewImage(images[marker.data.imageToLoad]);
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
        }
    };
}