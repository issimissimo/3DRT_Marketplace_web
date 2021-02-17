import { ImageLoader } from "../loaders/imageLoader.js";
import { VideoLoader } from "../loaders/videoLoader.js";
import { PanoramaLoader } from "../loaders/panoramaLoader.js";
import { CameraLoader } from "../loaders/cameraLoader.js";
import { RealtimeLoader } from "../loaders/realtimeLoader.js";
import * as SocketManager from './socketManager.js';
import { loadXml } from "../utils/xmlLoader.js";




const jsonObj = {
    class: "FilesManager",
}


var thumbnails = [];
var thumbnailsLoaded = -1;
var usertype;




function LoadImage(url) {
    VideoLoader.Destroy();
    PanoramaLoader.Destroy();
    CameraLoader.Destroy();
    RealtimeLoader.Hide();
    ImageLoader.Load(url);

    /// send to clients
    if (usertype == "master") {
        jsonObj.action = "LoadImage";
        jsonObj.url = url;
        SocketManager.FMEmitStringToOthers(JSON.stringify(jsonObj));
    }
}


function LoadVideo(url) {
    ImageLoader.Destroy();
    PanoramaLoader.Destroy();
    CameraLoader.Destroy();
    RealtimeLoader.Hide();
    VideoLoader.Load(url, usertype);

    /// send to clients
    if (usertype == "master") {
        jsonObj.action = "LoadVideo";
        jsonObj.url = url;
        SocketManager.FMEmitStringToOthers(JSON.stringify(jsonObj));
    }
}


function LoadPanorama(data) {
    ImageLoader.Destroy();
    VideoLoader.Destroy();
    CameraLoader.Destroy();
    RealtimeLoader.Hide();
    PanoramaLoader.Load(data, usertype);

    /// send to clients
    if (usertype == "master") {
        jsonObj.action = "LoadPanorama";
        jsonObj.data = data;
        SocketManager.FMEmitStringToOthers(JSON.stringify(jsonObj));
    }
}


function LoadCamera(data) {
    ImageLoader.Destroy();
    VideoLoader.Destroy();
    PanoramaLoader.Destroy();
    RealtimeLoader.Hide();
    CameraLoader.Load(data);

    /// send to clients
    if (usertype == "master") {
        jsonObj.action = "LoadCamera";
        jsonObj.data = data;
        SocketManager.FMEmitStringToOthers(JSON.stringify(jsonObj));
    }
}


function LoadRealtime(data) {
    ImageLoader.Destroy();
    VideoLoader.Destroy();
    PanoramaLoader.Destroy();
    CameraLoader.Destroy();
    RealtimeLoader.Load(data);

    /// send to clients
    if (usertype == "master") {
        jsonObj.action = "LoadRealtime";
        jsonObj.data = data;
        SocketManager.FMEmitStringToOthers(JSON.stringify(jsonObj));
    }
}




