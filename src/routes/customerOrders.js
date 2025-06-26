const express = require("express");
const router = express.Router();
const customerOrderController = require("../controllers/customerOrderController");

router.get("/", customerOrderController.getAllOrders);
router.post("/", customerOrderController.createOrder);
router.put("/:id", customerOrderController.updateOrder);
router.delete("/:id", customerOrderController.deleteOrder);

module.exports = router;
