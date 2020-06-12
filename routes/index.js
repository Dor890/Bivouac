var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user");

// ROOT ROUTE
router.get("/", function(req, res)
{
	res.render("landing");
});

// ===============
// AUTH ROUTES
// ===============

//Show register form
router.get("/register", function(req, res)
{
	res.render("register");
});

//Handle sign-up logic
router.post("/register", function(req, res)
{
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user)
	{
		if(err)
		{
			console.log(err);
			req.flash("error", err);
			return res.render("register")
		}
		// else - Log him in
		passport.authenticate("local")(req, res, function()
		{
			req.flash("success", "Welcome to Bivouac, " + user.username);
			res.redirect("/campgrounds");
		});
	});
});

// Show login form
router.get("/login", function(req, res)
{
	res.render("login");
});

// Handle login logic (#Middleware)
router.post("/login", passport.authenticate("local",
{
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), function(req, res){});

// LOGOUT ROUTE
router.get("/logout", function(req, res)
{
	req.logout();
	req.flash("success", "You have logged out successfully");
	res.redirect("/campgrounds");
});

module.exports = router;