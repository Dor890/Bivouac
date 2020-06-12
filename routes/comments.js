var express    = require("express"),
    // Merge the params from campgrounds and comments together
    // So that we will be able to access IDs.
    router     = express.Router({mergeParams: true}),
    Campground = require("../models/campground"),
		Comment    = require("../models/comment"),
		middleware = require("../middleware"); //Auto require index.js

// ===============
// COMMENTS ROUTES
// ===============

// Comments New
router.get("/new", middleware.isLoggedIn, function(req, res)
{
	//Find campground by ID
	Campground.findById(req.params.id, function(err, campground)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.render("comments/new", {campground: campground});
		}
	});
});

// Comments Create
router.post("/", middleware.isLoggedIn, function(req, res)
{
	//Lookup campground using ID
	Campground.findById(req.params.id, function(err, campground)
	{
		if(err)
		{
			console.log(err);
			res.redirect("/campgrounds");
		}
		else
		{
			//Create new comment
			//Because we used comment[text] - No need to define
			Comment.create(req.body.comment, function(err, comment)
			{
				if(err)
				{
					console.log(err);
				}
				else
				{
					//Add username and ID to comment & Save
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					//Connect new comment to campground
					campground.comments.push(comment);
					campground.save();
					//Redirect to campground showpage
					req.flash("success", "Successfully created comment");
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

// EDIT COMMENT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res)
{
	Campground.findById(req.params.id, function(err,foundCampground){
		if(err || !foundCampground)
		{
			req.flash("error", "No campground found");
			return res.redirect("back");
		}
		Comment.findById(req.params.comment_id, function (err, foundComment)
		{
			if(err || !foundComment)
			{
				req.flash("error", "Comment not found");
				res.redirect("back");
			}
			else
			{
				res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
				// ID Defined in app.js > Reffers to the camground's ID
			}
		});
	});
});

// UPDATE COMMENT ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res)
{
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment)
	{
		if(err)
		{
			res.redirect("back");
		}
		else
		{
			req.flash("success", "Successfully edit comment");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res)
{
	Comment.findByIdAndRemove(req.params.comment_id, function(err)
	{
		if(err)
		{
			res.redirect("back");
		}
		else
		{
			req.flash("success", "Comment deleted successfully");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

module.exports = router;