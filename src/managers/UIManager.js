import { UserManager } from './userManager.js';
import { DebugManager } from './debugManager.js';
import { FilesManager } from './filesManager.js';

var selectedThumbnailId;
var thumbnails = [];

const thumbnailIcon = {
    'image': './img/icon-image.svg',
    'video': './img/icon-video.svg',
    'panorama': './img/icon-panorama.svg',
    'camera': './img/icon-camera.svg',
    'realtime': './img/icon-3d.svg',
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

        }
        else if (interactionType == 'receiver') {
            $('#window-main').css('pointer-events', 'none');
            $('.toggle-interaction').css('filter', 'grayscale(100)');

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



    ///
    /// create the thumbnail from loaded asset
    ///
    static createThumbnailFromAsset(url, classType, name, icon, onClick, callback) {

        console.log("creo thumbail")
        /// if is not passed the icon url (from a image class)
        /// get it from the default icons
        var _icon;
        if (!icon) {
            _icon = UIManager.getThumbnailIconFromClass(classType);
        }
        else {
            _icon = icon;
        }

        const id = thumbnails.length;
        const el = $('#bottomBar').children().first().clone();

        /// share button
        if (UserManager.userType == "client"){
            el.find('.thumbnail-button-share').css('display', 'none');
        }
        else{
            el.find('.thumbnail-button-share').click(function(){
                el.find('.thumbnail-icon-share').css('filter', 'grayscale(0)');
                console.log("send message to clients to create a new asset from url")
                FilesManager.sendMessageToCreateAsset(url);
            })
        }

        el.attr('data-URL', url);
        el.attr('data-class', classType);
        el.find('.thumbnail-image').attr('src', _icon);
        el.find('p').text(decodeURI(name));
        el.find('.thumbnail-image').click(function () {

            if (selectedThumbnailId != id) {

                if (selectedThumbnailId != null) {
                    thumbnails[selectedThumbnailId].find('.thumbnail-image').removeClass('active-user');
                }

                thumbnails[id].find('.thumbnail-image').addClass('active-user');
                selectedThumbnailId = id;
                onClick();
            }

        })

        el.appendTo('#bottomBar');
        el.fadeIn();
        thumbnails.push(el);


        if (callback) callback();
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
    }

}