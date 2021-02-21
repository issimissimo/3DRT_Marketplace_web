var selectedThumbnailId;
var thumbnails = [];

export class UIManager {

    static OnInteractionType(interactionType){
        if (interactionType == 'sender'){
            $('#window-main').addClass('active-user');
        }
        else if (interactionType == 'receiver'){
            $('#window-main').removeClass('active-user');
        }
    }

    static addThumbnail(el, onClickCallback){
        const id = thumbnails.length;
        // el.attr("data-id", id);

        thumbnails.push(el);

        el.click(function () {
            // var a = el.data('id');
            

            if (selectedThumbnailId != id){

                if (selectedThumbnailId != null){
                    thumbnails[selectedThumbnailId].find('img').removeClass('active-user');
                }

                el.find('img').addClass('active-user');

                selectedThumbnailId = id;
                
                onClickCallback();
            }

        });
    }

    static OnThumbnailClicked(id){
        console.log(id)
    }
}