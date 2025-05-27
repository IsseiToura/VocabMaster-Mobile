const express = require("express");

const userDetailController = require("../../controllers/admin/user_detail");

const authenticateWithJwt = require("../../middlewares/authenticateWithJwt");
const checkAdmin = require("../../middlewares/checkAdmin");
const validateMongoId = require("../../middlewares/validateMongoId");
const validatePagination = require("../../middlewares/validatePaginateQueryParams");

const router = express.Router();

router
  .route("/")
  .all(authenticateWithJwt)
  .all(checkAdmin)
  .get(validatePagination, userDetailController.getAllUsers)
  .post(userDetailController.createUser);

router
  .route("/:id")
  .all(authenticateWithJwt)
  .all(checkAdmin)
  .all(validateMongoId("id"))
  .get(userDetailController.getUserById)
  .delete(userDetailController.deleteUser)
  .put(userDetailController.updateUser);

module.exports = router;
