import { UserManager } from './userManager.js';
import { DebugManager } from './debugManager.js';
import { FilesManager } from './filesManager.js';
import * as SocketManager from './socketManager.js';


var selectedThumbnailId;
// var selectedThumbnail;
var thumbnails = [];

const thumbnailIcon = {
    'image': './img/icon-image.svg',
    'video': './img/icon-video.svg',
    'panorama': './img/icon-panorama.svg',
    'camera': './img/icon-camera.svg',
    'realtime': './img/icon-3d.svg',
}


const jsonObj = {
    class: "UIManager",
}



/// listener for filter buttons
function onFilterButtonClicked(el) {
    if (el != selectedFilterButton) {
        selectedFilterButton.removeClass('button-selected');
        UIManager.changeTab(el.data('class'));
        el.addClass('button-selected');
        selectedFilterButton = el;
    }

}


const filterButtons = $('.filters').children();
var selectedFilterButton;

for (let i = 0; i < filterButtons.length; i++) {
    const el = $(filterButtons[i]);
    el.click(function () {
        onFilterButtonClicked(el);
    })
}

selectedFilterButton = $(filterButtons[0]);














export class UIManager {


    ///
    /// the welcome window
    ///
    static ShowWelcome(callback) {
        if (DebugManager.showWelcome) {

            /// button for password submit
            $('#welcome-button-submit').click(function () {
                const passw = $('#password').val();
                if (passw == UserManager.masterPassw) {
                    console.log("**** access as master!");
                    UserManager.SetUserType("master", callback);
                }
                else {
                    console.log("ERROR: access as master is denied because wrong password");
                }
            });

            /// button for client
            $('#welcome-button-isClient').click(function () {
                console.log("**** access as client!");
                UserManager.SetUserType("client", callback);
            })

        }
        /// for debug, if we don't want to use the welcome
        /// so, just set the user as "master"
        else {
            UserManager.SetUserType("master", callback);
        }
    }




    ///
    /// called at start from UserManager
    ///
    static SetUI(callback) {

        console.log("Set UI...")

        /// Set UI elements for client
        if (UserManager.userType == 'client') {
            console.log("set UI for client")

            $('#toolbar-button-upload').css('display', 'none');
            $('#toolbar-button-shop').css('display', 'none');

            // $('.filters').css('display', 'none');
            // $('#bottomBar').css('visibility', 'hidden');

            $('#master-videochat-toolbar').css('display', 'none');
        }
        else if (UserManager.userType == 'master') {
            console.log("set UI for master")
            $('#window-client-videochat').css('display', 'none');

            /// set toggle-interaction
            $('.toggle-interaction').css('cursor', 'pointer');
            $('.toggle-interaction').click(function () {
                UserManager.toggleInteraction();
            })
        }


        /// callback
        callback();
    }


    ///
    /// called when the interaction type change
    ///
    static OnInteractionType(interactionType) {
        if (interactionType == 'sender') {
            $('#window-main').css('pointer-events', 'all');
            $('.toggle-interaction').css('filter', 'grayscale(0)');
            $('#bottomBar-cover').fadeOut();
            $('#window-frame-ative').addClass('active-user');

        }
        else if (interactionType == 'receiver') {
            $('#window-main').css('pointer-events', 'none');
            $('.toggle-interaction').css('filter', 'grayscale(100)');
            $('#bottomBar-cover').fadeIn();
            $('#window-frame-ative').removeClass('active-user');

        }
    }


