exports.getHome = (req,res) => {
    res.render('../views/home.ejs')
}

exports.postAttendance = (req,res) => {
    const EmployeeID = req.body.EmployeeID;
    const EmployeePassword = req.body.EmployeePassword;
    console.log(`EmployeeID is ${EmployeeID}`);
    console.log(`EmployeePassword is ${EmployeePassword}`);
    res.redirect('/');
}