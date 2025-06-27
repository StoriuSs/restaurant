const express = require("express");
const router = express.Router();
const handlesController = require("../controllers/handlesController");

router.get("/", handlesController.getAllHandles);
router.post("/", handlesController.createHandle);
router.put("/:employee_id/:order_id", handlesController.updateHandle);
router.delete("/:employee_id/:order_id", handlesController.deleteHandle);

module.exports = router;
