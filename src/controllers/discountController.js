const db = require("../../db");

class DiscountController {
    // Lấy tất cả discount
    async getAllDiscounts(req, res) {
        try {
            const [rows] = await db.execute(`SELECT * FROM Discount ORDER BY discount_id`);
            // Format date fields to yyyy-mm-dd
            const formattedRows = rows.map(d => ({
                ...d,
                valid_from: d.valid_from ? d.valid_from.toISOString().split('T')[0] : null,
                valid_to: d.valid_to ? d.valid_to.toISOString().split('T')[0] : null
            }));
            res.json(formattedRows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Thêm discount mới
    async createDiscount(req, res) {
        const { code, description, type, value, valid_from, valid_to, min_order_amount, is_active } = req.body;
        try {
            const [result] = await db.execute(
                `INSERT INTO Discount (code, description, type, value, valid_from, valid_to, min_order_amount, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)` ,
                [code, description, type, value, valid_from, valid_to, min_order_amount, is_active !== undefined ? is_active : true]
            );
            res.json({ success: true, discount_id: result.insertId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Cập nhật discount
    async updateDiscount(req, res) {
        const { id } = req.params;
        const { code, description, type, value, valid_from, valid_to, min_order_amount, is_active } = req.body;
        try {
            await db.execute(
                `UPDATE Discount SET code = ?, description = ?, type = ?, value = ?, valid_from = ?, valid_to = ?, min_order_amount = ?, is_active = ? WHERE discount_id = ?`,
                [code, description, type, value, valid_from, valid_to, min_order_amount, is_active, id]
            );
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Xóa discount
    async deleteDiscount(req, res) {
        const { id } = req.params;
        try {
            await db.execute(`DELETE FROM Discount WHERE discount_id = ?`, [id]);
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new DiscountController();
