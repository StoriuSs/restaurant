const db = require("../../db");

class CustomerController {
	// Lấy tất cả khách hàng
	async getAllCustomers(req, res) {
		try {
			const [rows] = await db.execute(`
                SELECT c.*, 
                       GROUP_CONCAT(DISTINCT cp.phone) as phones,
                       GROUP_CONCAT(DISTINCT ce.email) as emails
                FROM Customer c
                LEFT JOIN Customer_Phone cp ON c.customer_id = cp.customer_id
                LEFT JOIN Customer_Email ce ON c.customer_id = ce.customer_id
                GROUP BY c.customer_id
            `);
			res.json(rows);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	// Thêm khách hàng mới
	async createCustomer(req, res) {
		const { f_name, l_name, age, phone, email } = req.body;
		const connection = await db.getConnection();

		try {
			await connection.beginTransaction();

			// Thêm customer
			const [result] = await connection.execute(
				"INSERT INTO Customer (f_name, l_name, age) VALUES (?, ?, ?)",
				[f_name, l_name, age]
			);

			const customerId = result.insertId;

			// Thêm phone nếu có
			if (phone && phone.trim()) {
				await connection.execute(
					"INSERT INTO Customer_Phone (customer_id, phone) VALUES (?, ?)",
					[customerId, phone.trim()]
				);
			}

			// Thêm email nếu có
			if (email && email.trim()) {
				await connection.execute(
					"INSERT INTO Customer_Email (customer_id, email) VALUES (?, ?)",
					[customerId, email.trim()]
				);
			}

			await connection.commit();
			res.json({ success: true, customer_id: customerId });
		} catch (error) {
			await connection.rollback();
			res.status(500).json({ error: error.message });
		} finally {
			connection.release();
		}
	}

	// Cập nhật khách hàng
	async updateCustomer(req, res) {
		const { id } = req.params;
		const { f_name, l_name, age, phone, email } = req.body;
		const connection = await db.getConnection();

		try {
			await connection.beginTransaction();

			// Cập nhật thông tin cơ bản
			await connection.execute(
				"UPDATE Customer SET f_name = ?, l_name = ?, age = ? WHERE customer_id = ?",
				[f_name, l_name, age, id]
			);

			// Xóa phone và email cũ
			await connection.execute(
				"DELETE FROM Customer_Phone WHERE customer_id = ?",
				[id]
			);
			await connection.execute(
				"DELETE FROM Customer_Email WHERE customer_id = ?",
				[id]
			);

			// Thêm phone mới nếu có
			if (phone && phone.trim()) {
				await connection.execute(
					"INSERT INTO Customer_Phone (customer_id, phone) VALUES (?, ?)",
					[id, phone.trim()]
				);
			}

			// Thêm email mới nếu có
			if (email && email.trim()) {
				await connection.execute(
					"INSERT INTO Customer_Email (customer_id, email) VALUES (?, ?)",
					[id, email.trim()]
				);
			}

			await connection.commit();
			res.json({ success: true });
		} catch (error) {
			await connection.rollback();
			res.status(500).json({ error: error.message });
		} finally {
			connection.release();
		}
	}

	// Xóa khách hàng
	async deleteCustomer(req, res) {
		const { id } = req.params;
		const connection = await db.getConnection();

		try {
			await connection.beginTransaction();

			// Xóa phone và email trước
			await connection.execute(
				"DELETE FROM Customer_Phone WHERE customer_id = ?",
				[id]
			);
			await connection.execute(
				"DELETE FROM Customer_Email WHERE customer_id = ?",
				[id]
			);

			// Xóa customer
			await connection.execute(
				"DELETE FROM Customer WHERE customer_id = ?",
				[id]
			);

			await connection.commit();
			res.json({ success: true });
		} catch (error) {
			await connection.rollback();
			res.status(500).json({ error: error.message });
		} finally {
			connection.release();
		}
	}
}

module.exports = new CustomerController();
