const express = require('express');
const db = require('../db/database');
const router = express.Router();

// Middleware for input validation
const validateTransaction = (req, res, next) => {
    const { type, category, amount, date } = req.body;
    if (!type || !category || !amount || !date) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    if (!['income', 'expense'].includes(type)) {
        return res.status(400).json({ error: 'Invalid transaction type' });
    }
    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: 'Amount must be a positive number' });
    }
    next();
};

// POST /transactions
router.post('/', validateTransaction, (req, res) => {
    const { type, category, amount, date, description } = req.body;
    const sql = `INSERT INTO transactions (type, category, amount, date, description) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [type, category, amount, date, description], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID });
    });
});

// GET /transactions
router.get('/', (req, res) => {
    db.all(`SELECT * FROM transactions`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// GET /transactions/:id
router.get('/:id', (req, res) => {
    const sql = `SELECT * FROM transactions WHERE id = ?`;
    db.get(sql, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Transaction not found' });
        res.json(row);
    });
});

// PUT /transactions/:id
router.put('/:id', validateTransaction, (req, res) => {
    const { type, category, amount, date, description } = req.body;
    const sql = `UPDATE transactions SET type = ?, category = ?, amount = ?, date = ?, description = ? WHERE id = ?`;
    db.run(sql, [type, category, amount, date, description, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Transaction not found' });
        res.json({ message: 'Transaction updated' });
    });
});

// DELETE /transactions/:id
router.delete('/:id', (req, res) => {
    const sql = `DELETE FROM transactions WHERE id = ?`;
    db.run(sql, [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Transaction not found' });
        res.json({ message: 'Transaction deleted' });
    });
});

// GET /summary
router.get('/summary', (req, res) => {
    const sql = `
        SELECT type, SUM(amount) as total
        FROM transactions
        GROUP BY type
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

module.exports = router;

