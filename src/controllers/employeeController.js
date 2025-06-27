const db = require("../../db");

class EmployeeController {
	// Lấy tất cả nhân viên
	async getAllEmployees(req, res) {
		try {
			const [rows] = await db.execute(`
                SELECT e.*, 
                       GROUP_CONCAT(DISTINCT ep.phone) as phones,
                       GROUP_CONCAT(DISTINCT ee.email) as emails
                FROM Employee e
                LEFT JOIN Employee_Phone ep ON e.employee_id = ep.employee_id
                LEFT JOIN Employee_Email ee ON e.employee_id = ee.employee_id
                GROUP BY e.employee_id
            `);
			res.json(rows);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	// Thêm nhân viên mới
	async createEmployee(req, res) {
		const {
			f_name,
			l_name,
			DoB,
			gender,
			hired_date,
			role,
			shift,
			salary,
			phone,
			email,
			phones,
			emails,
		} = req.body;
		const connection = await db.getConnection();

		try {
			await connection.beginTransaction();

			// Thêm employee
			const [result] = await connection.execute(
				"INSERT INTO Employee (f_name, l_name, DoB, gender, hired_date, role, shift, salary) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
				[f_name, l_name, DoB, gender, hired_date, role, shift, salary]
			);

			const employeeId = result.insertId;

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
						"INSERT INTO Employee_Phone (employee_id, phone) VALUES (?, ?)",
						[employeeId, p]
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
						"INSERT INTO Employee_Email (employee_id, email) VALUES (?, ?)",
						[employeeId, e]
					);
				}
			}

			await connection.commit();
			res.json({ success: true, employee_id: employeeId });
		} catch (error) {
			await connection.rollback();
			res.status(500).json({ error: error.message });
		} finally {
			connection.release();
		}
	}

	// Cập nhật nhân viên
	async updateEmployee(req, res) {
		const { id } = req.params;
		const {
			f_name,
			l_name,
			DoB,
			gender,
			hired_date,
			role,
			shift,
			salary,
			phone,
			email,
			phones,
			emails,
		} = req.body;
		const connection = await db.getConnection();

		try {
			await connection.beginTransaction();

			// Cập nhật thông tin cơ bản
			await connection.execute(
				"UPDATE Employee SET f_name = ?, l_name = ?, DoB = ?, gender = ?, hired_date = ?, role = ?, shift = ?, salary = ? WHERE employee_id = ?",
				[
					f_name,
					l_name,
					DoB,
					gender,
					hired_date,
					role,
					shift,
					salary,
					id,
				]
			);

			// Xóa phone và email cũ
			await connection.execute(
				"DELETE FROM Employee_Phone WHERE employee_id = ?",
				[id]
			);
			await connection.execute(
				"DELETE FROM Employee_Email WHERE employee_id = ?",
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
						"INSERT INTO Employee_Phone (employee_id, phone) VALUES (?, ?)",
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
						"INSERT INTO Employee_Email (employee_id, email) VALUES (?, ?)",
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

	// Xóa nhân viên
	async deleteEmployee(req, res) {
		const { id } = req.params;
		const connection = await db.getConnection();

		try {
			await connection.beginTransaction();

			// Xóa phone và email trước
			await connection.execute(
				"DELETE FROM Employee_Phone WHERE employee_id = ?",
				[id]
			);
			await connection.execute(
				"DELETE FROM Employee_Email WHERE employee_id = ?",
				[id]
			);

			// Xóa employee
			await connection.execute(
				"DELETE FROM Employee WHERE employee_id = ?",
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

module.exports = new EmployeeController();
