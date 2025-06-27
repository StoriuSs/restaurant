const db = require("../../db");

class OrderItemController {
	// Lấy tất cả order items
	async getAllOrderItems(req, res) {
		try {
			const [rows] = await db.execute(`
                SELECT oi.*, d.name as dish_name, o.table_id
                FROM OrderItem oi
                LEFT JOIN Dish d ON oi.dish_id = d.dish_id
                LEFT JOIN CustomerOrder o ON oi.order_id = o.order_id
                ORDER BY oi.order_id, oi.dish_id
            `);
			res.json(rows);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	// Thêm order item mới
	async createOrderItem(req, res) {
		const { order_id, dish_id, quantity, note } = req.body;
		try {
			await db.execute(
				`INSERT INTO OrderItem (order_id, dish_id, quantity, note) VALUES (?, ?, ?, ?)`,
				[order_id, dish_id, quantity, note]
			);
			res.json({ success: true });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	// Cập nhật order item
	async updateOrderItem(req, res) {
		const { order_id, dish_id } = req.params;
		const { new_order_id, new_dish_id, quantity, note } = req.body;
		try {
			if (
				parseInt(order_id) !== parseInt(new_order_id) ||
				parseInt(dish_id) !== parseInt(new_dish_id)
			) {
				// Nếu đổi khóa chính thì xóa bản ghi cũ và thêm mới
				await db.execute(
					`DELETE FROM OrderItem WHERE order_id = ? AND dish_id = ?`,
					[order_id, dish_id]
				);
				await db.execute(
					`INSERT INTO OrderItem (order_id, dish_id, quantity, note) VALUES (?, ?, ?, ?)`,
					[new_order_id, new_dish_id, quantity, note]
				);
			} else {
				// Nếu không đổi khóa chính thì chỉ update
				await db.execute(
					`UPDATE OrderItem SET quantity = ?, note = ? WHERE order_id = ? AND dish_id = ?`,
					[quantity, note, order_id, dish_id]
				);
			}
			res.json({ success: true });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	// Xóa order item
	async deleteOrderItem(req, res) {
		const { order_id, dish_id } = req.params;
		try {
			await db.execute(
				`DELETE FROM OrderItem WHERE order_id = ? AND dish_id = ?`,
				[order_id, dish_id]
			);
			res.json({ success: true });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
}

module.exports = new OrderItemController();
