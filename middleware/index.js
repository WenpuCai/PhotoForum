//  ALL THE MIDDLEWARE GOES HERE
var middlewareObj = {};

var Photo = require("../models/photo"),
    Comment    = require("../models/comment");

middlewareObj.checkPhotoOwnership = function(req, res, next) {
    //  is user logged in ?
    if (req.isAuthenticated()) {
        Photo.findById(req.params.id, function(err, foundPhoto){
            if (err) {
                req.flash("error", "Photo not found!");
                res.redirect("back");
            } else {
                //  does the user own the photo ?
                // foundPhoto.author.id is a mongoose object vs. req.user._id is a String
                // console.log(foundPhoto.author.id);
                // console.log(req.user._id);
                if (foundPhoto.author.id.equals(req.user._id)) {
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
                //  does the user own the photo ?
                // foundPhoto.author.id is a mongoose object vs. req.user._id is a String
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