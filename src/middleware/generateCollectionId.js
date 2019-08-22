 export const generateCollectionId = (collections) => {
    const alphabets = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    const letterOne = alphabets[Math.floor(Math.random() * 27)],
          letterTwo = alphabets[Math.floor(Math.random() * 27)];
    const numOne = Math.floor(Math.random() * 10), 
          numTwo = Math.floor(Math.random() * 10),
          numThree = Math.floor(Math.random() * 10);
    
    const collectionId = `COLTRA${letterOne}${letterTwo}${numOne}${numTwo}${numThree}`;
    if(doesCollectionIdExist(collectionId, collections)) {
        // console.log("exists");
        generateCollectionId(collections);
    }
    // console.log(collectionId);
    return collectionId;
}

const doesCollectionIdExist = (collectionId, collections) => {
    if (collections.length === 0) return false;
    for( let collection of collections ) {
        if(collectionId === collection.collectionId) {
            return true;
        }
        return false;
    }
}