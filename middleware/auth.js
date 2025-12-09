const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.cookies.jwt;

    if (!token) {
        return res.redirect('/login');
    }

    try {
        const user = jwt.verify(token, "supersecretkey");
        req.user = user;
        next();
    } catch (err) {
        res.redirect('/login');
    }
};