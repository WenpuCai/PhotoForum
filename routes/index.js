var express = require("express"),
    router   = express.Router(); // Add all the routes into router rather than app
 
var passport    = require("passport"),
    User        = require("../models/user");
    
// Root Route
router.get('/', function(req, res){
    res.render("landing");
});

// ============
// AUTH ROUTES
//=============

// show register form
router.get("/register", function(req, res){
   res.render("register", {page: 'register'}); 
});
// handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        } else {
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to YelpCamp " + user.username);
                res.redirect("/photos");
            });
        }
    });
});

// show login form
router.get("/login", function(req, res){
   res.render("login", {page: 'login'}); 
});
// handling login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/photos",
    failureRedirect: "/login"
}), function (req, res) {
    
});

// logout
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logout Successfully!"); // req.flash(key, value);
    res.redirect("/");
});

module.exports = router;