var express        = require("express"),
		app            = express(),
		bodyParser     = require("body-parser"),
		mongoose       = require("mongoose"),
		Campground     = require("./models/campground"),
		Comment        = require("./models/comment"),
		User           = require("./models/user")
		seedDB         = require("./seeds"),
		passport       = require("passport"),
		LocalStrategy  = require("passport-local"),
		flash          = require("connect-flash"),
		methodOverride = require("method-override");

//Requiring Routes
	var commentRoutes     = require("./routes/comments"),
			campgroundsRoutes = require("./routes/campgrounds"),
			indexRoutes        = require("./routes/index");

// seedDB(); // Seeds the database (Not in use)
var url = process.env.DATABASEURL || "mongodb://localhost/bivouac";
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

app.use(bodyParser.urlencoded({extended: true})); 
app.use(express.static(__dirname + "/public")); //Recognize folder "public" and auto search there
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(flash());

//PASSPORT CONFIGURATION
app.use(require("express-session")
({
	secret: "My first big full-stack project!",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
// Comes in local mongoose:
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next)
{
	// Pass currentUser to all ROUTS templates
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes); // "/" Doesn't changes anything
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundsRoutes);


// ERROR ROUTE
app.get("*", function(req, res)
{
	res.send("Page is not existed. Please go back to the main page");
});

var port = process.env.PORT || 3000;
app.listen(port, function()
{
	console.log("The Bivouac server is now ON!");
});
