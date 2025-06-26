const mysql = require("mysql2/promise");

// Cấu hình kết nối database
const dbConfig = {
	host: "localhost",
	port: 3307,
	user: "root",
	password: "hieu1032006",
	database: "restaurant",
	charset: "utf8mb4",
};

// Tạo connection pool
const pool = mysql.createPool({
	...dbConfig,
	connectionLimit: 10,
	queueLimit: 0,
	reconnect: true,
	waitForConnections: true,
});

// Test kết nối
async function testConnection() {
	try {
		const connection = await pool.getConnection();
		console.log("Kết nối database thành công!");
		connection.release();
	} catch (error) {
		console.error("Lỗi kết nối database:", error.message);
	}
}

testConnection();

module.exports = pool;
