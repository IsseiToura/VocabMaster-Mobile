const express = require("express");

const practiceHistoriesController = require("../../controllers/user/practice_histories");

const authenticateWithJwt = require("../../middlewares/authenticateWithJwt");
const validateMongoId = require("../../middlewares/validateMongoId");
const validatePagination = require("../../middlewares/validatePaginateQueryParams");

const router = express.Router();

router
  .route("/")
  .all(authenticateWithJwt)
  .get(validatePagination, practiceHistoriesController.getPracticeHistories);

router
  .route("/:id")
  .all(authenticateWithJwt)
  .all(validateMongoId("id"))
  .get(practiceHistoriesController.getPracticeHistoryById)
  .delete(practiceHistoriesController.deletePracticeHistory)
  .put(practiceHistoriesController.updatePracticeHistory);

module.exports = router;