function loadThumbnails() {

    thumbnailsLoaded++;
    const i = thumbnailsLoaded;
    if (i >= thumbnails.length) {
        console.log("all thumbnails loaded");
        return;
    }

    const url = thumbnails[i].data('data-url');
    const fileName = thumbnails[i].data('data-fileName');
    const classType = thumbnails[i].data('data-type');
    var data;

    switch (classType) {

        case "image":
            var img = new Image();
            img.src = url;
            img.onload = function () {
                thumbnails[i].find('img').attr('src', url);
                thumbnails[i].find('p').text(fileName.slice(0, -4));
                thumbnails[i].fadeIn(1000);
                thumbnails[i].click(function () {
                    LoadImage(url);
                });
                loadThumbnails();
            };
            break;


        case "video":
            thumbnails[i].find('img').attr('src', './img/icon-video.png');
            thumbnails[i].find('p').text(fileName.slice(0, -4));
            thumbnails[i].fadeIn(1000);
            thumbnails[i].click(function () {
                LoadVideo(url);
            });
            loadThumbnails();
            break;


        case "panorama":
            thumbnails[i].find('img').attr('src', './img/icon-panorama.png');
            data = thumbnails[i].data('data');
            thumbnails[i].find('p').text(fileName.slice(0, -4));
            thumbnails[i].fadeIn(1000);
            thumbnails[i].click(function () {
                LoadPanorama(data);
            });
            loadThumbnails();
            break;


        case "camera":
            thumbnails[i].find('img').attr('src', './img/icon-camera.png');
            data = thumbnails[i].data('data');
            thumbnails[i].find('p').text(fileName.slice(0, -4));
            thumbnails[i].fadeIn(1000);
            thumbnails[i].click(function () {
                LoadCamera(data);
            });
            loadThumbnails();
            break;


        case "realtime":
            thumbnails[i].find('img').attr('src', './img/icon-realtime.png');
            data = thumbnails[i].data('data');
            thumbnails[i].find('p').text(fileName.slice(0, -4));
            thumbnails[i].fadeIn(1000);
            thumbnails[i].click(function () {
                LoadRealtime(data);
            });
            loadThumbnails();
            break;
    }


}



function listFilesFromUrl(url) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

            var html = xmlhttp.responseText;
            var parser = new DOMParser();
            var htmlDoc = parser.parseFromString(html, 'text/html');
            var x = htmlDoc.getElementsByTagName('a');

            for (var i = 0; i < x.length; i++) {

                const name = x[i].href;
                const extension = name.slice(-3).toLowerCase();

                if (extension == "jpg" || extension == "png" || extension == "mp4" || extension == "xml") {
                    const e = name.split("/");
                    const fileName = e[e.length - 1];

                    const newThumbnail = $('#bottomBar').children().first().clone().appendTo('#bottomBar');
                    newThumbnail.data('data-url', url + fileName);
                    newThumbnail.data('data-fileName', fileName);

                    switch (extension) {
                        case "jpg":
                        case "png":
                            newThumbnail.data('data-type', "image");
                            break;

                        case "mp4":
                            newThumbnail.data('data-type', "video");
                            break;

                        case "xml":
                            loadXml(url + fileName).then((xml) => {
                                const data = xmlToJson.parse(xml);
                                const classType = data.root.class;
                                console.log(classType);
                                newThumbnail.data('data-type', classType);
                                newThumbnail.data('data', data);
                            });
                            break;

                    }
                    thumbnails.push(newThumbnail);
                }
            }

            console.log("all file names loaded")
            loadThumbnails();
        }
    }
    xmlhttp.open("GET", url, false);
    xmlhttp.send();
}






///
/// INIT
///
export class FilesManager {

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


            ////////////////////////////////////////////////
            /// subscribe functions for OnReceiveData
            ////////////////////////////////////////////////
            SocketManager.OnReceivedData.push((dataString) => {
                const jsonObj = JSON.parse(dataString);

                switch (jsonObj.class) {

                    case "FilesManager":

                        switch (jsonObj.action) {

                            case "LoadImage":
                                LoadImage(jsonObj.url);
                                break;

                            case "LoadVideo":
                                LoadVideo(jsonObj.url);
                                break;

                            case "LoadPanorama":
                                LoadPanorama(jsonObj.data);
                                break;

                            case "LoadCamera":
                                LoadCamera(jsonObj.data);
                                break;

                            case "LoadRealtime":
                                LoadRealtime(jsonObj.data);
                                break;
                        }
                        break;


                    case "ImageLoader":
                        ImageLoader.ReceiveData(jsonObj);
                        break;


                    case "VideoLoader":
                        VideoLoader.ReceiveData(jsonObj);
                        break;


                    case "PanoramaLoader":
                        console.log(jsonObj)
                        PanoramaLoader.ReceiveData(jsonObj);
                        break;
                }
            });
        }
    }
}