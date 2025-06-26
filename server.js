const express = require("express");
const path = require("path");
const db = require("./db");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes cho trang chủ
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ==================== CUSTOMER CRUD ====================
// Lấy tất cả khách hàng
app.get("/api/customers", async (req, res) => {
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
});

// Thêm khách hàng mới
app.post("/api/customers", async (req, res) => {
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
		if (phone) {
			await connection.execute(
				"INSERT INTO Customer_Phone (customer_id, phone) VALUES (?, ?)",
				[customerId, phone]
			);
		}

		// Thêm email nếu có
		if (email) {
			await connection.execute(
				"INSERT INTO Customer_Email (customer_id, email) VALUES (?, ?)",
				[customerId, email]
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
});

// Cập nhật khách hàng
app.put("/api/customers/:id", async (req, res) => {
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
});

// Xóa khách hàng
app.delete("/api/customers/:id", async (req, res) => {
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
		await connection.execute("DELETE FROM Customer WHERE customer_id = ?", [
			id,
		]);

		await connection.commit();
		res.json({ success: true });
	} catch (error) {
		await connection.rollback();
		res.status(500).json({ error: error.message });
	} finally {
		connection.release();
	}
});

// ==================== DISH CRUD ====================
// Lấy tất cả món ăn
app.get("/api/dishes", async (req, res) => {
	try {
		const [rows] = await db.execute("SELECT * FROM Dish ORDER BY dish_id");
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Thêm món ăn mới
app.post("/api/dishes", async (req, res) => {
	const { name, category, price, description, availability } = req.body;

	try {
		const [result] = await db.execute(
			"INSERT INTO Dish (name, category, price, description, availability) VALUES (?, ?, ?, ?, ?)",
			[
				name,
				category,
				price,
				description,
				availability !== undefined ? availability : true,
			]
		);
		res.json({ success: true, dish_id: result.insertId });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Cập nhật món ăn
app.put("/api/dishes/:id", async (req, res) => {
	const { id } = req.params;
	const { name, category, price, description, availability } = req.body;

	try {
		await db.execute(
			"UPDATE Dish SET name = ?, category = ?, price = ?, description = ?, availability = ? WHERE dish_id = ?",
			[name, category, price, description, availability, id]
		);
		res.json({ success: true });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Xóa món ăn
app.delete("/api/dishes/:id", async (req, res) => {
	const { id } = req.params;

	try {
		await db.execute("DELETE FROM Dish WHERE dish_id = ?", [id]);
		res.json({ success: true });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// ==================== RESTAURANT TABLE CRUD ====================
// Lấy tất cả bàn
app.get("/api/tables", async (req, res) => {
	try {
		const [rows] = await db.execute(
			"SELECT * FROM RestaurantTable ORDER BY table_id"
		);
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Thêm bàn mới
app.post("/api/tables", async (req, res) => {
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
});

// Cập nhật bàn
app.put("/api/tables/:id", async (req, res) => {
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
});

// Xóa bàn
app.delete("/api/tables/:id", async (req, res) => {
	const { id } = req.params;

	try {
		await db.execute("DELETE FROM RestaurantTable WHERE table_id = ?", [
			id,
		]);
		res.json({ success: true });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// ==================== EMPLOYEE CRUD ====================
// Lấy tất cả nhân viên
app.get("/api/employees", async (req, res) => {
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
});

// Thêm nhân viên mới
app.post("/api/employees", async (req, res) => {
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
	} = req.body;
	const connection = await db.getConnection();

	try {
		await connection.beginTransaction();
		// Thêm employee - làm tròn salary đến 2 chữ số thập phân
		const roundedSalary = salary
			? Math.round(parseFloat(salary) * 100) / 100
			: null;
		const [result] = await connection.execute(
			"INSERT INTO Employee (f_name, l_name, DoB, gender, hired_date, role, shift, salary) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
			[
				f_name,
				l_name,
				DoB,
				gender,
				hired_date,
				role,
				shift,
				roundedSalary,
			]
		);

		const employeeId = result.insertId;

		// Thêm phone nếu có
		if (phone) {
			await connection.execute(
				"INSERT INTO Employee_Phone (employee_id, phone) VALUES (?, ?)",
				[employeeId, phone]
			);
		}

		// Thêm email nếu có
		if (email) {
			await connection.execute(
				"INSERT INTO Employee_Email (employee_id, email) VALUES (?, ?)",
				[employeeId, email]
			);
		}

		await connection.commit();
		res.json({ success: true, employee_id: employeeId });
	} catch (error) {
		await connection.rollback();
		res.status(500).json({ error: error.message });
	} finally {
		connection.release();
	}
});

// Cập nhật nhân viên
app.put("/api/employees/:id", async (req, res) => {
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
	} = req.body;
	const connection = await db.getConnection();

	try {
		await connection.beginTransaction();
		// Cập nhật thông tin cơ bản - làm tròn salary đến 2 chữ số thập phân
		const roundedSalary = salary
			? Math.round(parseFloat(salary) * 100) / 100
			: null;
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
				roundedSalary,
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

		// Thêm phone mới nếu có
		if (phone && phone.trim()) {
			await connection.execute(
				"INSERT INTO Employee_Phone (employee_id, phone) VALUES (?, ?)",
				[id, phone.trim()]
			);
		}

		// Thêm email mới nếu có
		if (email && email.trim()) {
			await connection.execute(
				"INSERT INTO Employee_Email (employee_id, email) VALUES (?, ?)",
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
});

// Xóa nhân viên
app.delete("/api/employees/:id", async (req, res) => {
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
		await connection.execute("DELETE FROM Employee WHERE employee_id = ?", [
			id,
		]);

		await connection.commit();
		res.json({ success: true });
	} catch (error) {
		await connection.rollback();
		res.status(500).json({ error: error.message });
	} finally {
		connection.release();
	}
});

// Khởi động server
app.listen(PORT, () => {
	console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
