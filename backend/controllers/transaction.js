const asyncHandler = require("express-async-handler");
const Transaction = require("../models/transaction");
const User = require("../models/user");

// Utility function to calculate interest
const calculateInterest = (amount, interval, timestamp) => {
  const now = new Date();
  const timeDifference = now - new Date(timestamp);

  const intervalMapping = {
    Daily: 1 / 365,
    Weekly: 1 / 52,
    Monthly: 1 / 12,
    Yearly: 1,
  };

  const yearsElapsed = timeDifference / (1000 * 60 * 60 * 24 * 365);
  const interestRate = 0.07;

  // Interest formula based on interval
  const yearlyFraction = intervalMapping[interval] || 0;
  const interest = amount * interestRate * yearlyFraction * yearsElapsed;

  console.log(interest, amount, interval, timestamp);
  return interest;
};

// Post a deposit
const postDeposit = asyncHandler(async (req, res) => {
  const { amount, interval } = req.body;
  const userId = req.user._id;

  // Create a credit transaction
  const transaction = new Transaction({
    userId,
    amount,
    interval,

    type: "Credit",
  });
  await transaction.save();

  // Update user's total balance
  req.user.totalBalance += amount;
  await User.findByIdAndUpdate(req.user._id, {
    totalBalance: req.user.totalBalance,
  });

  res.status(201).json({ message: "Deposit successful", transaction });
});

// Cashout mechanism
const cashout = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  const userId = req.user._id;
  // Validate user

  // Check if user has enough balance
  if (req.user.totalBalance < amount) {
    res.status(400);
    throw new Error("Insufficient balance");
  }

  // Create a debit transaction
  const transaction = new Transaction({
    userId,
    amount,
    type: "Debit",
  });
  await transaction.save();

  // Update user's total balance
  req.user.totalBalance -= amount;
  await User.findByIdAndUpdate(req.user._id, {
    totalBalance: req.user.totalBalance,
  });

  res.status(201).json({ message: "Cashout successful", transaction });
});

const getReports = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Fetch all transactions for the user
  const transactions = await Transaction.find({ userId });

  let totalDeposits = 0;
  let totalInterest = 0;

  const now = new Date();
  const reportDetails = transactions.map((transaction) => {
    const { amount, interval, timestamp, type } = transaction;

    // Calculate interest for credits only
    if (type === "Credit") {
      const interest = calculateInterest(amount, interval, timestamp);

      totalDeposits += amount;
      totalInterest += interest;

      return {
        amount,
        interval,
        timestamp,
        interest: interest.toFixed(2),
        remainingBalance: (amount + interest).toFixed(2),
        type,
      };
    }

    return {
      amount,
      interval,
      timestamp,
      interest: 0,
      remainingBalance: 0,
      type,
    };
  });

  // Update the user's total balance to include the interest
  const updatedTotalBalance = req.user.totalBalance + totalInterest;
  await User.findByIdAndUpdate(req.user._id, {
    totalBalance: updatedTotalBalance,
  });

  res.status(200).json({
    totalDeposits: totalDeposits.toFixed(2),
    totalInterest: totalInterest.toFixed(2),
    user: {
      name: req.user.username,
      totalBalance: updatedTotalBalance.toFixed(2),
    },
    reportDetails,
  });
});

module.exports = { postDeposit, cashout, getReports };
