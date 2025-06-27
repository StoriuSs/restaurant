const express = require("express");
const path = require("path");
const db = require("./db");

// Import routes
const customerRoutes = require("./src/routes/customers");
const dishRoutes = require("./src/routes/dishes");
const tableRoutes = require("./src/routes/tables");
const employeeRoutes = require("./src/routes/employees");
const reservationRoutes = require("./src/routes/reservations");
const customerOrderRoutes = require("./src/routes/customerOrders");
const handlesRoutes = require("./src/routes/handles");
const orderItemsRoutes = require("./src/routes/orderItems");
const discountsRoutes = require("./src/routes/discounts");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes cho trang chủ
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API Routes
app.use("/api/customers", customerRoutes);
app.use("/api/dishes", dishRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/customer-orders", customerOrderRoutes);
app.use("/api/handles", handlesRoutes);
app.use("/api/order-items", orderItemsRoutes);
app.use("/api/discounts", discountsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: "Có lỗi xảy ra!" });
});

// 404 handler
app.use((req, res) => {
	res.status(404).json({ error: "Không tìm thấy trang" });
});

// Khởi động server
app.listen(PORT, () => {
	console.log(`Server đang chạy tại http://localhost:${PORT}`);
	console.log("Cấu trúc API:");
	console.log("- GET/POST/PUT/DELETE /api/customers");
	console.log("- GET/POST/PUT/DELETE /api/dishes");
	console.log("- GET/POST/PUT/DELETE /api/tables");
	console.log("- GET/POST/PUT/DELETE /api/employees");
	console.log("- GET/POST/PUT/DELETE /api/reservations");
	console.log("- GET/POST/PUT/DELETE /api/customer-orders");
	console.log("- GET/POST/PUT/DELETE /api/handles");
	console.log("- GET/POST/PUT/DELETE /api/order-items");
	console.log("- GET/POST/PUT/DELETE /api/discounts");
});
