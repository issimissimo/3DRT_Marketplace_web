import * as videoCover from "../src/utils/videoCover.js";
import ImageLoader from "../src/loaders/imageLoader.js";
import VideoLoader from "../src/loaders/videoLoader.js";
import * as SocketManager from '../src/socketManager.js';



const jsonObj = {
    class: "FilesManager",
}

var imageNames = [];
var thumbnails = [];
var thumbnailsLoaded = -1;
var usertype;



function openImage(url) {
    VideoLoader.Destroy();
    ImageLoader.Load(url);

    /// send to clients
    jsonObj.action = "LoadImage";
    jsonObj.url = url;
    SocketManager.FMEmitStringToOthers(JSON.stringify(jsonObj));
}


function openVideo(url) {
    ImageLoader.Destroy();
    VideoLoader.Load(url, usertype);

    /// send to clients
    jsonObj.action = "LoadVideo";
    jsonObj.url = url;
    SocketManager.FMEmitStringToOthers(JSON.stringify(jsonObj));
}




function loadThumbnails() {

    thumbnailsLoaded++;
    const i = thumbnailsLoaded;
    if (i >= thumbnails.length) return;

    const url = thumbnails[i].data('data-url');
    const type = thumbnails[i].data('data-type');

    switch (type) {

        case "image":
            var img = new Image();
            img.src = url;
            img.onload = function () {
                thumbnails[i].click(function () {
                    openImage(url);
                });
                thumbnails[i].attr('src', url);
                thumbnails[i].fadeIn(1000);

                loadThumbnails();
                // if (i < thumbnails.length - 1) {
                //     thumbnailsLoaded++;
                //     loadThumbnails();
                // }
            };
            break;


        case "video":
            console.log("detected video")
            thumbnails[i].click(function () {
                openVideo(url);
            });

            thumbnails[i].fadeIn(1000);

            loadThumbnails();
            // if (i < thumbnails.length - 1) {
            //     thumbnailsLoaded++;
            //     loadThumbnails();
            // }
            break;
    }


}



function listFilesFromUrl(url) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

            console.log("OK....")

            var html = xmlhttp.responseText;
            var parser = new DOMParser();
            var htmlDoc = parser.parseFromString(html, 'text/html');
            var x = htmlDoc.getElementsByTagName('a');

            for (var i = 0; i < x.length; i++) {

                const name = x[i].href;
                const extension = name.slice(-3).toLowerCase();

                if (extension == "jpg" || extension == "png" || extension == "mp4") {
                    const e = name.split("/");
                    const el = e[e.length - 1];
                    imageNames.push(el);


                    const newThumbnail = $('#bottomBar').children().first().clone().appendTo('#bottomBar');

                    switch (extension) {
                        case "jpg":
                        case "png":
                            newThumbnail.data('data-type', "image");
                            break;

                        case "mp4":
                            newThumbnail.data('data-type', "video");
                            break;

                        default:
                            console.warn("file nor recognized!");
                    }

                    newThumbnail.data('data-url', url + el);
                    thumbnails.push(newThumbnail);
                }
            }

            console.log("all file names loaded")
            loadThumbnails();

            // const imageCollection = loadImages(imageNames, )
        }
    }
    xmlhttp.open("GET", url, false);
    xmlhttp.send();
}






///
/// INIT
///
export default class FilesManager {

    static init(_url, _usertype) {
        usertype = _usertype;

        ///
        /// initializazion for "master" (server)
        ///
        if (usertype == "master") {

            /// enable interaction on the main view
            $('#window-main').css('pointer-events', 'all');

            /// load the files in the container to show them
            listFilesFromUrl(_url);
        }

        ///
        /// initializazion for "client" (client)
        ///
        if (usertype == "client") {

            /// disable interaction on the main view
            $('#window-main').css('pointer-events', 'none');

            /// subscribe functions for OnReceiveData
            SocketManager.OnReceivedData.push((dataString) => {
                const jsonObj = JSON.parse(dataString);

                if (jsonObj.class == "ImageLoader") {
                    ImageLoader.ReceiveData(jsonObj);
                }
                if (jsonObj.class == "FilesManager") {

                    if (jsonObj.action == "LoadImage") {
                        ImageLoader.Load(jsonObj.url);
                    }
                }
            });
        }
    }
}