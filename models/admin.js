const mongoDB = require('mongodb');
const getDB = require('../util/database').getDB;

class CommonDBOperation {
    constructor(collectionName,administratorID,administratorPassword){
        this.collectionName = collectionName;
        this.administratorID = administratorID;
        this.administratorPassword = administratorPassword;
    }

    inspectDB(){
        const DB = getDB();
        const collection = DB.collection(this.collectionName);
        console.log(this.collectionName);
        console.log(this.administratorID);
        console.log(this.administratorPassword);
        return collection
            .find({administratorID:this.administratorID,administratorPassword:this.administratorPassword})
            .toArray()
            .then(data => {
                if (data.length > 0) {
                    console.log("パスワードとIDが一致しました!!");
                    console.log(`ID:${data[0].administratorID}`);
                    console.log(`Password:${data[0].administratorPassword}`);
                    return true;
                } else {
                    console.log("パスワードかIDが誤っています。");
                    return false;
                }
                return data;
            })
            .catch(err => {
                console.log(err);
                throw err;
            })
    }
    //データの全取得
    fetchAll() {
        const db = getDB();
        return db.collection(this.collectionName)
          .find()
          .toArray()
          .then(data => {
            console.log(data);
          })
      }

}

class administrator {
    constructor(collectionName,administratorID,administratorPassword){
        this.administratorID = administratorID;
        this.administratorPassword = administratorPassword;
        this.collectionName = collectionName;
    }

    record(){
        const operation = new CommonDBOperation(this.collectionName,parseInt(this.administratorID),parseInt(this.administratorPassword));
        return operation.inspectDB();
    }

    test(){
        const operation = new CommonDBOperation(this.collectionName);
        return operation.fetchAll();
    }

} 

module.exports = {administrator};