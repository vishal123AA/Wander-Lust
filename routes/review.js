const express = require("express");
const router = express.Router({mergeParams:true});

const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/review.js");

const wrapAsync = require("../utils/wrapAsync.js");

//post review add
router.post("/",isLoggedIn,validateReview,wrapAsync( reviewController.createReview));

//delete the review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor ,wrapAsync(reviewController.destroyReview));

module.exports = router;