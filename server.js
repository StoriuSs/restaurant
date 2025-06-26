const express = require("express");
const path = require("path");
const db = require("./db");

// Import routes
const customerRoutes = require("./src/routes/customers");
const dishRoutes = require("./src/routes/dishes");
const tableRoutes = require("./src/routes/tables");
const employeeRoutes = require("./src/routes/employees");

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
});
