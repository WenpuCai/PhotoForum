var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    User        = require("./models/user"),          //  "./" means this dir
    Photo  = require("./models/photo"),    //  SCHEMA STEP
    Comment     = require("./models/comment");
    //seedDB      = require("./seeds");

//  requiring routes
var commentRoutes    = require("./routes/comments"),
    photoRoutes = require("./routes/photos"),
    indexRoutes      = require("./routes/index")
    
//seedDB();
// in the command line: export DATABASEURL=mongodb://localhost/photo
// to check if this work by adding a line: console.log(process.env.DATABASEURL); 
mongoose.connect(process.env.DATABASEURL); // 1. good for devloper to hide local address 2. save some trouble because it automatically decide which DB to run
// mongoose.connect("mongodb://localhost/photo");
//mongoose.connect("mongodb://admin:admin@ds125716.mlab.com:25716/photoforum");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
//  __dirname is the dir that this script runs
app.use(methodOverride("_method")); // for "?_method="
app.use(flash());

// MomentJs
app.locals.moment = require('moment');

//  PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "You gonna win, go for it",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// to put currentUser: req.user to every route
app.use(function(req, res, next){
    res.locals.currentUser = req.user; // pass req.user to every template
    res.locals.error = req.flash("error"); // res.locals.whateverName = value you wanna access 
    res.locals.success = req.flash("success");
    next(); // move on
});// app.use(middleware) whatever function we provide in it will be called on every route

app.use(indexRoutes);
app.use("/photos",photoRoutes); // insert "/photos" before the routes,all routes should start with "/photo" 
app.use("/photos/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The Server has started !");
});

// app.listen(3000, function(){
//     console.log("The Server has started !"); //Listening on port 3000
// });
