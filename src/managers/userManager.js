import * as SocketManager from './socketManager.js';
import { UIManager } from './UIManager.js';


const jsonObj = {
    class: "UserManager",
}


var _userType;
var _interactionType;



$('#leaveInteraction').click(function () {
    UserManager.leaveInteraction();
})
$('#getInteraction').click(function () {
    UserManager.getInteraction();
})


export class UserManager {

    static OnInteractionTypeChanged = [];



    /// set user type
    static SetUserType(value, callback) {
        console.log("set userType: " + value);
        _userType = value;

        UIManager.SetUI(function () {

            const inter = _userType == "master" ? "sender" : "receiver";
            UserManager.SetInteractionType(inter, callback);
        });
    }



    /// get user type
    static get userType() {
        return _userType;
    }



    /// set user interaction type
    static SetInteractionType(value, callback) {
        console.log("set interactionType: " + value);
        _interactionType = value;

        /// set the UI
        // const pointerEvent = _interactionType == "sender" ? "all" : "none";
        // $('#window-main').css('pointer-events', pointerEvent);

        /// call all the subscribed functions
        /// on interactionType changed
        for (let i = 0; i < UserManager.OnInteractionTypeChanged.length; i++) {
            UserManager.OnInteractionTypeChanged[i]();
        }

        UIManager.OnInteractionType(_interactionType);

        if (callback) callback();
    }



    /// get user interaction type
    static get interactionType() {
        return _interactionType;
    }






    static leaveInteraction() {
        if (UserManager.interactionType == "sender") {
            UserManager.SetInteractionType("receiver");

            if (UserManager.userType == "master") {
                jsonObj.action = "getControl";
                SocketManager.FMEmitStringToOthers(JSON.stringify(jsonObj));
            }
        }
    }


    static getInteraction() {
        if (UserManager.interactionType == "receiver") {
            UserManager.SetInteractionType("sender");

            if (UserManager.userType == "master") {
                jsonObj.action = "leaveControl";
                SocketManager.FMEmitStringToOthers(JSON.stringify(jsonObj));
            }
        }
    }


    ///
    /// receive data from socket
    ///
    static ReceiveData(obj) {
        if (_userType) {

            if (obj.action == "getControl") {
                UserManager.getInteraction();
            }

            if (obj.action == "leaveControl") {
                UserManager.leaveInteraction();
            }
        }
    };
};





