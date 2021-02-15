import * as SocketManager from '../../src/socketManager.js';

const jsonObj = {
    class: "VideoLoader",
}

var player;
var userType;

function createClapprPlayer(url, _userType) {
    userType = _userType;
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


    player.listenTo(player, Clappr.Events.PLAYER_PLAY, () => {
        jsonObj.action = "play";
        SocketManager.FMEmitStringToOthers(JSON.stringify(jsonObj));

        /// hide UI for clients
        if (userType == "client") player.core.mediaControl.disable();
    });


    player.listenTo(player, Clappr.Events.PLAYER_PAUSE, () => {
        jsonObj.action = "pause";
        SocketManager.FMEmitStringToOthers(JSON.stringify(jsonObj));
    });


    player.listenTo(player, Clappr.Events.PLAYER_SEEK, (time) => {
        jsonObj.action = "seek";
        jsonObj.time = time;
        SocketManager.FMEmitStringToOthers(JSON.stringify(jsonObj));
    });
}


export default class VideoLoader {

    static Load(url, userType) {

        if (player) {
            player.destroy();
            player = null;
        }
        createClapprPlayer(url, userType);
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