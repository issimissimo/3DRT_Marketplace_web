
export class UIManager {

    static OnInteractionType(interactionType){
        if (interactionType == 'sender'){
            $('#window-main').addClass('active-user');
        }
        else if (interactionType == 'receiver'){
            $('#window-main').removeClass('active-user');
        }
    }
}