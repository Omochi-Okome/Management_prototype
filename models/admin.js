const getDB = require('../util/database').getDB;

//管理者画面のログイン処理
class administrator {
    constructor(administratorID,administratorPassword){
        this.administratorID = administratorID;
        this.administratorPassword = administratorPassword;
    }
    
    inspectDB(){
        const DB = getDB();
        const collection = DB.collection('administratorData');
        return collection
            .find({administratorID:parseInt(this.administratorID),administratorPassword:parseInt(this.administratorPassword)})
            .toArray()
            .then(data => {
                if (data.length > 0) {
                    return true;
                } else {
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