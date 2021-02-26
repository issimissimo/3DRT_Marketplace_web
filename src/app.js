import { VideochatManager } from './managers/videochatManager.js';
import { FilesManager } from './managers/filesManager.js';
import * as SocketManager from './managers/socketManager.js';
import { UIManager } from './managers/UIManager.js';




///
/// start
///
UIManager.ShowWelcome(() => {

    /// Connect to socket
    SocketManager.Connect();

    /// Start videochat
    VideochatManager.init();

    ///Load remote files
    FilesManager.init('https://test.issimissimo.com/folderToLoadFiles/');
});





