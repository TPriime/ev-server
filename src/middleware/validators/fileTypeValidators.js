export const validateDisplayPicture = (mediaFile) => {
    let extension = mediaFile.mimetype;

    // console.log(typeof(extension));

    if((extension === "image/jpg") || (extension === "image/png") || (extension === "image/jpeg")) {
        return true;
    } else{
        return false;
    }
}