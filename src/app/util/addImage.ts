declare var Elastic: any;

export function addImage(tweenMax: any, renderer: any, parentElement: any, imageUrl: string, childElementId: string): void {
    const debug = false;
    const avatarContainer = parentElement.nativeElement;
    const img = renderer.createElement('img');
    renderer.setAttribute(img,'src',imageUrl);
    renderer.setAttribute(img,'id',childElementId);
    const uploadedImage = document.getElementById(childElementId);
    avatarContainer.innerHTML = '';
    if(avatarContainer && uploadedImage) {
        renderer.removeChild(avatarContainer,uploadedImage);
        if(debug) {
            console.log('addImage(): remove image');
        }
    }
    if(debug) {
        console.log('addImage(): arguments: ', arguments);
    }
    if(avatarContainer && imageUrl && imageUrl !== '' && imageUrl !== 'assets/cfm/user-avatars/') {
        
        renderer.appendChild(avatarContainer,img);
        setTimeout( () => {
            const uploadedImage = document.getElementById(childElementId);
            if(uploadedImage) {
                tweenMax.fromTo(uploadedImage, 1, {scale:0, ease:Elastic.easeOut, opacity: 0}, {scale:1, ease:Elastic.easeOut, opacity: 1});
                if(debug) {
                    console.log('addImage(): add image');
                }
            }
        });
        
    }
};
