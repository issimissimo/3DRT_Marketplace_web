
var viewer;

export class CameraLoader {

    static Load(data) {
        if (viewer) return;
        
        const src = data.root.src + "&autoplay=1&disablefullscreen=1&disablevideofit=1";

        viewer = $('<iframe>')                      
            .attr('src', src)
            .attr('height', '100%')
            .attr('width', '100%')
            .attr('frameborder', 0)
            .appendTo('#window-main');
    };

    static Destroy() {
        if (viewer) {
            viewer.remove();
            viewer = null;
        }
    };
}