
var viewer;

export class CameraLoader {

    static Load(data) {
        const src = data.root.src;
        console.log(src);

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