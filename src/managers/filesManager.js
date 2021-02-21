import { ImageLoader } from "../loaders/imageLoader.js";
import { VideoLoader } from "../loaders/videoLoader.js";
import { PanoramaLoader } from "../loaders/panoramaLoader.js";
import { CameraLoader } from "../loaders/cameraLoader.js";
import { RealtimeLoader } from "../loaders/realtimeLoader.js";
import * as SocketManager from './socketManager.js';
import { UserManager } from './userManager.js';
import { UIManager } from './UIManager.js';
import { loadXml } from "../utils/xmlLoader.js";




const jsonObj = {
    class: "FilesManager",
}


var thumbnails = [];
var thumbnailsLoaded = -1;




function LoadImage(url) {
    VideoLoader.Destroy();
    PanoramaLoader.Destroy();
    CameraLoader.Destroy();
    RealtimeLoader.Hide();
    ImageLoader.Load(url);

    /// send to clients
    if (UserManager.interactionType == "sender") {
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
    VideoLoader.Load(url, UserManager.userType);

    /// send to clients
    if (UserManager.interactionType == "sender") {
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
    PanoramaLoader.Load(data, UserManager.userType);

    /// send to clients
    if (UserManager.interactionType == "sender") {
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
    if (UserManager.interactionType == "sender") {
        jsonObj.action = "LoadCamera";
        jsonObj.data = data;
        SocketManager.FMEmitStringToOthers(JSON.stringify(jsonObj));
    }
}


// function LoadRealtime(data) {
//     // ImageLoader.Destroy();
//     // VideoLoader.Destroy();
//     // PanoramaLoader.Destroy();
//     // CameraLoader.Destroy();
//     RealtimeLoader.Load(data);

//     // /// send to clients
//     // if (UserManager.interactionType == "sender") {
//     //     jsonObj.action = "LoadRealtime";
//     //     jsonObj.data = data;
//     //     SocketManager.FMEmitStringToOthers(JSON.stringify(jsonObj));
//     // }
// }


function ShowRealtime() {
    ImageLoader.Destroy();
    VideoLoader.Destroy();
    PanoramaLoader.Destroy();
    CameraLoader.Destroy();
    RealtimeLoader.Show();

    /// send to clients
    if (UserManager.interactionType == "sender") {
        jsonObj.action = "ShowRealtime";
        SocketManager.FMEmitStringToOthers(JSON.stringify(jsonObj));
    }
}







// function loadThumbnails() {

//     thumbnailsLoaded++;
//     const i = thumbnailsLoaded;
//     if (i >= thumbnails.length) {
//         console.log("all thumbnails loaded");
//         return;
//     }

//     const url = thumbnails[i].data('data-url');
//     const fileName = thumbnails[i].data('data-fileName');
//     const classType = thumbnails[i].data('data-type');
//     var data;

//     console.log("class: " + classType)

//     switch (classType) {

//         case "image":
//             console.log("image")
//             // if (UserManager.userType == "master") {
//             //     var img = new Image();
//             //     img.src = url;
//             //     img.onload = function () {
//             //         thumbnails[i].find('img').attr('src', url);
//             //         thumbnails[i].find('p').text(fileName.slice(0, -4));
//             //         thumbnails[i].fadeIn(1000);
//             //         thumbnails[i].click(function () {
//             //             LoadImage(url);
//             //         });
//             //     };
//             // }
//             loadThumbnails();
//             break;


//         case "video":
//             console.log("video")
//             // if (UserManager.userType == "master") {
//             //     thumbnails[i].find('img').attr('src', './img/icon-video.png');
//             //     thumbnails[i].find('p').text(fileName.slice(0, -4));
//             //     thumbnails[i].fadeIn(1000);
//             //     thumbnails[i].click(function () {
//             //         LoadVideo(url);
//             //     });
//             // }
//             loadThumbnails();
//             break;


//         case "xml":
//             console.log("xml")
//             console.log("URL: " + url)
//             loadThumbnails();
//             break;


//         case "panorama":
//             console.log("panorama")
//             // if (UserManager.userType == "master") {
//             //     thumbnails[i].find('img').attr('src', './img/icon-panorama.png');
//             //     data = thumbnails[i].data('data');
//             //     thumbnails[i].find('p').text(fileName.slice(0, -4));
//             //     thumbnails[i].fadeIn(1000);
//             //     thumbnails[i].click(function () {
//             //         LoadPanorama(data);
//             //     });
//             // }
//             loadThumbnails();
//             break;


//         case "camera":
//             console.log("camera")
//             // if (UserManager.userType == "master") {
//             //     thumbnails[i].find('img').attr('src', './img/icon-camera.png');
//             //     data = thumbnails[i].data('data');
//             //     thumbnails[i].find('p').text(fileName.slice(0, -4));
//             //     thumbnails[i].fadeIn(1000);
//             //     thumbnails[i].click(function () {
//             //         LoadCamera(data);
//             //     });
//             // }
//             loadThumbnails();
//             break;


//         case "realtime":
//             console.log("realtime")
//             // if (UserManager.userType == "master") {
//             //     thumbnails[i].find('img').attr('src', './img/icon-realtime.png');
//             //     data = thumbnails[i].data('data');
//             //     thumbnails[i].find('p').text(fileName.slice(0, -4));
//             //     thumbnails[i].fadeIn(1000);
//             //     thumbnails[i].click(function () {
//             //         ShowRealtime();
//             //     });
//             // }
//             // console.log("eeee")
//             loadThumbnails();
//             // console.log("fffff")
//             // /// load immediately at start!
//             // LoadRealtime(data);
//             break;
//     }


// }







var fileLoading = -1;
function getFileFromHtmlTag(baseUrl, htmlElements) {

    fileLoading++;

    if (fileLoading >= htmlElements.length) {
        console.log("-- All files are retrived -- ")
        return;
    }



    /// get name and path
    var fullname = htmlElements[fileLoading].href;
    fullname = fullname.split("/");
    fullname = fullname[fullname.length - 1];

    const name = fullname.slice(0, -4);
    const extension = fullname.slice(-3).toLowerCase();
    const url = baseUrl + fullname;

    // console.log("------------------------------")
    // console.log("name: " + name)
    // console.log("extension: " + extension)
    // console.log("fullName: " + fullname)
    // console.log("url: " + url)


    switch (extension) {

        /////////////////////
        /// switch for IMAGE
        /////////////////////
        case "jpg":
        case "png":

            if (UserManager.userType == "master") {

                /// Create the thumbnail
                var img = new Image();
                img.src = url;
                img.onload = function () {

                    // const newThumbnail = $('#bottomBar').children().first().clone().appendTo('#bottomBar');
                    const newThumbnail = $('#bottomBar').children().first().clone();
                    newThumbnail.find('img').attr('src', url);
                    newThumbnail.find('p').text(name);
                    newThumbnail.attr("data-class", 'image');
                    // newThumbnail.fadeIn(500);
                    // newThumbnail.click(function () {
                    //     LoadImage(url);
                    // });

                    UIManager.addThumbnail(newThumbnail, function(){
                        LoadImage(url);
                    });

                    /// go for next
                    getFileFromHtmlTag(baseUrl, htmlElements);
                };
            }
            else {
                /// go for next
                getFileFromHtmlTag(baseUrl, htmlElements);
            }
            break;



        /////////////////////
        /// switch for VIDEO
        /////////////////////
        case "mp4":

            if (UserManager.userType == "master") {

                /// Create the thumbnail
                const newThumbnail = $('#bottomBar').children().first().clone().appendTo('#bottomBar');
                newThumbnail.find('img').attr('src', './img/icon-video.png');
                newThumbnail.find('p').text(name);
                newThumbnail.attr("data-class", 'video');
                // newThumbnail.fadeIn(500);
                // newThumbnail.click(function () {
                //     LoadVideo(url);
                // });
                UIManager.addThumbnail(newThumbnail, function(){
                    LoadVideo(url);
                });

                /// go for next
                getFileFromHtmlTag(baseUrl, htmlElements);
            }
            else {
                /// go for next
                getFileFromHtmlTag(baseUrl, htmlElements);
            }
            break;


        /////////////////////
        /// switch for XML
        /////////////////////
        case "xml":

            loadXml(url).then((xml) => {
                const data = xmlToJson.parse(xml);
                const classType = data.root.class;

                switch (classType) {

                    /////////////////////
                    /// switch for Realtime
                    /////////////////////
                    case "realtime":

                        /// HERE WE LOAD THE REALTIME ON START !!!!
                        console.log("** Loading Unity App... **")
                        RealtimeLoader.Load(data);


                        if (UserManager.userType == "master") {

                            /// Create the thumbnail
                            const newThumbnail = $('#bottomBar').children().first().clone().appendTo('#bottomBar');
                            newThumbnail.find('img').attr('src', './img/icon-realtime.png');
                            newThumbnail.find('p').text(name);
                            newThumbnail.attr("data-class", classType);
                            // newThumbnail.fadeIn(500);
                            // newThumbnail.click(function () {
                            //     ShowRealtime();
                            // });
                            UIManager.addThumbnail(newThumbnail, function(){
                                ShowRealtime();
                            });
                        }
                        /// go for next
                        getFileFromHtmlTag(baseUrl, htmlElements);
                        break;




                    /////////////////////
                    /// switch for Panorama
                    /////////////////////
                    case "panorama":
                        if (UserManager.userType == "master") {

                            /// Create the thumbnail
                            const newThumbnail = $('#bottomBar').children().first().clone().appendTo('#bottomBar');
                            newThumbnail.find('img').attr('src', './img/icon-panorama.png');
                            newThumbnail.find('p').text(name);
                            newThumbnail.attr("data-class", classType);
                            // newThumbnail.fadeIn(500);
                            // newThumbnail.click(function () {
                            //     LoadPanorama(data);
                            // });
                            UIManager.addThumbnail(newThumbnail, function(){
                                LoadPanorama(data);
                            });
                        }
                        /// go for next
                        getFileFromHtmlTag(baseUrl, htmlElements);
                        break;



                    /////////////////////
                    /// switch for RealtimeIP Camera
                    /////////////////////
                    case "camera":

                        if (UserManager.userType == "master") {

                            /// Create the thumbnail
                            const newThumbnail = $('#bottomBar').children().first().clone().appendTo('#bottomBar');
                            newThumbnail.find('img').attr('src', './img/icon-camera.png');
                            newThumbnail.find('p').text(name);
                            newThumbnail.attr("data-class", classType);
                            // newThumbnail.fadeIn(500);
                            // newThumbnail.click(function () {
                            //     LoadCamera(data);
                            // });
                            UIManager.addThumbnail(newThumbnail, function(){
                                LoadCamera(data);
                            });
                        }
                        /// go for next
                        getFileFromHtmlTag(baseUrl, htmlElements);
                        break;
                }
            });
            break;


        /// if extension is not recognized
        default:
            getFileFromHtmlTag(baseUrl, htmlElements);


    }



}



function listFilesFromUrl(url) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

            var html = xmlhttp.responseText;
            var parser = new DOMParser();
            var htmlDoc = parser.parseFromString(html, 'text/html');
            var htmlElements = htmlDoc.getElementsByTagName('a');

            /// effectively load the files
            getFileFromHtmlTag(url, htmlElements);
        }
    }
    xmlhttp.open("GET", url, false);
    xmlhttp.send();
}






