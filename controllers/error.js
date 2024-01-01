exports.get404 = (req,res) => {
    res.status(404).render('../views/404.ejs');
}