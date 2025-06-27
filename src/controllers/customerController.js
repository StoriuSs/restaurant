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
		const { f_name, l_name, age, phone, email, phones, emails } = req.body;
		const connection = await db.getConnection();

		try {
			await connection.beginTransaction();

			// Thêm customer
			const [result] = await connection.execute(
				"INSERT INTO Customer (f_name, l_name, age) VALUES (?, ?, ?)",
				[f_name, l_name, age]
			);

			const customerId = result.insertId;

			// Xử lý phone(s)
			let phoneArr = [];
			if (Array.isArray(phones)) phoneArr = phones;
			else if (typeof phone === "string")
				phoneArr = phone
					.split(/[,;\n\r]+|\s+/)
					.map((s) => s.trim())
					.filter(Boolean);
			else if (phone) phoneArr = [phone];
			for (const p of phoneArr) {
				if (p) {
					await connection.execute(
						"INSERT INTO Customer_Phone (customer_id, phone) VALUES (?, ?)",
						[customerId, p]
					);
				}
			}

			// Xử lý email(s)
			let emailArr = [];
			if (Array.isArray(emails)) emailArr = emails;
			else if (typeof email === "string")
				emailArr = email
					.split(/[,;\n\r]+|\s+/)
					.map((s) => s.trim())
					.filter(Boolean);
			else if (email) emailArr = [email];
			for (const e of emailArr) {
				if (e) {
					await connection.execute(
						"INSERT INTO Customer_Email (customer_id, email) VALUES (?, ?)",
						[customerId, e]
					);
				}
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
		const { f_name, l_name, age, phone, email, phones, emails } = req.body;
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

			// Xử lý phone(s)
			let phoneArr = [];
			if (Array.isArray(phones)) phoneArr = phones;
			else if (typeof phone === "string")
				phoneArr = phone
					.split(/[,;\n\r]+|\s+/)
					.map((s) => s.trim())
					.filter(Boolean);
			else if (phone) phoneArr = [phone];
			for (const p of phoneArr) {
				if (p) {
					await connection.execute(
						"INSERT INTO Customer_Phone (customer_id, phone) VALUES (?, ?)",
						[id, p]
					);
				}
			}

			// Xử lý email(s)
			let emailArr = [];
			if (Array.isArray(emails)) emailArr = emails;
			else if (typeof email === "string")
				emailArr = email
					.split(/[,;\n\r]+|\s+/)
					.map((s) => s.trim())
					.filter(Boolean);
			else if (email) emailArr = [email];
			for (const e of emailArr) {
				if (e) {
					await connection.execute(
						"INSERT INTO Customer_Email (customer_id, email) VALUES (?, ?)",
						[id, e]
					);
				}
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
