import * as SocketManager from '../managers/socketManager.js';
import { UserManager } from '../managers/userManager.js';

const jsonObj = {
    class: "VideoLoader",
}

var player;

function createClapprPlayer(url) {
    const videoContainer = document.getElementById('window-main');
    player = new Clappr.Player({
        source: url,
        width: "100%",
        height: "100%",
        autoPlay: true,
        mute: true,
        // poster: poster,
    });

    player.attachTo(videoContainer);
    player.core.toggleFullscreen = function () {
        // do something
    };


    player.listenTo(player, Clappr.Events.PLAYER_READY, () => {
        // if (UserManager.interactionType == "sender") {
        //     jsonObj.action = "play";
        //     SocketManager.FMEmitStringToOthers(JSON.stringify(jsonObj));
        // }
        /// hide UI for clients
        if (UserManager.userType == "client") player.core.mediaControl.disable();

        /// register on interactionType changed
        /// to show-hide the UI
        UserManager.OnInteractionTypeChanged.push(() => {
            console.log("change UI")
            if (UserManager.interactionType == "receiver")
                player.core.mediaControl.disable();

            if (UserManager.interactionType == "sender")
                player.core.mediaControl.enable();
        })
    });


    player.listenTo(player, Clappr.Events.PLAYER_PLAY, () => {
        if (UserManager.interactionType == "sender") {
            jsonObj.action = "play";
            SocketManager.FMEmitStringToOthers(JSON.stringify(jsonObj));
        }
        // /// hide UI for clients
        // if (UserManager.userType == "client") player.core.mediaControl.disable();
    });


    player.listenTo(player, Clappr.Events.PLAYER_PAUSE, () => {
        if (UserManager.interactionType == "sender") {
            jsonObj.action = "pause";
            SocketManager.FMEmitStringToOthers(JSON.stringify(jsonObj));
        }
    });


    player.listenTo(player, Clappr.Events.PLAYER_SEEK, (time) => {
        if (UserManager.interactionType == "sender") {
            jsonObj.action = "seek";
            jsonObj.time = time;
            SocketManager.FMEmitStringToOthers(JSON.stringify(jsonObj));
        }
    });
}


export class VideoLoader {

    static Load(url) {

        if (player) {
            player.destroy();
            player = null;
        }
        createClapprPlayer(url);
    };


    static Destroy() {
        if (player) {
            player.destroy();
            player = null;
        }
    };

    ///
    /// receive data from socket
    ///
    static ReceiveData(obj) {
        if (player) {
            console.log(obj.action);

            if (obj.action == "play") {
                player.play();
            }

            if (obj.action == "pause") {
                player.pause();
            }

            if (obj.action == "seek") {
                player.seek(obj.time);
            }
        }
    };
}