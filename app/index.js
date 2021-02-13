import Videochat from '../src/videochat.js';
import FilesManager from '../src/filesManager.js';
import * as SocketManager from '../src/socketManager.js';



const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let userType = urlParams.get('user');
if (!userType) {
    console.log("URL user parameter not defined! We'll use 'master'");
    userType = 'master';
}

/// Connect to socket
SocketManager.Connect(userType);

/// Start videochat
// Videochat.init(userType);


///Load remote files
FilesManager.init('http://www.issimissimo.com/playground/folderToListFiles/', userType);







