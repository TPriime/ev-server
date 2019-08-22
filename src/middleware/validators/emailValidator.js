export const doesEmailExist = (newUserEmail, existingUserEmails) => {
    for( let user of existingUserEmails){
        if(newUserEmail === user.email) {
            return true;
        }
        return false;
    }
}