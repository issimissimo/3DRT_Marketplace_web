
var player;

export class RealtimeLoader {

    static Load(data) {

        if (player) {
            $('#window-realtime').css('z-index', '1');
        }
        else {
            var src = data.root.src;
            console.log(src);

            // player = new Player(id, 'window-main', {
            //     whiteLabel: true,
            //     hideTitle: true,
            //     hideToolbar: true,
            //     hidePlayButton: true,
            //     debugAppMode: false,
            //     autoRun: true,
            //     // overridedURL: 'http://localhost:8080'
            // });

            src += "?whiteLabel=true&hideTitle=true&hideToolbar=true&autoRun=true";

            console.log(src);

            player = $('<iframe>')
                .attr('src', src)
                .attr('height', '100%')
                .attr('width', '100%')
                .attr('frameborder', 0)
                .appendTo('#window-realtime');

            $('#window-realtime').css('z-index', '1');
        }



    };

    static Hide() {
        if (player) {
            console.log("HIDEEEE")

            $('#window-realtime').css('z-index', '-1');
            // player = null;
        }
    };
}