///
/// INIT
///
export class FilesManager {

    static init(_url) {

        listFilesFromUrl(_url);

        ////////////////////////////////////////////////
        /// subscribe functions for OnReceiveData
        ////////////////////////////////////////////////
        SocketManager.OnReceivedData.push((dataString) => {


            /// this is just when the client has the control...
            ///////////////////////////////////////////////////////////////
            if (UserManager.interactionType == "sender" && UserManager.userType == "client") {

                const jsonObj = JSON.parse(dataString);
                console.log("receiving data....")

                switch (jsonObj.class) {

                    //////////
                    /// non so nice put it here...
                    /////////
                    case "UserManager":
                        UserManager.ReceiveData(jsonObj);
                        break;


                    default:
                        console.error("you should not come here!");
                        break;
                }
            }

            /// this is the default
            ////////////////////////////////////////////////////////////
            else if (UserManager.interactionType == "receiver") {

                const jsonObj = JSON.parse(dataString);
                console.log("receiving data....")
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

                            case "ShowRealtime":
                                ShowRealtime();
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
                        PanoramaLoader.ReceiveData(jsonObj);
                        break;


                    //////////
                    /// non so nice put it here...
                    /////////
                    case "UserManager":
                        UserManager.ReceiveData(jsonObj);
                        break;


                    default:
                        console.error("you should not come here!");
                        break;
                }
            }
        });
    }
}