
var player;

export class RealtimeLoader {

    static Load(data) {

        if (player) {
            $('#window-realtime').css('z-index', '1');
        }
        else {
            const src = data.root.src + "?whiteLabel=true&hideTitle=true&hideToolbar=true&autoRun=true";
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
            $('#window-realtime').css('z-index', '-1');
        }
    };
}