exports.getLoginScreen = (req,res) => {
    res.render('../views/admin.ejs');
}

exports.postLogin = (req,res) => {
    const adminID = req.body.adminID;
    const adminPassword = req.body.adminPassword;
    console.log(`adminID is ${adminID} `);
    console.log(`adminPassword is ${adminPassword} `);
    res.redirect('/admin');
}