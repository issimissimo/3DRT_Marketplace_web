// replace these values with those generated in your TokBox Account
var apiKey = "47090254";
var sessionId = "1_MX40NzA5MDI1NH5-MTYxMTE4NDI0ODA1MX5USTNSa0p2L1lRWitNczNMeFM3blBiUEl-fg";
var token = "T1==cGFydG5lcl9pZD00NzA5MDI1NCZzaWc9YTc3ZmRlM2Q4Y2JkZDNmOWRlMTFiYTM2MmE1OWYxYTdjYjA3ZDYzZDpzZXNzaW9uX2lkPTFfTVg0ME56QTVNREkxTkg1LU1UWXhNVEU0TkRJME9EQTFNWDVVU1ROU2EwcDJMMWxSV2l0TmN6Tk1lRk0zYmxCaVVFbC1mZyZjcmVhdGVfdGltZT0xNjExMTg0MjgyJm5vbmNlPTAuMjk0ODc4ODY0MDQ5OTY5MyZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNjEzNzc2MjgyJmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9";

// (optional) add server code here
// initializeSession();

// Handling all of our errors here by alerting them
function handleError(error) {
    if (error) {
        alert(error.message);
    }
}

function initializeSession() {
    var session = OT.initSession(apiKey, sessionId);

    // Subscribe to a newly created stream
    session.on('streamCreated', function (event) {
        session.subscribe(event.stream, 'subscriber', {
            insertMode: 'append',
            width: '80%',
            // height: '150px'
        }, handleError);
    });

    // Create a publisher
    var publisher = OT.initPublisher('window-master-videochat', {
        resolution: '320x240',
        frameRate: 15,
        // insertMode: 'append',
        width: '100%',
        height: '100%'
    }, handleError);

    // Connect to the session
    session.connect(token, function (error) {
        // If the connection is successful, publish to the session
        if (error) {
            handleError(error);
        } else {
            session.publish(publisher, handleError);
        }
    });
}

export default class Videochat {
    static init(){
        initializeSession();
    }
}