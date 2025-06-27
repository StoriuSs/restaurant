const db = require("../../db");

class PaymentController {
	// Lấy tất cả payment
	async getAllPayments(req, res) {
		try {
			const [rows] = await db.execute(`
                SELECT p.*, i.total_amount, i.order_id
                FROM Payment p
                LEFT JOIN Invoice i ON p.invoice_id = i.invoice_id
                ORDER BY p.payment_id
            `);
			res.json(rows);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	// Lấy payment theo id
	async getPaymentById(req, res) {
		const { id } = req.params;
		try {
			const [rows] = await db.execute(
				`
                SELECT p.*, i.total_amount, i.order_id
                FROM Payment p
                LEFT JOIN Invoice i ON p.invoice_id = i.invoice_id
                WHERE p.payment_id = ?
            `,
				[id]
			);
			if (!rows.length)
				return res
					.status(404)
					.json({ error: "Không tìm thấy payment!" });
			res.json(rows[0]);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	// Thêm payment mới
	async createPayment(req, res) {
		const { invoice_id, payment_method, status } = req.body;
		try {
			// Kiểm tra invoice_id chưa có payment
			const [exist] = await db.execute(
				`SELECT * FROM Payment WHERE invoice_id = ?`,
				[invoice_id]
			);
			if (exist.length)
				return res
					.status(400)
					.json({ error: "Invoice này đã có payment!" });
			// Kiểm tra invoice có tồn tại không
			const [invs] = await db.execute(
				`SELECT * FROM Invoice WHERE invoice_id = ?`,
				[invoice_id]
			);
			if (!invs.length)
				return res
					.status(400)
					.json({ error: "Hóa đơn không tồn tại!" });
			await db.execute(
				`INSERT INTO Payment (invoice_id, payment_method, status) VALUES (?, ?, ?)`,
				[invoice_id, payment_method, status || "pending"]
			);
			res.json({ success: true });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	// Sửa payment
	async updatePayment(req, res) {
		const { id } = req.params;
		const { invoice_id, payment_method, status } = req.body;
		try {
			// Kiểm tra nếu đổi invoice_id thì invoice mới chưa có payment
			if (invoice_id) {
				const [exist] = await db.execute(
					`SELECT * FROM Payment WHERE invoice_id = ? AND payment_id != ?`,
					[invoice_id, id]
				);
				if (exist.length)
					return res
						.status(400)
						.json({ error: "Invoice này đã có payment!" });
				const [invs] = await db.execute(
					`SELECT * FROM Invoice WHERE invoice_id = ?`,
					[invoice_id]
				);
				if (!invs.length)
					return res
						.status(400)
						.json({ error: "Hóa đơn không tồn tại!" });
			}
			await db.execute(
				`UPDATE Payment SET invoice_id = ?, payment_method = ?, status = ? WHERE payment_id = ?`,
				[invoice_id, payment_method, status, id]
			);
			res.json({ success: true });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	// Xóa payment
	async deletePayment(req, res) {
		const { id } = req.params;
		try {
			await db.execute(`DELETE FROM Payment WHERE payment_id = ?`, [id]);
			res.json({ success: true });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
}

module.exports = new PaymentController();
