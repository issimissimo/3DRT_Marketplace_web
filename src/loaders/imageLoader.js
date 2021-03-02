import * as SocketManager from '../managers/socketManager.js';
import { UserManager } from '../managers/userManager.js';

const jsonObj = {
    class: "ImageLoader",
}

var viewer;
const imageContainer = document.getElementById('imageContainer');

export class ImageLoader {

    static Load(url) {

        console.log("load image...")
        imageContainer.style.display = "inline";

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
            zoomRatio: 0.2,
            transition: false,
            button: false,
            view(event) {
                // console.log("view")
            },
            move(event) {
                if (UserManager.interactionType == "sender") {
                    jsonObj.action = "move";
                    jsonObj.x = event.detail.x;
                    jsonObj.y = event.detail.y;
                    SocketManager.FMEmitStringToOthers(JSON.stringify(jsonObj));
                }

            },
            zoom(event) {
                if (UserManager.interactionType == "sender") {
                    jsonObj.action = "zoom";
                    jsonObj.ratio = event.detail.ratio;
                    SocketManager.FMEmitStringToOthers(JSON.stringify(jsonObj));
                }
            },
            url() {
                return url;
            },
        });
    };

    static Destroy() {
        if (viewer) {
            viewer.destroy();
            viewer = null;
        }
        imageContainer.style.display = "none";
    };

    static ZoomTo(ratio) {
        console.log(ratio)
        if (viewer) viewer.zoomTo(ratio);

    };

    static MoveTo(x, y) {
        if (viewer) viewer.moveTo(x, y);
    };

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