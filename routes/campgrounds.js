var express  = require("express"),
    router   = express.Router(); // Add all the routes into router rather than app
    
var Campground  = require("../models/campground"),
    middleware  = require("../middleware");

var geocoder = require('geocoder');

/* INDEX - Show all the campgrounds */
//  All Campgrounds Show up here
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds: allCampgrounds, page: 'campgrounds'});
       }
    });
});

/* CREATE - Add new campgrounds to DB */
//  Making New Campgrounds
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };

    geocoder.geocode(req.body.location, function (err, data) {
        if (data.results !== undefined) {
            var lat = data.results[0].geometry.location.lat;
            var lng = data.results[0].geometry.location.lng;
            var location = data.results[0].formatted_address;
            var newCampground = {name: name, image: image, description: description, price: price, author:author, location: location, lat: lat, lng: lng};
        } else {
            var newCampground = {name: name, image: image, description: description, price: price, author:author};

        } 
            // Create a new campground and save to DB
            Campground.create(newCampground, function(err, newlyCreated){
                if(err){
                    console.log(err);
                } else {
                    //redirect back to campgrounds page
                    console.log(newlyCreated);
                    res.redirect("/campgrounds");
                }
            });
    });
});

/* NEW - Display form to create new campgrounds */
//  Here shows the form which submits a post request to "/campgrounds" to add and redirect
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

/* SHOW - Show more info about the campground */
//  this should goes last
router.get("/:id", function(req, res) {
    //  find the campgound with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if (err) {
            console.log(err);
        } else {
            // render show template with that campground
           res.render("campgrounds/show", {campground: foundCampground}) ;
        }
    })
});

//  EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//  UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    if (data.results !== undefined) {
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newData = {name: req.body.name, image: req.body.image, description: req.body.description, price: req.body.price, location: location, lat: lat, lng: lng};    //  find and update the correct campground
    } else {
        var newData = {name: req.body.name, image: req.body.image, description: req.body.description, price: req.body.price};    //  find and update the correct campground
    } 
        //  findByIdAndUpdate(id, data, recall); var data = {name: req.body.name, image: req.body.image} -> Just wrap this data in form to a groundcamp[ ] array
        Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, updatedCampground){
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                req.flash("success","Successfully Updated!");
                res.redirect("/campgrounds/" + updatedCampground._id);
            }
        });
  });
});

//  DESTROY ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    })
});

module.exports = router;