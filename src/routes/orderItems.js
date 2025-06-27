const express = require("express");
const router = express.Router();
const orderItemController = require("../controllers/orderItemController");

router.get("/", orderItemController.getAllOrderItems);
router.post("/", orderItemController.createOrderItem);
router.put("/:order_id/:dish_id", orderItemController.updateOrderItem);
router.delete("/:order_id/:dish_id", orderItemController.deleteOrderItem);

module.exports = router;
