var express = require("express"),
    router   = express.Router({mergeParams: true}); // Add all the routes into router rather than app

var Comment     = require("../models/comment"),
    Campground  = require("../models/campground"),
    middleware  = require("../middleware");

// Comments New
router.get("/new", middleware.isLoggedIn, function(req, res) {
    // console.log(req.params.id) -> null means req.params.id cannot make it here
    //  find campground by id
    Campground.findById(req.params.id, function(err, campground){ // "campground" in DB, specify it or inthe ejs file campgrund._id will not be found
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground}); // param "campground" <- "campground" in DB
        }
    });
});

// Comments Create
router.post("/", middleware.isLoggedIn, function(req, res) {
    //  lookup campground using ID
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if (err) {
                    req.flash("error", "Something went wrong!");
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully added comment!");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    })
})

/*
    edit route
        |
        v {data}
       form (EJS file)   
        | [data] in req.body
        v
    update route
*/

//  COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    // we need comment to be sent to ejs file for using its text and id, but only need id of campground, so pass comment and campground_id
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }                                            // this id comes from app.js in which we defined app.use("/campgrounds/:id/comments", commentRoutes);
    })
})

//  COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    // comment.findByIdAndUpdate("the id to find by", "the data to update it with", "the callback to run afterwards")
    // For the data, to look for ejs file, we wrap all into a array
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if (err) {         // this because we defined in the routes upfront "/:comment_id"
            res.redirect("back");
        } else {
            req.flash("success", "Comment updated!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

module.exports = router;