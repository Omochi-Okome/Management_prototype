const {administrator} = require('../models/admin');


//以下ログイン前
exports.getLoginScreen = (req,res) => {
    res.render('../views/admin/admin.ejs');
}

exports.postLogin = (req,res) => {
    const administratorID = req.body.adminID;
    const administratorPassword = req.body.adminPassword;
    const collectionName = 'administratorData';
    const attendance = new administrator(collectionName,administratorID,administratorPassword);
    attendance.record()
    .then(loginResult => {
        if(loginResult) {
            res.redirect('/admin/home');
        } else {
            res.redirect('/admin');
        }
    })
    .catch(err => {
        console.log(err);
        res.redirect('/admin');
    })
}

//以下ログイン後
exports.getHome = (req,res) => {
    res.render('../views/admin/admin_home.ejs');
}

exports.getEmployeeInformation = (req,res) => {
    res.render('../views/admin/employeeInformation');
}