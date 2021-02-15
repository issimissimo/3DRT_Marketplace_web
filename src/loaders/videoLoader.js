var player;

function createClapprPlayer(url, userType){
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
}


export default class ImageLoader {

    static Load(url, userType) {

        if (player) {
            player.destroy();
            player = null;
        }
        createClapprPlayer(url, userType);
    };


    static Destroy() {
        if (player){
            player.destroy();
            player = null;
        } 
    };

    ///
    /// receive data from socket
    ///
    static ReceiveData(obj) {
        if (viewer) {
            console.log(obj.action);

            if (obj.action == "move") {
                ImageLoader.MoveTo(obj.x, obj.y);
            }

            if (obj.action == "zoom") {
                ImageLoader.ZoomTo(obj.ratio);
            }
        }
    };
}