    ///
    /// called when all assets are loaded
    ///
    static OnAssetLoaded() {
        $("#preloader").fadeOut();
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    static getThumbnailIconFromClass(classType) {
        const icon = thumbnailIcon[classType];
        return icon;
    }



    // ///
    // /// create the thumbnail from loaded asset
    // ///
    // static createThumbnailFromAsset(url, classType, name, icon, onClick, callback) {

    //     /// if is not passed the icon url (from a image class)
    //     /// get it from the default icons
    //     var _icon;
    //     if (!icon) {
    //         _icon = UIManager.getThumbnailIconFromClass(classType);
    //     }
    //     else {
    //         _icon = icon;
    //     }

    //     const id = thumbnails.length;
    //     const el = $('#bottomBar').children().first().clone();

    //     /// share button
    //     if (UserManager.userType == "client"){
    //         el.find('.thumbnail-button-share').css('display', 'none');
    //     }
    //     else{
    //         el.find('.thumbnail-button-share').click(function(){
    //             el.find('.thumbnail-icon-share').css('filter', 'grayscale(0)');
    //             console.log("send message to clients to create a new asset from url")
    //             FilesManager.sendMessageToCreateAsset(url);
    //         })
    //     }

    //     /// class icon
    //     el.find('.thumbnail-icon-class').attr('src', UIManager.getThumbnailIconFromClass(classType));

    //     el.attr('data-URL', url);
    //     el.attr('data-class', classType);
    //     el.find('.thumbnail-image').attr('src', _icon);
    //     el.find('p').text(decodeURI(name));
    //     el.find('.thumbnail-image').click(function () {

    //         if (selectedThumbnailId != id) {

    //             /// disable previous thumbnail
    //             if (selectedThumbnailId != null) {
    //                 thumbnails[selectedThumbnailId].find('.thumbnail-image').removeClass('active-user');
    //                 thumbnails[selectedThumbnailId].find('p').removeClass('active-user-text');
    //                 thumbnails[selectedThumbnailId].find('.thumbnail-icon-class').removeClass('active-user-icon');
    //             }

    //             /// enable clicked thumbnail
    //             thumbnails[id].find('.thumbnail-image').addClass('active-user');
    //             thumbnails[id].find('p').addClass('active-user-text');
    //             thumbnails[id].find('.thumbnail-icon-class').addClass('active-user-icon');
    //             selectedThumbnailId = id;
    //             onClick();
    //         }

    //     })

    //     el.appendTo('#bottomBar');
    //     el.fadeIn();
    //     thumbnails.push(el);


    //     if (callback) callback();
    // }



    static toggleThumbnail(id) {

        /// disable previous thumbnail
        if (selectedThumbnailId) {

            /// get the previuos thumbnail
            var oldSelectedThumbnail;
            for (let i = 0; i < thumbnails.length; i++) {
                const _id = thumbnails[i].data('id');
                if (_id == selectedThumbnailId) {
                    oldSelectedThumbnail = thumbnails[i];
                }
            }
            if (oldSelectedThumbnail){
                // console.log("spengo quella prima...")
                oldSelectedThumbnail.attr('data-selected', 'false');
                oldSelectedThumbnail.find('.thumbnail-image').removeClass('active-user');
                oldSelectedThumbnail.find('p').removeClass('active-user-text');
                oldSelectedThumbnail.find('.thumbnail-icon-class').removeClass('active-user-icon');
            }
           
        }


        /// enable clicked thumbnail
        // console.log("provo ad accendere questa!")
        /// get the selected thumbnail
        var selectedThumbnail;
        for (let i = 0; i < thumbnails.length; i++) {
            const _id = thumbnails[i].data('id');
            if (_id == id) {
                selectedThumbnail = thumbnails[i];
            }
        }
        if (selectedThumbnail){
            // console.log("...accendo questa selezionata")
            selectedThumbnail.attr('data-selected', 'true');
            selectedThumbnail.find('.thumbnail-image').addClass('active-user');
            selectedThumbnail.find('p').addClass('active-user-text');
            selectedThumbnail.find('.thumbnail-icon-class').addClass('active-user-icon');
        }
        // else{
        //     console.log("NESSUNA TROVATA")
        // }

        selectedThumbnailId = id;
        // console.log("settato ID: " + selectedThumbnailId);
    }




    ///
    /// create the thumbnail from loaded asset
    ///
    static createThumbnailFromAsset(properties, callback) {

        if ((UserManager.userType == "master" && !FilesManager.allAssetRetrieved)
            || (UserManager.userType == "client" && FilesManager.allAssetRetrieved)) {


            const id = properties.url;
            const url = properties.url;
            const classType = properties.classType;
            const name = properties.name;
            const poster = properties.poster;
            const onClick = properties.onClick;
            


            /// if is not passed the poster url (from a image class)
            /// get it from the default icons
            var _poster;
            if (!poster) {
                _poster = UIManager.getThumbnailIconFromClass(classType);
            }
            else {
                _poster = poster;
            }



            const el = $('#bottomBar').children().first().clone();

            /// share button
            if (UserManager.userType == "client") {
                el.find('.thumbnail-button-share').css('display', 'none');
            }
            else {
                el.find('.thumbnail-button-share').click(function () {
                    el.find('.thumbnail-icon-share').css('filter', 'grayscale(0)');
                    console.log("send message to clients to create a new asset from url")


                    const newAsset = {
                        url: properties.url,
                        selected: properties.selected,
                    }


                    FilesManager.sendMessageToCreateAsset(newAsset); //// QUI DEVE ESSERCI ANCHE SE E' SELEZIONATO!!!




                })
            }

            /// set
            el.find('.thumbnail-icon-class').attr('src', UIManager.getThumbnailIconFromClass(classType));
            el.attr('data-id', id);
            el.attr('data-URL', url);
            el.attr('data-class', classType);
            el.find('.thumbnail-image').attr('src', _poster);
            el.find('p').text(decodeURI(name));

            


            /// click function
            el.find('.thumbnail-image').click(function () {

                if (selectedThumbnailId != id) {

                    UIManager.toggleThumbnail(id);

                    /// send to clients
                    jsonObj.action = "ToggleThumbnail";
                    jsonObj.id = id;
                    SocketManager.FMEmitStringToOthers(JSON.stringify(jsonObj));

                    onClick();
                }

            })

            el.appendTo('#bottomBar');
            el.fadeIn();
            thumbnails.push(el);

            /// we must do this
            /// so to have the new asset on the client highlighted if it was
            /// selected on the master....
            UIManager.toggleThumbnail(selectedThumbnailId);


            if (callback) callback();

        }


        /// if we don't have to create the thumbnail
        else {
            if (callback) callback();
        }
    }

















    ///
    /// called when an asset is clicked in the asset window
    ///
    static OnAssetClicked() {
        $("#no-selection-message").hide();
    }





    static changeTab(classType) {
        thumbnails.forEach((el) => {
            if (classType == "all") {
                el.show();
            }
            else {
                if (el.data('class') != classType) {
                    el.hide();
                }
                else {
                    el.show();
                }
            }
        })
    };



    ///
    /// receive data from socket
    ///
    static ReceiveData(obj) {
        if (obj.action == "ToggleThumbnail") {
            UIManager.toggleThumbnail(obj.id);
        }
    };

}