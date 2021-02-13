
var viewer;

const imageContainer = document.getElementById('imageContainer');

export default class ImageLoader {
    
    static Load(url){

        if (viewer){
            viewer.destroy();
        }

        viewer = new Viewer(imageContainer, {
            inline: true,
            backdrop: false,
            navbar: false,
            toolbar: false,
            title: false,
            viewed() {
                // viewer.zoomTo(1);
            },
            moved(event) {
                // console.log(event)
            },
            url() {
                return url;
            },
        });
    };

    static Destroy(){
        viewer.destroy();
    };
}