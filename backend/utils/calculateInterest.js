const cron = require("node-cron");
const User = require("../models/user.js");

const calculateInterestForAllCustomers = async () => {
  try {
    console.log(
      `[${new Date().toISOString()}] Calculating interest for all customers...`
    );
    const customers = await User.find({});
    for (const customer of customers) {
      try {
        const dailyInterest = calculateDailyInterest(
          customer.totalBalance,
          0.07
        );
        await updateCustomerBalance(customer._id, dailyInterest);
      } catch (error) {
        console.error(
          `Failed to update interest for customer ${customer._id}:`,
          error
        );
      }
    }
    console.log("Interest calculation completed.");
  } catch (error) {
    console.error("Error calculating interest:", error);
  }
};

const calculateDailyInterest = (balance, annualRate) => {
  const dailyRate = annualRate / 365;
  return balance * dailyRate;
};

const updateCustomerBalance = async (customerId, dailyInterest) => {
  await User.updateOne(
    { _id: customerId },
    {
      $inc: { totalBalance: dailyInterest },
      $set: { lastInterest: dailyInterest },
    }
  );
  console.log(`Updating customer ${customerId} with interest ${dailyInterest}`);
};

const scheduleInterestJob = () => {
  cron.schedule("59 23 * * *", calculateInterestForAllCustomers, {
    timezone: "Africa/Addis_Ababa",
  });
};

module.exports = { scheduleInterestJob };
