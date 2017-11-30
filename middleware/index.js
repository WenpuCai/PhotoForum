//  ALL THE MIDDLEWARE GOES HERE
var middlewareObj = {};

var Campground = require("../models/campground"),
    Comment    = require("../models/comment");

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    //  is user logged in ?
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground){
            if (err) {
                req.flash("error", "Campground not found!");
                res.redirect("back");
            } else {
                //  does the user own the campground ?
                // foundCampground.author.id is a mongoose object vs. req.user._id is a String
                // console.log(foundCampground.author.id);
                // console.log(req.user._id);
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You do not have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
       req.flash("error", "You need to login to do that!");
       res.redirect("back"); 
    }
}


middlewareObj.checkCommentOwnership = function(req, res, next){
    //  is user logged in ?
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err) {
                res.redirect("back");
            } else {
                //  does the user own the campground ?
                // foundCampground.author.id is a mongoose object vs. req.user._id is a String
                //console.log(foundComment.author.id);
                //console.log(req.user._id);
                if (foundComment.author.id.equals(req.user._id)) {
                    next();                     //come from Passport
                } else {
                    req.flash("error", "You do not have the permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
       req.flash("error", "You need to login to do that!");
       res.redirect("back"); 
    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash("error", "You need to login to do that!"); // will not display right now but gives the ability to display on the next reqest while actually get in the next page
        res.redirect("/login");
    }
}

module.exports = middlewareObj;