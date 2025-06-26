const db = require("../../db");

class DishController {
	// Lấy tất cả món ăn
	async getAllDishes(req, res) {
		try {
			const [rows] = await db.execute(
				"SELECT * FROM Dish ORDER BY dish_id"
			);
			res.json(rows);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	// Thêm món ăn mới
	async createDish(req, res) {
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
	}

	// Cập nhật món ăn
	async updateDish(req, res) {
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
	}

	// Xóa món ăn
	async deleteDish(req, res) {
		const { id } = req.params;

		try {
			await db.execute("DELETE FROM Dish WHERE dish_id = ?", [id]);
			res.json({ success: true });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
}

module.exports = new DishController();
