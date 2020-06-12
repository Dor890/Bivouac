var express    = require("express"),
    router     = express.Router(),
		Campground = require("../models/campground"),
		middleware = require("../middleware"); //Auto require index.js

// INDEX ROUTE
router.get("/", function(req, res)
{
	Campground.find({}, function(err, allCampgrounds)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	});
});

// CREATE ROUTE
router.post("/", middleware.isLoggedIn, function(req, res)
// Also "/campgrounds" - Rest convention
{
	var name = req.body.name;
	var image = req.body.image;
	var price = req.body.price;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, image: image, price: price, description: desc, author: author};
	// Create new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			req.flash("success", "Campground created successfully");
			res.redirect("/campgrounds");
		}
	});
	// The default is redirect to a get request
});

// NEW ROUTE
router.get("/new", middleware.isLoggedIn, function(req,res)
{
	res.render("campgrounds/new");
});

// SHOW ROUTE
router.get("/:id", function(req,res)
{
	//Find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground)
	{
		if(err || !foundCampground)
		{
			req.flash("error", "Campground not found");
			res.redirect("back");
		}
		else
		{
			//Render show template with that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res)
{
	Campground.findById(req.params.id, function(err, foundCampground)
	{
		if(err || !foundCampground)
		{
			req.flash("error", "Campground not found");
			req.redirect("back");
		}
		else
		{
		res.render("campgrounds/edit", {campground: foundCampground});
		}
	});
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res)
{
	// Find and update the correct campground
	//*Mongoose option
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground)
	{
		if(err)
		{
			res.redirect("/campgrounds");
		}
		else
			//redirect
		{
			req.flash("success", "Campground updated successfully");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res)
{
	Campground.findByIdAndRemove(req.params.id, function(err)
	{
		if(err)
		{
			res.redirect("/campgrounds");
		}
		else
		{
			req.flash("success", "Campground deleted successfully");
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;