const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservationController");

// Lấy tất cả reservation
router.get("/", reservationController.getAllReservations);

// Thêm reservation mới
router.post("/", reservationController.createReservation);

// Cập nhật reservation
router.put("/:id", reservationController.updateReservation);

// Xóa reservation
router.delete("/:id", reservationController.deleteReservation);

module.exports = router;
