var _userType;
var _interactionType;


export class UserManager {
    
    static SetUserType(value, callback){
        console.log("set userType: " + value);
        _userType = value;

        const inter = _userType == "master" ? "sender" : "receiver";
        UserManager.SetInteractionType(inter, callback);
    }

    static get userType(){
        return _userType;
    }

    static SetInteractionType (value, callback){
        console.log("set interactionType: " + value);
        _interactionType = value;

        const pointerEvent = _interactionType == "sender" ? "all" : "none";
        $('#window-main').css('pointer-events', pointerEvent);

        if (callback) callback();
    }

    static get interactionType(){
        return _interactionType;
    }

    // static set userType (value){
    //     console.log("set userType = " + value);
    //     _userType = value;

    //     const inter = _userType == "master" ? "sender" : "receiver";
    //     UserManager.interactionType = inter;
    // };

    // static set interactionType (value) {
    //     console.log("set interactionType = " + value);
    //     _interactionType = value;

    //     const pointerEvent = _interactionType == "sender" ? "all" : "none";
    //     $('#window-main').css('pointer-events', pointerEvent);
    // };

    
    // static INTERACTION = {
    //     SENDER: "sender",
    //     RECEIVER: "receiver"
    // }

    // static USER = {
    //     MASTER: "master",
    //     CLIENT: "client"
    // }

    // set userType(value){
    //     console.log("SEEEEEEEEEETTTTTTTTTT")
    //     if (value == UserManager.USER.MASTER){
    //         _userType = value;
    //         _interactionType = UserManager.INTERACTION.SENDER;
    //     };
    //     if (value == UserManager.USER.CLIENT){
    //         _userType = value;
    //         _interactionType = UserManager.INTERACTION.RECEIVER;
    //     }
    // }

    // get userType(){
    //     console.log("GGGGGGEEEEEEEETTTTTTT")
    //     return _userType;
    // }

    // set interactionType(value){
    //     if (value == UserManager.INTERACTION.SENDER || value == UserManager.INTERACTION.RECEIVER){
    //         _interactionType = value;
    //     };
    // }

    // get interactionType(){
    //     return _interactionType;
    // }
};



