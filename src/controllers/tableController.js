const db = require("../../db");

class TableController {
	// Lấy tất cả bàn
	async getAllTables(req, res) {
		try {
			const [rows] = await db.execute(
				"SELECT * FROM RestaurantTable ORDER BY table_id"
			);
			res.json(rows);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	// Thêm bàn mới
	async createTable(req, res) {
		const { num_seats, status } = req.body;

		try {
			const [result] = await db.execute(
				"INSERT INTO RestaurantTable (num_seats, status) VALUES (?, ?)",
				[num_seats, status || "available"]
			);
			res.json({ success: true, table_id: result.insertId });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	// Cập nhật bàn
	async updateTable(req, res) {
		const { id } = req.params;
		const { num_seats, status } = req.body;

		try {
			await db.execute(
				"UPDATE RestaurantTable SET num_seats = ?, status = ? WHERE table_id = ?",
				[num_seats, status, id]
			);
			res.json({ success: true });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	// Xóa bàn
	async deleteTable(req, res) {
		const { id } = req.params;

		try {
			await db.execute("DELETE FROM RestaurantTable WHERE table_id = ?", [
				id,
			]);
			res.json({ success: true });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
}

module.exports = new TableController();
