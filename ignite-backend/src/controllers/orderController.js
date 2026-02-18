import Order from "../models/Order.js";
import Theme from "../models/Theme.js";

// CREATE ORDER (User buys a theme)
export const createOrder = async (req, res) => {
  try {
    const { themeId } = req.body;

    // Check if theme exists
    const theme = await Theme.findById(themeId);
    if (!theme) {
      return res.status(404).json({ message: "Theme not found" });
    }

    // Create order
    const order = await Order.create({
      user: req.user._id,
      theme: themeId,
      status: "completed",
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to create order" });
  }
};

// GET USER ORDERS
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("theme")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

