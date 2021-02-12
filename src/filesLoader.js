
var imageNames = [];
var thumbnails = [];
var thumbnailsLoaded = 0;


async function loadThumbnails() {
    var i = thumbnailsLoaded;
    var url = thumbnails[i].data('data-url');
    var img = new Image();
    img.src = url;
    img.onload = function () {
        thumbnails[i].attr('src', url);
        thumbnails[i].fadeIn(1000);

        if (i < thumbnails.length - 1){
            thumbnailsLoaded++;
            loadThumbnails();
        }
    };
}



function listFilesFromUrl(url) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

            var html = xmlhttp.responseText;
            var parser = new DOMParser();
            var htmlDoc = parser.parseFromString(html, 'text/html');
            var x = htmlDoc.getElementsByTagName('a');

            for (var i = 0; i < x.length; i++) {

                const name = x[i].href;
                const extension = name.slice(-3).toLowerCase();
                if (extension == "jpg" || extension == "mp4") {
                    const e = name.split("/");
                    const el = e[e.length - 1];
                    imageNames.push(el);


                    const newThumbnail = $('#bottomBar').children().first().clone().appendTo('#bottomBar');
                    newThumbnail.data('data-url', url + el);
                    // newThumbnail.fadeIn(2000);
                    // console.log(newThumbnail.data('data-url'))
                    thumbnails.push(newThumbnail);

                }
            }

            console.log("all file names loaded")
            loadThumbnails();

            // const imageCollection = loadImages(imageNames, )
        }
    }
    xmlhttp.open("GET", url, false);
    xmlhttp.send();
}




// const imageCollection = loadImages(
//     ["menuImage", "resetScoreButton", "instructionsButton", "playButton", "dialogPanel", "gamePlayImage", "exitButton", "timerPanel", "messengerPanel", "scoreBar", "yesButton", "noButton", "goButton"],
//     ["game_Menu", "reset_score_button", "instructions_button", "play_button", "dialog_panel", "game_play", "exit_button", "timer", "messenger_panel", "score_bar", "yes_button", "no_button", "go_button"],
//     drawGameMenu  // this is called when all images have loaded.
// );

// function loadImages(names, files, onAllLoaded) {
//     var i = 0, numLoading = names.length;
//     const onload = () => --numLoading === 0 && onAllLoaded();
//     const images = {};
//     while (i < names.length) {
//         const img = images[names[i]] = new Image;
//         img.src = files[i++] + ".png";
//         img.onload = onload;
//     }   
//     return images;
// }






export default class FilesLoader {
    static init(_url) {
        listFilesFromUrl(_url);
    }
}