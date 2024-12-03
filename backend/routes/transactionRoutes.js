const express = require("express");
const authMiddleware = require("../middlewares/auth");
const {
  postDeposit,
  cashout,
  getReports,
} = require("../controllers/transaction");
const router = express.Router();

router.use(authMiddleware);
router.post("/deposit", postDeposit);
router.post("/cashout", cashout);
router.get("/reports/", getReports);

module.exports = router;
