var selectedThumbnailId;
var thumbnails = [];




/// listener for filter buttons
const filterButtons = $('.filters').children();
for (let i=0; i<filterButtons.length; i++){
    const el = $(filterButtons[i]);
    el.click(function(){
        UIManager.changeTab(el.data('class'));
    })
}



export class UIManager {

    static OnInteractionType(interactionType) {
        if (interactionType == 'sender') {
            $('#window-main').addClass('active-user');
        }
        else if (interactionType == 'receiver') {
            $('#window-main').removeClass('active-user');
        }
    }

    static addThumbnail(el, onClickCallback) {
        const id = thumbnails.length;
        // el.attr("data-id", id);

        // thumbnails.push(el);
        // thumbnails[id] = el;

        

        // var lastThumb = thumbnails[thumbnails.length -1];

        el.click(function () {
            // var a = el.data('id');


            if (selectedThumbnailId != id) {

                if (selectedThumbnailId != null) {
                    thumbnails[selectedThumbnailId].find('img').removeClass('active-user');
                }

                thumbnails[id].find('img').addClass('active-user');

                selectedThumbnailId = id;

                

                onClickCallback();
            }

        });

        el.appendTo('#bottomBar');
        el.show();

        
        thumbnails.push(el);
    }


    static changeTab(classType) {
        console.log(classType)
        thumbnails.forEach((el) => {
            if (classType == "all"){
                el.show();
            }
            else{
                if (el.data('class') != classType){
                    el.hide();
                }
                else{
                    el.show();
                }
            }
        })
    }

}