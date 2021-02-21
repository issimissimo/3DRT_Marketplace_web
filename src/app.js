import { VideochatManager } from './managers/videochatManager.js';
import { FilesManager } from './managers/filesManager.js';
import { UserManager } from './managers/userManager.js';
import * as SocketManager from './managers/socketManager.js';



const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var userType = urlParams.get('user');

if (!userType) {
    console.log("URL user parameter not defined! We'll use 'master'");
    userType = 'master';
}



///
/// start
///
UserManager.SetUserType(userType, () => {

    /// Connect to socket
    SocketManager.Connect();

    // /// Start videochat
    // // VideochatManager.init(userType);


    ///Load remote files
    FilesManager.init('https://test.issimissimo.com/folderToLoadFiles/');
})







