const express = require("express");

const AuthenticationRouter = require("./user/auth");
const WordsGenerateRouter = require("./user/words_generate");
const YourWordsRouter = require("./user/your_words");
const PracticeRouter = require("./user/practice");
const PracticeHistoriesRouter = require("./user/practice_histories");
const AdminRouter = require("./admin/user_detail");

const router = express.Router();

router.use("/test", (req, res) => {
  res.send("Hello world!");
});

router.use("/auth", AuthenticationRouter);
router.use("/words_generate", WordsGenerateRouter);
router.use("/your_words", YourWordsRouter);
router.use("/practice", PracticeRouter);
router.use("/practice_histories", PracticeHistoriesRouter);
router.use("/admin", AdminRouter);
module.exports = router;
