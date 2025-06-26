const db = require("../../db");

class CustomerOrderController {
	// Lấy tất cả order
	async getAllOrders(req, res) {
		try {
			const [rows] = await db.execute(`
                SELECT o.*, t.num_seats
                FROM CustomerOrder o
                LEFT JOIN RestaurantTable t ON o.table_id = t.table_id
                ORDER BY o.order_id
            `);
			res.json(rows);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	// Thêm order mới
	async createOrder(req, res) {
		const { table_id, order_time, status } = req.body;
		try {
			const [result] = await db.execute(
				`INSERT INTO CustomerOrder (table_id, order_time, status) VALUES (?, ?, ?)`,
				[table_id, order_time || null, status || "pending"]
			);
			res.json({ success: true, order_id: result.insertId });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	// Cập nhật order
	async updateOrder(req, res) {
		const { id } = req.params;
		const { table_id, order_time, status } = req.body;
		try {
			await db.execute(
				`UPDATE CustomerOrder SET table_id = ?, order_time = ?, status = ? WHERE order_id = ?`,
				[table_id, order_time, status, id]
			);
			res.json({ success: true });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	// Xóa order
	async deleteOrder(req, res) {
		const { id } = req.params;
		try {
			await db.execute(`DELETE FROM CustomerOrder WHERE order_id = ?`, [
				id,
			]);
			res.json({ success: true });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
}

module.exports = new CustomerOrderController();
