const db = require("../../db");

class InvoiceController {
	// Lấy tất cả invoice
	async getAllInvoices(req, res) {
		try {
			const [rows] = await db.execute(`
                SELECT i.*, o.table_id, d.code as discount_code
                FROM Invoice i
                LEFT JOIN CustomerOrder o ON i.order_id = o.order_id
                LEFT JOIN Discount d ON i.discount_id = d.discount_id
                ORDER BY i.invoice_id
            `);
			res.json(rows);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	// Thêm invoice mới (tính tự động total_amount)
	async createInvoice(req, res) {
		const { order_id, discount_id } = req.body;
		try {
			// Lấy danh sách món trong đơn
			const [items] = await db.execute(
				`SELECT oi.quantity, d.price FROM OrderItem oi JOIN Dish d ON oi.dish_id = d.dish_id WHERE oi.order_id = ?`,
				[order_id]
			);
			if (!items.length)
				return res
					.status(400)
					.json({ error: "Đơn hàng không có món nào!" });
			let total = items.reduce((sum, i) => sum + i.quantity * i.price, 0);
			// Nếu có discount, kiểm tra hợp lệ và áp dụng
			if (discount_id) {
				const [discounts] = await db.execute(
					`SELECT * FROM Discount WHERE discount_id = ? AND is_active = 1 AND valid_from <= CURDATE() AND valid_to >= CURDATE() AND min_order_amount <= ?`,
					[discount_id, total]
				);
				if (discounts.length) {
					const d = discounts[0];
					if (d.type === "percent") {
						total = Math.round(total * (1 - d.value / 100));
					} else if (d.type === "amount") {
						total = Math.max(0, total - d.value);
					}
				}
			}
			// Thêm invoice
			const [result] = await db.execute(
				`INSERT INTO Invoice (order_id, discount_id, total_amount) VALUES (?, ?, ?)`,
				[order_id, discount_id || null, total]
			);
			res.json({
				success: true,
				invoice_id: result.insertId,
				total_amount: total,
			});
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	// Không cho phép sửa total_amount
	async updateInvoice(req, res) {
		const { id } = req.params;
		const { order_id, discount_id } = req.body;
		try {
			// Tính lại total_amount như khi tạo mới
			const [items] = await db.execute(
				`SELECT oi.quantity, d.price FROM OrderItem oi JOIN Dish d ON oi.dish_id = d.dish_id WHERE oi.order_id = ?`,
				[order_id]
			);
			if (!items.length)
				return res
					.status(400)
					.json({ error: "Đơn hàng không có món nào!" });
			let total = items.reduce((sum, i) => sum + i.quantity * i.price, 0);
			if (discount_id) {
				const [discounts] = await db.execute(
					`SELECT * FROM Discount WHERE discount_id = ? AND is_active = 1 AND valid_from <= CURDATE() AND valid_to >= CURDATE() AND min_order_amount <= ?`,
					[discount_id, total]
				);
				if (discounts.length) {
					const d = discounts[0];
					if (d.type === "percent") {
						total = Math.round(total * (1 - d.value / 100));
					} else if (d.type === "amount") {
						total = Math.max(0, total - d.value);
					}
				}
			}
			await db.execute(
				`UPDATE Invoice SET order_id = ?, discount_id = ?, total_amount = ? WHERE invoice_id = ?`,
				[order_id, discount_id || null, total, id]
			);
			res.json({ success: true, total_amount: total });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	// Xóa invoice
	async deleteInvoice(req, res) {
		const { id } = req.params;
		try {
			await db.execute(`DELETE FROM Invoice WHERE invoice_id = ?`, [id]);
			res.json({ success: true });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
}

module.exports = new InvoiceController();
