import * as SocketManager from '../managers/socketManager.js';
import { UserManager } from '../managers/userManager.js';


const jsonObj = {
    class: "PanoramaLoader",
}

var viewer;
var markersPlugin;
var images;
// var panel;
const container = document.getElementById('window-main');
const panelContainer = $("#panorama-panel");
panelContainer.find('#panorama-panel-button-close').click(function () {
    PanoramaLoader.HidePanel();

    /// send message
    jsonObj.action = "closePanel";
    SocketManager.FMEmitStringToOthers(JSON.stringify(jsonObj));
})



export class PanoramaLoader {

    static Load(data) {

        if (viewer) return;

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
                PanoramaLoader.OnMarkerClicked(marker.data);
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
            console.log(data)
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


    static ShowPanel(text) {
        panelContainer.fadeIn();

        // panelContainer.append(text);
        panelContainer.find('p').text(text);
    };


    static HidePanel() {
        panelContainer.fadeOut();


    };


    static Destroy() {
        if (viewer) {
            viewer.destroy();
            panelContainer.hide();
            viewer = null;
        }
    };


    static AddMarkers(markers) {
        if (viewer) {
            if (Array.isArray(markers)) {
                for (let i = 0; i < markers.length; i++) {
                    const marker = markers[i];
                    PanoramaLoader.AddMarker(i.toString(), marker.tooltip, marker.longitude, marker.latitude, marker.data);
                }
            }
            else {
                PanoramaLoader.AddMarker("0", markers.tooltip, markers.longitude, markers.latitude, markers.data);
            }
        }
    };


    static AddMarker(id, tooltip, longitude, latitude, data) {
        if (viewer) {
            console.log(tooltip)
            markersPlugin.addMarker({
                id: id,
                tooltip: { content: tooltip },
                longitude: longitude,
                latitude: latitude,
                image: isNaN(data) ? "img/icon-info.svg" : "img/icon-go.svg",
                width: 32,
                height: 32,
                data: data,
                style: { cursor: 'pointer', }
            });
        }
    };


    static OnMarkerClicked(data) {

        /// Load new image
        if (!isNaN(data)) {
            PanoramaLoader.HidePanel();
            PanoramaLoader.LoadNewImage(images[data]);
        }
        else {
            PanoramaLoader.ShowPanel(data);
        }


        if (UserManager.interactionType == "sender") {
            jsonObj.action = "markerClicked";
            jsonObj.data = data;
            console.log(jsonObj)
            SocketManager.FMEmitStringToOthers(JSON.stringify(jsonObj));
        }
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
                PanoramaLoader.OnMarkerClicked(obj.data);
            }

            if (obj.action == "closePanel") {
                PanoramaLoader.HidePanel();
            }
        }
    };
}