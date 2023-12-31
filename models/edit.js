const mongoDB = require('mongodb');
const getDB = require('../util/database').getDB;

class insertEditedRecord{
    constructor(_id,formattedStartTime,formattedEndTime){
        this._id = _id;
        this.formattedStartTime = formattedStartTime;
        this.formattedEndTime = formattedEndTime;
        this.collectionName = "workTimeRecord";
    }
    async editedRecord() {
        const DB = getDB();
        const collection = DB.collection(this.collectionName);
        try{
            console.log(this._id);
            const findStartTime = await collection.findOne({
                _id:new mongoDB.ObjectId(this._id),
            });
            const updateData = {
                $set: {
                    startTime: this.formattedStartTime,
                    endTime: this.formattedEndTime
                }
            };
            console.log(new mongoDB.ObjectId(this._id))
            const result = await collection.updateOne(
                {
                    _id:new mongoDB.ObjectId(this._id),
                },
                updateData
            );

            if (result.modifiedCount >0) {
                console.log('更新に成功しました')
            } else {
                console.log('更新に失敗しました。')
                console.log(result);
            }
        } catch(err) {
            console.log(err);
        }
    }
}

module.exports = {insertEditedRecord};