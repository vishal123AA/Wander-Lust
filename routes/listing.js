const express = require("express");
const router = express.Router();

const { isLoggedIn, isOwner ,validateListing} = require("../middleware.js");
// for MVC
const listingController = require("../controllers/listing.js");

const wrapAsync = require("../utils/wrapAsync.js");

//here we group or combine the index route and add listing
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,validateListing,wrapAsync(listingController.createListing));

//newlisting form
router.get("/new",isLoggedIn,listingController.renderNewForm);

//here we group or combine the show, update and delete route
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,validateListing ,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));

//edit
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

module.exports = router;