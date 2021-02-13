import Videochat from '../src/videochat.js';
import FilesManager from '../src/filesManager.js';

console.log("AAAAAAAAAAAAAAAA")

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let userType = urlParams.get('user');
if (!userType) {
    console.warn("URL user parameter not defined! We'll use 'master'");
    userType = 'master';
}

///Start videochat
// Videochat.init(userType);


///Load remote files
FilesManager.init('http://www.issimissimo.com/playground/folderToListFiles/');







