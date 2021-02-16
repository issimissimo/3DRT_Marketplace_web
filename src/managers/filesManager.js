import * as videoCover from "../utils/videoCover.js";
import ImageLoader from "../loaders/imageLoader.js";
import VideoLoader from "../loaders/videoLoader.js";
import * as SocketManager from './socketManager.js';
import { loadXml } from "../utils/xmlLoader.js";



const jsonObj = {
    class: "FilesManager",
}

// var imageNames = [];
var thumbnails = [];
var thumbnailsLoaded = -1;
var usertype;



function openImage(url) {
    VideoLoader.Destroy();
    ImageLoader.Load(url);

    /// send to clients
    if (usertype == "master") {
        jsonObj.action = "LoadImage";
        jsonObj.url = url;
        SocketManager.FMEmitStringToOthers(JSON.stringify(jsonObj));
    }
}


function openVideo(url) {
    ImageLoader.Destroy();
    VideoLoader.Load(url, usertype);

    /// send to clients
    if (usertype == "master") {
        jsonObj.action = "LoadVideo";
        jsonObj.url = url;
        SocketManager.FMEmitStringToOthers(JSON.stringify(jsonObj));
    }
}


function openPanorama(xml) {
    console.log('open PANO!')
    console.log(xml)
    // ImageLoader.Destroy();
    // VideoLoader.Load(url, usertype);

    // /// send to clients
    // if (usertype == "master") {
    //     jsonObj.action = "LoadVideo";
    //     jsonObj.url = url;
    //     SocketManager.FMEmitStringToOthers(JSON.stringify(jsonObj));
    // }
}




function loadThumbnails() {

    thumbnailsLoaded++;
    const i = thumbnailsLoaded;
    if (i >= thumbnails.length) return;

    const url = thumbnails[i].data('data-url');
    const fileName = thumbnails[i].data('data-fileName');
    const type = thumbnails[i].data('data-type');

    switch (type) {

        case "image":
            var img = new Image();
            img.src = url;
            img.onload = function () {

                /// skip images for 360
                if (img.naturalWidth / img.naturalHeight != 2){
                    thumbnails[i].find('img').attr('src', url);
                    thumbnails[i].find('p').text(fileName.slice(0, -4));
                    thumbnails[i].fadeIn(1000);
                    thumbnails[i].click(function () {
                        openImage(url);
                    });
                }
                loadThumbnails();
            };
            break;


        case "video":
            console.log("detected video")
            thumbnails[i].find('img').attr('src', './img/icon-video.png');
            thumbnails[i].find('p').text(fileName.slice(0, -4));
            thumbnails[i].fadeIn(1000);
            thumbnails[i].click(function () {
                openVideo(url);
            });
            loadThumbnails();
            break;


        case "panorama":
            console.log("detected panorama!")
            thumbnails[i].find('img').attr('src', './img/icon-panorama.png');
            const xml = thumbnails[i].data('data-xml');
            thumbnails[i].find('p').text(fileName.slice(0, -4));
            thumbnails[i].fadeIn(1000);
            thumbnails[i].click(function () {
                openPanorama(xml);
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
                                const classType = xml.getElementsByTagName("class")[0].childNodes[0].nodeValue;
                                newThumbnail.data('data-type', classType);
                                newThumbnail.data('data-xml', xml);
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


            ////////////////////////////////////////////////
            /// subscribe functions for OnReceiveData
            ////////////////////////////////////////////////
            SocketManager.OnReceivedData.push((dataString) => {
                const jsonObj = JSON.parse(dataString);

                switch (jsonObj.class) {

                    case "FilesManager":

                        switch (jsonObj.action) {

                            case "LoadImage":
                                openImage(jsonObj.url);
                                break;

                            case "LoadVideo":
                                openVideo(jsonObj.url);
                                break;
                        }
                        break;


                    case "ImageLoader":
                        ImageLoader.ReceiveData(jsonObj);
                        break;


                    case "VideoLoader":
                        VideoLoader.ReceiveData(jsonObj);
                        break;
                }
            });
        }
    }
}