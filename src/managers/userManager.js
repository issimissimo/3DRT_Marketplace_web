import * as SocketManager from './socketManager.js';
import { UIManager } from './UIManager.js';


const jsonObj = {
    class: "UserManager",
}


var _userType;
var _interactionType;





// $('#leaveInteraction').click(function () {
//     UserManager.leaveInteraction();
// })
// $('#getInteraction').click(function () {
//     UserManager.getInteraction();
// })


export class UserManager {

    // static OnInteractionTypeChanged = [];



    /// set user type
    static SetUserType(value, callback) {
        console.log("set userType: " + value);
        _userType = value;

        UIManager.SetUI(function () {

            const inter = _userType == "master" ? "sender" : "receiver";
            UserManager.SetInteractionType(inter, callback);
        });
    }


    ///
    /// get user type
    ///
    static get userType() {
        return _userType;
    }


    ///
    /// get user interaction type
    ///
    static get interactionType() {
        return _interactionType;
    }


    ///
    /// set user interaction type
    ///
    static SetInteractionType(value, callback) {
        console.log("set interactionType: " + value);
        _interactionType = value;

        /// set the UI
        UIManager.OnInteractionType(_interactionType);

        /// call all the subscribed functions
        /// on interactionType changed
        for (let i = 0; i < UserManager.OnInteractionTypeChanged.length; i++) {
            UserManager.OnInteractionTypeChanged[i]();
        }

        if (callback) callback();
    }


    ///
    /// toggle interaction
    ///
    static toggleInteraction() {

        /// set interaction type
        const interactionType = UserManager.interactionType == "sender" ? "receiver" : "sender";
        UserManager.SetInteractionType(interactionType);


        /// send message if you are master
        if (UserManager.userType == "master") {
            jsonObj.action = "toggleInteraction";
            SocketManager.FMEmitStringToOthers(JSON.stringify(jsonObj));
        }
    };


    ///
    /// receive data from socket
    ///
    static ReceiveData(obj) {
        if (_userType) {

            if (obj.action == "toggleInteraction") {
                UserManager.toggleInteraction();
            }
        }
    };
};


UserManager.OnInteractionTypeChanged = [];

UserManager.masterPassw = "123456789";



