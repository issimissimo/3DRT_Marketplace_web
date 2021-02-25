import { UserManager } from './userManager.js';
import { DebugManager } from './debugManager.js';

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
    if (el != selectedFilterButton){
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
    /// called at start from UserManager
    ///
    static SetUI(callback) {

        /// hide UI elements for client
        if (UserManager.userType == 'client') {
            $('#leaveInteraction').css('display', 'none');
            $('#getInteraction').css('display', 'none');
            $('.filters').css('display', 'none');

        }

        /// show welcome page
        if (DebugManager.showWelcome) {
            const text = userType.toUpperCase();
            $('#preloader').append('Welcome ' + text);
            const enterButton = $('<button/>',
                {
                    text: 'ENTER',
                    click: function () { callback(); }
                });
            $("#preloader").append(enterButton);
        }
        else {
            callback();
        }
    }


    ///
    /// called when the interaction type change
    ///
    static OnInteractionType(interactionType) {
        if (interactionType == 'sender') {
            $('#window-main').css('pointer-events', 'all');
            // $('#window-main').addClass('active-user');
        }
        else if (interactionType == 'receiver') {
            $('#window-main').css('pointer-events', 'none');
            // $('#window-main').removeClass('active-user');
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
    static createThumbnailFromAsset(classType, name, icon, onClick, callback) {

        console.log(classType)

        if (UserManager.userType == "master") {


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
            el.attr('data-class', classType);
            el.find('p').text(decodeURI(name));
            el.find('img').attr('src', _icon);
            el.click(function () {

                if (selectedThumbnailId != id) {

                    if (selectedThumbnailId != null) {
                        thumbnails[selectedThumbnailId].find('img').removeClass('active-user');
                    }

                    thumbnails[id].find('img').addClass('active-user');
                    selectedThumbnailId = id;
                    onClick();
                }

            })

            el.appendTo('#bottomBar');
            el.show();
            thumbnails.push(el);

        }

        if (callback) callback();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // static addThumbnail(el, onClickCallback) {
    //     const id = thumbnails.length;

    //     el.click(function () {

    //         if (selectedThumbnailId != id) {

    //             if (selectedThumbnailId != null) {
    //                 thumbnails[selectedThumbnailId].find('img').removeClass('active-user');
    //             }

    //             thumbnails[id].find('img').addClass('active-user');
    //             selectedThumbnailId = id;
    //             onClickCallback();
    //         }
    //     });

    //     el.appendTo('#bottomBar');
    //     el.show();
    //     thumbnails.push(el);
    // }







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