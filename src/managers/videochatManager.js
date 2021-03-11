import { UserManager } from './userManager.js';
import { DebugManager } from './debugManager.js';


// replace these values with those generated in your TokBox Account
var apiKey = "47090254";
// var sessionId = "1_MX40NzA5MDI1NH5-MTYxMTE4NDI0ODA1MX5USTNSa0p2L1lRWitNczNMeFM3blBiUEl-fg";
var sessionId = "1_MX40NzA5MDI1NH5-MTYxNTQ4MDQ5MjYyOH5URXExOS9WbjhMajNqaXovcU94STVVcFV-fg";
// var token = "T1==cGFydG5lcl9pZD00NzA5MDI1NCZzaWc9YTc3ZmRlM2Q4Y2JkZDNmOWRlMTFiYTM2MmE1OWYxYTdjYjA3ZDYzZDpzZXNzaW9uX2lkPTFfTVg0ME56QTVNREkxTkg1LU1UWXhNVEU0TkRJME9EQTFNWDVVU1ROU2EwcDJMMWxSV2l0TmN6Tk1lRk0zYmxCaVVFbC1mZyZjcmVhdGVfdGltZT0xNjExMTg0MjgyJm5vbmNlPTAuMjk0ODc4ODY0MDQ5OTY5MyZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNjEzNzc2MjgyJmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9";
var token = "T1==cGFydG5lcl9pZD00NzA5MDI1NCZzaWc9YjM2YzIzNmFjZjEyODgzNTlkNzhlYWZlMTU1ZjU5YzE0YjVhNWUyMTpzZXNzaW9uX2lkPTFfTVg0ME56QTVNREkxTkg1LU1UWXhOVFE0TURRNU1qWXlPSDVVUlhFeE9TOVdiamhNYWpOcWFYb3ZjVTk0U1RWVmNGVi1mZyZjcmVhdGVfdGltZT0xNjE1NDgwNTIyJm5vbmNlPTAuMzE1NzQyNjA1MTI5MjczMyZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNjE4MDY4OTIzJmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9";

// (optional) add server code here
// initializeSession();

var publisher;
var subscriber;

var useVideo = true;
var useAudio = true;


// Handling all of our errors here by alerting them
function handleError(error) {
    if (error) {
        alert(error.message);
    }
}





function initializeSession(user) {

    // console.log(user);
    let publisherElementId;
    let publisherinsertMode;
    switch (user) {
        case "master":
            publisherElementId = 'video-master';
            // publisherinsertMode = 'replace';
            break;
        case "client":
            publisherElementId = 'video-client';
            // publisherinsertMode = 'append';
            break;
        default:
            alert("user not defined");
    }
    if (!publisherElementId) return;


    var session = OT.initSession(apiKey, sessionId);



    // Create a publisher
    // publisher = OT.initPublisher(publisherElementId, {
    //     name: user,
    //     resolution: '320x240',
    //     frameRate: 15,
    //     insertMode: publisherinsertMode,
    //     width: '100%',
    //     // height: '100%',
    //     // fitMode: "cover",
    // }, handleError);

    publisher = OT.initPublisher({
        insertDefaultUI: false,
        name: user,
        resolution: '320x240',
        frameRate: 15,
    }, handleError);

    publisher.on('videoElementCreated', function (event) {
        document.getElementById(publisherElementId).appendChild(event.element);

        /// force the size
        event.element.style.width = "320px";
        event.element.style.height = "240px";
    });




    // Subscribe to a newly created stream
    session.on('streamCreated', function (event) {

        let streamStyle = {};

        var subscriberElementId;
        var subscriberInsertMode;
        switch (event.stream.name) {
            case "master":
                subscriberElementId = 'video-master';
                // subscriberInsertMode = 'replace';
                break;
            case "client":
                subscriberElementId = 'others-videochat-container';
                // subscriberInsertMode = 'append';
                break;
            default:
                alert("user not defined");
        }


        // session.subscribe(event.stream, subscriberElementId, {
        //     insertMode: subscriberInsertMode,
        //     width: '100%',
        //     // height: '100%',
        // }, handleError);

        subscriber = session.subscribe(event.stream, {
            insertDefaultUI: false,
            // resolution: '320x240',
            // frameRate: 15,
        }, handleError);


        subscriber.on('videoElementCreated', function (event) {
            document.getElementById(subscriberElementId).appendChild(event.element);

            /// force the size
            event.element.style.width = "320px";
            event.element.style.height = "240px";
        });



    });



    // Connect to the session
    session.connect(token, function (error) {
        // If the connection is successful, publish to the session
        if (error) {
            handleError(error);
        } else {
            session.publish(publisher, handleError);
        }
    });
};




export class VideochatManager {
    static init() {
        if (DebugManager.startVideochat) {
            initializeSession(UserManager.userType);
        }
    };

    static toggleVideo(value) {
        if (publisher) {
            publisher.publishVideo(value);
        }
    };

    static toggleAudio(value) {
        if (publisher) {
            publisher.publishAudio(value);
        }
    };
};






/// set buttons
$('.videochat-button-cam').click(function () {
    useVideo = !useVideo;
    VideochatManager.toggleVideo(useVideo);
    const imgSrc = useVideo ? "img/icon-videoCamera.svg" : "img/icon-videoCamera_off.svg";
    $(this).attr('src', imgSrc);

})
$('.videochat-button-mic').click(function () {
    useAudio = !useAudio;
    VideochatManager.toggleAudio(useAudio);
    const imgSrc = useAudio ? "img/icon-microphone.svg" : "img/icon-microphone_off.svg";
    $(this).attr('src', imgSrc);
})