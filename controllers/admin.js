const {administrator} = require('../models/admin');

exports.getLoginScreen = (req,res) => {
    res.render('../views/admin.ejs');
}

exports.postLogin = (req,res) => {
    const administratorID = req.body.adminID;
    const administratorPassword = req.body.adminPassword;
    const collectionName = 'administratorData';
    const attendance = new administrator(collectionName,administratorID,administratorPassword);
    attendance.record();
    // attendance.test();
    res.redirect('/admin');
}