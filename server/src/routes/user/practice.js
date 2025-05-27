const express = require("express");

const practiceController = require("../../controllers/user/practice");

const authenticateWithJwt = require("../../middlewares/authenticateWithJwt");

const router = express.Router();

router
  .route("/")
  .all(authenticateWithJwt)
  .get(practiceController.getRandomWords)
  .post(practiceController.savePracticeHistory);

module.exports = router;
