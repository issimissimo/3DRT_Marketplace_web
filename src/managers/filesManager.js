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

class Asset { };

var _allAssetRetrieved = false;

// function sendMessageToCreateAsset(url){
//     /// send to clients
//     if (UserManager.interactionType == "sender") {
//         jsonObj.action = "CreateAsset";
//         jsonObj.url = url;
//         SocketManager.FMEmitStringToOthers(JSON.stringify(jsonObj));
//     }
// }




function LoadImage(url) {
    UIManager.OnAssetClicked();
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
    UIManager.OnAssetClicked();
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
    UIManager.OnAssetClicked();
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
    UIManager.OnAssetClicked();
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
    UIManager.OnAssetClicked();
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


///////////////////////////////////////////////////////////////////////


// function TestForLoadAssetFromClientSide(url) {
//     if (UserManager.userType == "client") {
//         createNewAsset(url, null);
//     }
// }

var allAssetRetrieved = false;




///////////////////////////////////////////////////////////////////////////////////////////////////
/// create the asset
///////////////////////////////////////////////////////////////////////////////////////////////////
function createNewAsset(_asset, callback) {

    const properties = {
        url: _asset.url,
        extension: _asset.url.slice(-3).toLowerCase(),
        name: (function () {
            var _name = _asset.url.split("/");
            _name = _name[_name.length - 1];
            _name = _name.slice(0, -4);
            return _name;
        })(),
        classType: null,
        poster: null,
        onClick: null,
        selected: _asset.selected,
    };


    /// create asset...
    switch (properties.extension) {

        /////////////////////
        /// switch for IMAGE
        /////////////////////
        case "jpg":
        case "png":

            properties.classType = "image";
            properties.poster = properties.url;
            properties.onClick = function () {
                LoadImage(properties.url);
            };

            UIManager.createThumbnailFromAsset(properties, callback);

            break;



        /////////////////////
        /// switch for VIDEO
        /////////////////////
        case "mp4":

            properties.classType = "video";
            properties.onClick = function () {
                LoadVideo(properties.url);
            }

            UIManager.createThumbnailFromAsset(properties, callback);

            break;


        /////////////////////
        /// switch for XML
        /////////////////////
        case "xml":

            loadXml(properties.url).then((xml) => {
                const data = xmlToJson.parse(xml);

                /// get classtype
                properties.classType = data.root.class;

                /// get poster
                if (data.root.poster != undefined && typeof data.root.poster === 'string') {
                    properties.poster = data.root.poster;
                }

                switch (properties.classType) {

                    /////////////////////
                    /// switch for Realtime
                    /////////////////////
                    case "realtime":


                        /// HERE WE LOAD THE REALTIME ON START !!!!
                        if (DebugManager.loadRealtime && !RealtimeLoader.loaded) {
                            console.log("** Loading Unity App... **")
                            RealtimeLoader.Load(data);
                        }


                        properties.onClick = function () {
                            ShowRealtime();
                        }

                        UIManager.createThumbnailFromAsset(properties, callback);

                        break;



                    /////////////////////
                    /// switch for Panorama
                    /////////////////////
                    case "panorama":

                        properties.onClick = function () {
                            LoadPanorama(data);
                        }

                        UIManager.createThumbnailFromAsset(properties, callback);

                        break;



                    /////////////////////
                    /// switch for RealtimeIP Camera
                    /////////////////////
                    case "camera":

                        properties.onClick = function () {
                            LoadCamera(data);
                        }

                        UIManager.createThumbnailFromAsset(properties, callback);

                        break;
                }

            });
            break;


        /// if extension is not recognized
        default:
            console.log("file not recognized during loading: " + properties.extension);
            callback();
    }
}





///
/// iterate for every file in the html
/// and create a new asset from it
///
var fileLoading = -1;
function getFileFromHtmlTag(baseUrl, htmlElements) {

    fileLoading++;

    if (fileLoading >= htmlElements.length) {
        console.log("-- All files are retrived -- ")

        /// now, allow clients to load asset in their working space
        _allAssetRetrieved = true;

        /// call UI
        UIManager.OnAssetLoaded();

    }

    else {
        /// get name and path
        var fullname = htmlElements[fileLoading].href;
        fullname = fullname.split("/");
        fullname = fullname[fullname.length - 1];
        const url = baseUrl + fullname;


        /// iterate to continue for next
        const iterate = () => {
            getFileFromHtmlTag(baseUrl, htmlElements);
        }

        /// create the asset
        const newAsset = new Asset();
        newAsset.url = url;
        createNewAsset(newAsset, iterate);
    }
};





///
/// List files form URl (not so nice, it's a fake to use a real DB...)
///
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

                            case "CreateAsset":
                                createNewAsset(jsonObj.asset, null);
                                break;

                            // case "RemoveAsset":
                            //     UIManager.removeAsset(jsonObj.id);
                            //     break;

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


                    case "UIManager":
                        UIManager.ReceiveData(jsonObj);
                        break;


                    default:
                        console.error("you should not come here!");
                        break;
                }
            }
        });
    }

    static get allAssetRetrieved() {
        return _allAssetRetrieved;
    }



    /// send a message to the clients
    /// to create a new asset in their working space
    /// from the provided url
    static sendMessageToCreateAsset(_asset) {
        if (UserManager.interactionType == "sender") {
            jsonObj.action = "CreateAsset";
            jsonObj.asset = _asset;
            SocketManager.FMEmitStringToOthers(JSON.stringify(jsonObj));
        }
    }


    /// send a message to the clients
    /// to remove an asset from their working space
    /// from the provided url
    static sendMessageToRemoveAsset(id) {
        if (UserManager.interactionType == "sender") {
            jsonObj.action = "RemoveAsset";
            jsonObj.id = id;
            SocketManager.FMEmitStringToOthers(JSON.stringify(jsonObj));
        }
    }

}