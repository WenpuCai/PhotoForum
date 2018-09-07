var express  = require("express"),
    router   = express.Router(); // Add all the routes into router rather than app
    
var Photo  = require("../models/photo"),
    middleware  = require("../middleware");

var geocoder = require('geocoder');

/* INDEX - Show all the photos */
//  All Photos Show up here
router.get("/", function(req, res){
    // Get all photos from DB
    Photo.find({}, function(err, allPhotos){
       if(err){
           console.log(err);
       } else {
          res.render("photos/index",{photos: allPhotos, page: 'photos'});
       }
    });
});

/* CREATE - Add new photos to DB */
//  Making New Photos
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
        if (req.body.location !== '') {
            var lat = data.results[0].geometry.location.lat;
            var lng = data.results[0].geometry.location.lng;
            var location = data.results[0].formatted_address;
            var newPhoto = {name: name, image: image, description: description, price: price, author:author, location: location, lat: lat, lng: lng};
        } else {
            var newPhoto = {name: name, image: image, description: description, price: price, author:author};

        } 
            // Create a new photo and save to DB
            Photo.create(newPhoto, function(err, newlyCreated){
                if(err){
                    console.log(err);
                } else {
                    //redirect back to photos page
                    console.log(newlyCreated);
                    res.redirect("/photos");
                }
            });
    });
});

/* NEW - Display form to create new photos */
//  Here shows the form which submits a post request to "/photos" to add and redirect
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("photos/new");
});

/* SHOW - Show more info about the photo */
//  this should goes last
router.get("/:id", function(req, res) {
    //  find the picture with provided ID
    Photo.findById(req.params.id).populate("comments").exec(function(err, foundPhoto){
        if (err) {
            console.log(err);
        } else {
            // render show template with that photo
           res.render("photos/show", {photo: foundPhoto}) ;
        }
    })
});

//  EDIT photo ROUTE
router.get("/:id/edit", middleware.checkPhotoOwnership, function(req, res) {
    Photo.findById(req.params.id, function(err, foundPhoto){
        res.render("photos/edit", {photo: foundPhoto});
    });
});

//  UPDATE photo ROUTE
router.put("/:id", middleware.checkPhotoOwnership, function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    if (req.body.location !== '') {
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newData = {name: req.body.name, image: req.body.image, description: req.body.description, price: req.body.price, location: location, lat: lat, lng: lng};    //  find and update the correct photo
    } else {
        var newData = {name: req.body.name, image: req.body.image, description: req.body.description, price: req.body.price};    //  find and update the correct photo
    } 
        //  findByIdAndUpdate(id, data, recall); var data = {name: req.body.name, image: req.body.image} -> Just wrap this data in form to a groundcamp[ ] array
        Photo.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, updatedPhoto){
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                req.flash("success","Successfully Updated!");
                res.redirect("/photos/" + updatedPhoto._id);
            }
        });
  });
});

//  DESTROY ROUTE
router.delete("/:id", middleware.checkPhotoOwnership, function(req, res){
    Photo.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            res.redirect("/photos");
        } else {
            res.redirect("/photos");
        }
    })
});

module.exports = router;