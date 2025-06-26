const db = require("../../db");

class ReservationController {
	// Lấy tất cả reservation
	async getAllReservations(req, res) {
		try {
			const [rows] = await db.execute(`
                SELECT r.*, c.f_name as customer_first_name, c.l_name as customer_last_name, t.num_seats
                FROM Reservation r
                LEFT JOIN Customer c ON r.customer_id = c.customer_id
                LEFT JOIN RestaurantTable t ON r.table_id = t.table_id
                ORDER BY r.reservation_id
            `);
			res.json(rows);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	// Thêm reservation mới
	async createReservation(req, res) {
		const {
			customer_id,
			table_id,
			reservation_time,
			number_guests,
			status,
		} = req.body;
		try {
			const [result] = await db.execute(
				`INSERT INTO Reservation (customer_id, table_id, reservation_time, number_guests, status) VALUES (?, ?, ?, ?, ?)`,
				[
					customer_id,
					table_id,
					reservation_time,
					number_guests,
					status || "pending",
				]
			);
			res.json({ success: true, reservation_id: result.insertId });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	// Cập nhật reservation
	async updateReservation(req, res) {
		const { id } = req.params;
		const {
			customer_id,
			table_id,
			reservation_time,
			number_guests,
			status,
		} = req.body;
		try {
			await db.execute(
				`UPDATE Reservation SET customer_id = ?, table_id = ?, reservation_time = ?, number_guests = ?, status = ? WHERE reservation_id = ?`,
				[
					customer_id,
					table_id,
					reservation_time,
					number_guests,
					status,
					id,
				]
			);
			res.json({ success: true });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	// Xóa reservation
	async deleteReservation(req, res) {
		const { id } = req.params;
		try {
			await db.execute(
				`DELETE FROM Reservation WHERE reservation_id = ?`,
				[id]
			);
			res.json({ success: true });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
}

module.exports = new ReservationController();
