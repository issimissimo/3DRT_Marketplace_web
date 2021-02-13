import * as videoCover from "../src/utils/videoCover.js";
import ImageLoader from "../src/loaders/imageLoader.js";



var imageNames = [];
var thumbnails = [];
var thumbnailsLoaded = 0;


function openImage(url){
    console.log("load image to screen")
    console.log(url)

    ImageLoader.Load(url);
}




function loadThumbnails() {

    var i = thumbnailsLoaded;
    const url = thumbnails[i].data('data-url');
    const type = thumbnails[i].data('data-type');
    console.log(thumbnails[i].data('data-type'));


    switch (type) {

        case "image":

            var img = new Image();
            img.src = url;
            img.onload = function () {
                thumbnails[i].click(function(){
                    openImage(url);
                });
                thumbnails[i].attr('src', url);
                thumbnails[i].fadeIn(1000);

                if (i < thumbnails.length - 1) {
                    thumbnailsLoaded++;
                    loadThumbnails();
                }
            };
            break;

        case "video":

            console.log("detected video")

                thumbnails[i].fadeIn(1000);

                if (i < thumbnails.length - 1) {
                    thumbnailsLoaded++;
                    loadThumbnails();
                }

            // fetch('http://www.issimissimo.com/playground/folderToListFiles/BigBuckBunny_test.mp4')
            //     .then(res => res.blob()) // Gets the response and returns it as a blob
            //     .then(blob => {

            //         console.log(blob);
                    
                    
                    // Here's where you get access to the blob
                    // And you can use it for whatever you want
                    // Like calling ref().put(blob)

                    // Here, I use it to make an image appear on the page


                    // let objectURL = URL.createObjectURL(blob);
                    // let myImage = new Image();
                    // myImage.src = objectURL;
                    // document.getElementById('myImg').appendChild(myImage)
                // });


            /// get video thumbnail image
            // try {

            //     var src = url; ///video url not youtube or vimeo,just video on server
            //     var video = document.createElement('video');

            //     video.src = src;

            //     video.width = 360;
            //     video.height = 240;

            //     var canvas = document.createElement('canvas');
            //     canvas.width = 360;
            //     canvas.height = 240;
            //     var context = canvas.getContext('2d');

            //     video.addEventListener('loadeddata', function () {
            //         context.drawImage(video, 0, 0, canvas.width, canvas.height);
            //         var dataURI = canvas.toDataURL('image/jpeg');
            //         console.log(dataURI)
            //         thumbnails[i].attr('src', dataURI);
            //         thumbnails[i].fadeIn(1000);
            //         // html += '<figure>';
            //         // html += '<img src="' + dataURI + '' + '" alt="' + item.description + '" />';
            //         // html += '<figurecaption>' + item.description + '</figurecaption>'
            //         // html += '</figure>';
            //     });







            //     // const cover = await videoCover.GetVideoCover(url, 5);
            //     // const img = URL.createObjectURL(cover);
            //     // thumbnails[i].attr('src', img);
            //     // thumbnails[i].fadeIn(1000);

            //     if (i < thumbnails.length - 1) {
            //         thumbnailsLoaded++;
            //         loadThumbnails();
            //     }

            // } catch (ex) {
            //     console.error("Error creating thumbnail: ", ex);
            //     alert(ex);
            // }
            break;

    }


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

                    switch (extension) {
                        case "jpg":
                            newThumbnail.data('data-type', "image");
                            break;

                        case "mp4":
                            newThumbnail.data('data-type', "video");
                            break;

                        default:
                            console.warn("file nor recognized!");
                    }

                    newThumbnail.data('data-url', url + el);
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






export default class FilesManager {
    static init(_url) {
        listFilesFromUrl(_url);
    }
}