const db = require("../../db");

class HandlesController {
	// Lấy tất cả handles
	async getAllHandles(req, res) {
		try {
			const [rows] = await db.execute(`
                SELECT h.*, e.f_name, e.l_name, o.table_id
                FROM Handles h
                LEFT JOIN Employee e ON h.employee_id = e.employee_id
                LEFT JOIN CustomerOrder o ON h.order_id = o.order_id
                ORDER BY h.employee_id, h.order_id
            `);
			res.json(rows);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	// Thêm handles mới
	async createHandle(req, res) {
		const { employee_id, order_id, role_in_order } = req.body;
		try {
			await db.execute(
				`INSERT INTO Handles (employee_id, order_id, role_in_order) VALUES (?, ?, ?)`,
				[employee_id, order_id, role_in_order]
			);
			res.json({ success: true });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	// Cập nhật handle
	async updateHandle(req, res) {
		const { employee_id, order_id } = req.params;
		const { role_in_order } = req.body;
		try {
			await db.execute(
				`UPDATE Handles SET role_in_order = ? WHERE employee_id = ? AND order_id = ?`,
				[role_in_order, employee_id, order_id]
			);
			res.json({ success: true });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	// Xóa handle
	async deleteHandle(req, res) {
		const { employee_id, order_id } = req.params;
		try {
			await db.execute(
				`DELETE FROM Handles WHERE employee_id = ? AND order_id = ?`,
				[employee_id, order_id]
			);
			res.json({ success: true });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
}

module.exports = new HandlesController();
