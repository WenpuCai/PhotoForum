var mongoose = require("mongoose"),
Photo = require("./models/photo"),
Comment = require("./models/comment");

var data = [
    {   name: "Tokyo River", 
        image: "http://www.photosforclass.com/download/15047197338",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. "
    },
    {   name: "Tokyo Tower", 
        image: "http://www.photosforclass.com/download/14602900111",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. "
    },
    {   name: "Tokyo Subway", 
        image: "http://www.photosforclass.com/download/8457401629",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. "
    }
]
/*
1.  Remove all photos
2.  Add a few photos, CANNOT be written outside else, because what next wont be executed.
3.  Add a few comments
*/
function seedDB() {
    //  Remove all photos
    Photo.remove({}, function(err){
    //     if (err) {
    //         console.log(err);
    //     } else {
             console.log("Remove all photos !");
    // //  Add a few photos, CANNOT be written outside else, because what next wont be executed.
    //         data.forEach(function(seed){
    //             Photo.create(seed, function(err, photo){
    //                 if (err) {
    //                     console.log(err);
    //                 } else {
    //                     console.log("added a photo !");
    //                     //  Add a few comments
    //                     Comment.create(
    //                         {
    //                             text: "This is a great pic !",
    //                             author: "Homer"
    //                         }, function(err, comment) {
    //                   // associate to photo
    //                             if (err) {
    //                                 console.log(err);
    //                             } else {
    //                                 photo.comments.push(comment);
    //                                 photo.save(); 
    //                                 console.log("Created new comments");
    //                             }
    //                         }
    //                     )
    //                 }
    //             })
    //         })
    //     }
    });
}

module.exports = seedDB;

/*
Photo.create({
    name: "Tokyo River", 
    image: "http://www.photosforclass.com/download/15047197338",
    description: "This is a beautiful river in Tokyo, JP"
}, function(err, photo){
    if (err) {
        console.log(err)
    } else {
        console.log("NEWLY CREATED photo:")
        console.log(photo)
    }
})
*/
/*
var photos = [
        {name: "Tokyo River", image: "http://www.photosforclass.com/download/15047197338"},
        {name: "Tokyo Tower", image: "http://www.photosforclass.com/download/14602900111"},
        {name: "Tokyo Woman", image: "http://www.photosforclass.com/download/14807067238"},
        {name: "Tokyo Subway", image: "http://www.photosforclass.com/download/8457401629"},
        {name: "Tokyo Lattern", image: "http://www.photosforclass.com/download/30642622574"},
        {name: "Tokyo Street", image: "http://www.photosforclass.com/download/34078286773"}
    ]
*/
