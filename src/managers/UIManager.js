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
        selectedFilterButton.removeClass('label-clicked');
        UIManager.changeTab(el.data('class'));
        el.addClass('label-clicked');
        selectedFilterButton = el;
    }
};

const filterButtons = $('.filters').children();
var selectedFilterButton = $(filterButtons[0]);

for (let i = 0; i < filterButtons.length; i++) {
    const el = $(filterButtons[i]);
    el.click(function () {
        onFilterButtonClicked(el);
    })
};






/// listener for toolbar buttons
function onToolbarButtonClicked(el) {
    // if (el != selectedToolbarButton) {
    // selectedToolbarButton.removeClass('button-selected');
    // el.addClass('button-selected');
    selectedToolbarButton.removeClass('label-clicked');
    // selectedToolbarButton.removeClass('label-clicked-bacground');
    el.addClass('label-clicked');
    // el.addClass('label-clicked-bacground');

    selectedToolbarButton = el;

    switch (el.data('window')) {
        case "upload":
            $('#window-shop').hide();
            $('#window-upload').show();
            break;

        case "show":
            $('#window-shop').hide();
            $('#window-upload').hide();
            break;

        case "shop":
            $('#window-upload').hide();
            $('#window-shop').show();
            break;

        default:
            console.error("You should not come here");
    }
    // }
};

const toolbarButton = $('#toolbar').children().not('#toggle-interaction');
var selectedToolbarButton = $(toolbarButton[2]);
onToolbarButtonClicked(selectedToolbarButton);

for (let i = 0; i < toolbarButton.length; i++) {
    const el = $(toolbarButton[i]);
    el.click(function () {
        if (el != selectedToolbarButton)
            onToolbarButtonClicked(el);
    })
};



///
/// the message on interaction type changed
///
var messageTimeout;
/// preload
var icon1 = new Image();
icon1.src = "img/icon-interaction.svg";
var icon2 = new Image();
icon2.src = "img/icon-interaction_none.svg";

function showMessage(interactionType) {

    var text;
    var color;
    var icon;

    if (interactionType == 'sender') {
        text = "You have permission to interact";
        color = getComputedStyle(document.documentElement).getPropertyValue('--blue');
        icon = "img/icon-interaction.svg";
    }
    else if (interactionType == 'receiver') {
        text = "You don't have permission to interact";
        color = getComputedStyle(document.documentElement).getPropertyValue('--orange');
        icon = "img/icon-interaction_none.svg";
    }

    if (messageTimeout) clearTimeout(messageTimeout);
    const msg = $('#message');
    msg.find('span').text(text);
    msg.css('background-color', color);
    msg.find('img').attr('src', icon);
    msg.fadeIn();
    messageTimeout = setTimeout(function () {
        msg.fadeOut();
        messageTimeout = null;
    }, 5000)
};




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

            $('#toolbar').css('pointer-events', 'none');
            $('#toolbar-button-upload').css('display', 'none');
            $('#toolbar-button-shop').css('display', 'none');
            $('#toolbar-button-show').css('display', 'none');
            $('#master-videochat-toolbar').css('display', 'none');

            $('#no-selection-message').find('p').text('No content shared yet');
        }

        /// Set UI elements for master
        else if (UserManager.userType == 'master') {

            $('#window-client-videochat').css('display', 'none');

            /// set toggle-interaction
            // $('.toggle-interaction').css('cursor', 'pointer');
            $('#toggle-interaction').click(function () {
                console.log("toggle interaction!")
                UserManager.toggleInteraction();
            })

            $('#no-selection-message').find('p').text('You are not sharing any content');
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
            $('#bottomBar-cover').fadeOut();
            $('#window-frame-active').addClass('active-user');

            $('#toggle-interaction').addClass('label-clicked');
            $('#toggle-interaction').find('span').text('Active');
            $('#toggle-interaction').find('.absolute').show();
            


            // $('.toggle-interaction').css('filter', 'grayscale(0)');

           
        }
        else if (interactionType == 'receiver') {
            $('#window-main').css('pointer-events', 'none');
            $('#bottomBar-cover').fadeIn();
            $('#window-frame-active').removeClass('active-user');

            $('#toggle-interaction').removeClass('label-clicked');
            $('#toggle-interaction').find('span').text('Off');
            $('#toggle-interaction').find('.absolute').hide();
            // $('.toggle-interaction').css('filter', 'grayscale(100)');

            
        }

        /// show the interaction message
        showMessage(interactionType);
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
            if (oldSelectedThumbnail) {
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
        if (selectedThumbnail) {
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

                    /// Add new asset to the clients
                    if (el.data('shared') == "false") {

                        console.log("ATTIVO")
                        el.data('shared', 'true');

                        el.find('.thumbnail-icon-share').css('filter', 'grayscale(0)');
                        console.log("send message to clients to create a new asset from url")


                        /// send message to clients
                        const newAsset = { url: properties.url }
                        FilesManager.sendMessageToCreateAsset(newAsset);
                    }

                    /// Remove previously created asset from the clients
                    else if (el.data('shared') == "true") {

                        console.log("SPENGO")
                        el.data('shared', 'false');
                        el.find('.thumbnail-icon-share').css('filter', 'grayscale(1)');

                        /// send message to clients
                        // FilesManager.sendMessageToRemoveAsset(id);
                        jsonObj.action = "RemoveThumbnail";
                        jsonObj.id = id;
                        SocketManager.FMEmitStringToOthers(JSON.stringify(jsonObj));
                    }
                })
            }

            /// set
            el.find('.thumbnail-icon-class').attr('src', UIManager.getThumbnailIconFromClass(classType));
            el.attr('data-id', id);
            el.attr('data-URL', url);
            el.attr('data-class', classType);
            el.data('shared', 'false');
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
    };




    ///
    /// remove asset
    ///
    static removeAsset(id) {

        thumbnails.forEach((el) => {
            if (el.data('id') == id) {
                const index = thumbnails.indexOf(el);
                /// remove from array
                thumbnails.splice(index, 1);
                /// remove from DOM
                el.remove();
            }
        });
    };

















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
        if (obj.action == "RemoveThumbnail") {
            UIManager.removeAsset(obj.id);
        }
    };







}
