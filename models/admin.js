const getDB = require('../util/database').getDB;

class administrator {
    constructor(collectionName,administratorID,administratorPassword){
        this.administratorID = administratorID;
        this.administratorPassword = administratorPassword;
        this.collectionName = collectionName;
    }

    inspectDB(){
        const DB = getDB();
        const collection = DB.collection(this.collectionName);
        return collection
            .find({administratorID:parseInt(this.administratorID),administratorPassword:parseInt(this.administratorPassword)})
            .toArray()
            .then(data => {
                if (data.length > 0) {
                    console.log("パスワードとIDが一致しました!!");
                    return true;
                } else {
                    console.log("パスワードかIDが誤っています。");
                    return false;
                }
            })
            .catch(err => {
                console.log(err);
                throw err;
            })
    }
} 

module.exports = {administrator};