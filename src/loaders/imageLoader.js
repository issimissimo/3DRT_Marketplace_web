import * as SocketManager from '../../src/socketManager.js';

const JsonObj = {
    class: "imageLoader",
}


var viewer;
const imageContainer = document.getElementById('imageContainer');


export default class ImageLoader {

    static Load(url, userType) {

        const interactionEnabled = userType == "master" ? true : false;

        if (viewer) {
            viewer.destroy();
            viewer = null;
        }

        viewer = new Viewer(imageContainer, {
            inline: true,
            backdrop: false,
            navbar: false,
            toolbar: false,
            title: false,
            movable: interactionEnabled,
            zoomable: interactionEnabled,
            zoomRatio: 0.2,
            view(event) {
                // console.log("view")
            },
            moved(event) {
                JsonObj.x = event.detail.x;
                JsonObj.y = event.detail.y;
                SocketManager.FMEmitStringToOthers(JSON.stringify(JsonObj));
            },
            zoomed(event) {
                JsonObj.ratio = event.detail.ratio;
                SocketManager.FMEmitStringToOthers(JSON.stringify(JsonObj));
            },
            url() {
                return url;
            },
        });
    };

    static Destroy() {
        if (viewer) viewer.destroy();

    };

    static Zoom(ratio) {
        if (viewer) viewer.zoom(ratio);

    };

    static Move(x, y) {
        if (viewer) viewer.move(x, y);
    };

    ///
    /// receive data from socket
    ///
    static ReceiveData(stringData) {
        // if (viewer) {
            const obj = JSON.parse(stringData);
            console.log(obj)
        // }
    };
}