const express = require("express");

const yourWordsController = require("../../controllers/user/your_words");

const authenticateWithJwt = require("../../middlewares/authenticateWithJwt");
const validateMongoId = require("../../middlewares/validateMongoId");
const validatePagination = require("../../middlewares/validatePaginateQueryParams");

const router = express.Router();

router
  .route("/")
  .all(authenticateWithJwt)
  .get(validatePagination, yourWordsController.getYourWords)
  .post(yourWordsController.createYourWord);

router
  .route("/:id")
  .all(authenticateWithJwt)
  .all(validateMongoId("id"))
  .get(yourWordsController.getYourWordById)
  .put(yourWordsController.updateYourWord)
  .delete(yourWordsController.deleteYourWord);

module.exports = router;
