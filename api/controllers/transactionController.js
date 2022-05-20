const {
  verifyTokenAndStoreCredentials,
  verifyTransactionParameters,
} = require("../assets/middleware");
const { processPortfolioPurchase } = require("../assets/helpers");
const { updateOneCrypto } = require("../assets/api");
const User = require("../models/User");

exports.buyCryptos = [
  verifyTokenAndStoreCredentials,
  (req, res, next) => {
    if (req.params.name === undefined || req.params.quantity === undefined) {
      return res
        .status(400)
        .json({ message: "Please provide correct parameters" });
    } else {
      next();
    }
  },
  async (req, res, next) => {
    try {
      // Retrieve crypto and update it at the same time, along with user information.
      const cryptoToPurchase = await updateOneCrypto(req.params.name);
      const user = await User.findById(res.locals.userId);

      const totalPurchasePrice =
        cryptoToPurchase.price * Number.parseInt(req.params.quantity);

      if (user.balance > totalPurchasePrice) {
        const newBalance = user.balance - totalPurchasePrice;
        const updatedWallet = processPortfolioPurchase(user.portfolio, {
          crypto: cryptoToPurchase,
          quantity: Number.parseInt(req.params.quantity),
        });

        const updatedUser = await User.findByIdAndUpdate(
          res.locals.userId,
          {
            balance: newBalance,
            portfolio: updatedWallet,
          },
          { new: true }
        ).select("username fullName portfolio balance");

        return res.json({ message: "Purchase processed", user: updatedUser });
      } else {
        return res.status(400).json({ message: "Insufficient balance" });
      }
    } catch (error) {
      res.status(400).json({ message: "Invalid crypto name provided", error });
    }
  },
];

exports.sellCryptos = [
  verifyTokenAndStoreCredentials,
  verifyTransactionParameters,
  // Validate user has crypto coin and quantity that they're requesting to sell.
  async (req, res, next) => {
    try {
      const cryptoToSell = await updateOneCrypto(req.params.name);
      const user = await User.findById(res.locals.userId);

      let = validTransaction = false;
      for (let index = 0; index < user.portfolio.length; index++) {
        if (user.portfolio[index].crypto === cryptoToSell.name) {
          if (
            user.portfolio[index].quantity >=
            Number.parseInt(req.params.quantity)
          ) {
            // Valid Transaction
            validTransaction = true;
          } else {
            return res.status(400).json({ message: "Insufficient quantity" });
          }
        }
      }
      if (!validTransaction) {
        return res
          .status(400)
          .json({ message: "User does not own this crypto coin" });
      } else {
        res.locals.user = user;
        res.locals.crypto = crypto;
        next();
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error validating sell request", error });
    }
  },
];
