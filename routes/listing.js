const express = require("express");
const router = express.Router();

const { isLoggedIn, isOwner ,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");

const wrapAsync = require("../utils/wrapAsync.js");

//index route
router.get("/", wrapAsync(listingController.index));

router.get("/new",isLoggedIn,listingController.renderNewForm);

// show route
router.get("/:id",wrapAsync(listingController.showListing));

//add listing
router.post("/",isLoggedIn,validateListing,wrapAsync(listingController.createListing));

//edit
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

//update
router.put("/:id",isLoggedIn,isOwner,validateListing ,wrapAsync(listingController.updateListing));

//delete
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;