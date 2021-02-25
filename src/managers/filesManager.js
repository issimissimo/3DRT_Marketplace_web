import { ImageLoader } from "../loaders/imageLoader.js";
import { VideoLoader } from "../loaders/videoLoader.js";
import { PanoramaLoader } from "../loaders/panoramaLoader.js";
import { CameraLoader } from "../loaders/cameraLoader.js";
import { RealtimeLoader } from "../loaders/realtimeLoader.js";
import * as SocketManager from './socketManager.js';
import { UserManager } from './userManager.js';
import { UIManager } from './UIManager.js';
import { DebugManager } from './debugManager.js';
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








var fileLoading = -1;
function getFileFromHtmlTag(baseUrl, htmlElements) {

    fileLoading++;

    if (fileLoading >= htmlElements.length) {
        console.log("-- All files are retrived -- ")

        UIManager.OnAssetLoaded();
        return;
    }



    /// get name and path
    var fullname = htmlElements[fileLoading].href;
    fullname = fullname.split("/");
    fullname = fullname[fullname.length - 1];

    const name = fullname.slice(0, -4);
    const extension = fullname.slice(-3).toLowerCase();
    const url = baseUrl + fullname;


    /// variables to create the thumbnail
    var classType;
    var onClickFunc;
    const callbackFunc = getFileFromHtmlTag(baseUrl, htmlElements);


    switch (extension) {

        /////////////////////
        /// switch for IMAGE
        /////////////////////
        case "jpg":
        case "png":

            classType = "image";

            onClickFunc = function () {
                UIManager.OnAssetClicked();
                LoadImage(url);
            };
            UIManager.createThumbnailFromAsset(classType, name, url, onClickFunc, callbackFunc);
            break;



        /////////////////////
        /// switch for VIDEO
        /////////////////////
        case "mp4":

            classType = "video";

            onClickFunc = function () {
                UIManager.OnAssetClicked();
                LoadVideo(url);
            }
            UIManager.createThumbnailFromAsset(classType, name, null, onClickFunc, callbackFunc);
            break;


        /////////////////////
        /// switch for XML
        /////////////////////
        case "xml":

            loadXml(url).then((xml) => {
                const data = xmlToJson.parse(xml);

                /// get classtype
                classType = data.root.class;

                /// get poster
                var poster = null;
                if (data.root.poster != undefined && typeof data.root.poster === 'string'){
                    poster = data.root.poster;
                } 

                switch (classType) {

                    /////////////////////
                    /// switch for Realtime
                    /////////////////////
                    case "realtime":


                        /// HERE WE LOAD THE REALTIME ON START !!!!
                        if (DebugManager.loadRealtime) {
                            console.log("** Loading Unity App... **")
                            RealtimeLoader.Load(data);
                        }


                        onClickFunc = function () {
                            UIManager.OnAssetClicked();
                            ShowRealtime();
                        }
                        UIManager.createThumbnailFromAsset(classType, name, poster, onClickFunc, callbackFunc);
                        break;



                    /////////////////////
                    /// switch for Panorama
                    /////////////////////
                    case "panorama":

                        onClickFunc = function () {
                            UIManager.OnAssetClicked();
                            LoadPanorama(data);
                        }
                        UIManager.createThumbnailFromAsset(classType, name, poster, onClickFunc, callbackFunc);
                        break;



                    /////////////////////
                    /// switch for RealtimeIP Camera
                    /////////////////////
                    case "camera":

                        onClickFunc = function () {
                            UIManager.OnAssetClicked();
                            LoadCamera(data);
                        }
                        UIManager.createThumbnailFromAsset(classType, name, poster, onClickFunc, callbackFunc);
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