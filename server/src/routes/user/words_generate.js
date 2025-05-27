const express = require("express");

const wordsGenerateController = require("../../controllers/user/words_generate");
const authenticateWithJwt = require("../../middlewares/authenticateWithJwt");

const router = express.Router();

router
  .route("/")
  .all(authenticateWithJwt)
  .post(wordsGenerateController.generate);

router
  .route("/save_selected")
  .all(authenticateWithJwt)
  .post(wordsGenerateController.saveSelectedWords);

module.exports = router;
