const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  amount: Number,
  interval: { type: String, enum: ["Daily", "Weekly", "Monthly", "Yearly"] },
  interest: Number,
  timestamp: { type: Date, default: Date.now },
  type: { type: String, enum: ["Credit", "Debit"] },
});
module.exports = mongoose.model("Transaction", transactionSchema);
