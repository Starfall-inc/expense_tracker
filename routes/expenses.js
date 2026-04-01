const express = require('express');
const router = express.Router();
const db = require('../db/database');
const authenticate = require('../middleware/auth');

// Apply authentication to all expense routes
router.use(authenticate);

// GET Dashboard (All Expenses)
router.get('/', (req, res) => {
  const expenses = db.prepare(`
    SELECT e.*, c.name as category_name 
    FROM expenses e 
    LEFT JOIN categories c ON e.category_id = c.id 
    WHERE e.user_id = ? 
    ORDER BY e.date DESC
  `).all(req.user.id);

  const categories = db.prepare('SELECT * FROM categories WHERE user_id IS NULL OR user_id = ?').all(req.user.id);
  
  const totalIncome = expenses.filter(e => e.type === 'income').reduce((sum, exp) => sum + exp.amount, 0);
  const totalExpenses = expenses.filter(e => e.type === 'expense').reduce((sum, exp) => sum + exp.amount, 0);
  const totalBalance = totalIncome - totalExpenses;

  // Data for chart (grouped by type and category)
  const chartData = db.prepare(`
    SELECT c.name, SUM(e.amount) as total, e.type 
    FROM expenses e 
    JOIN categories c ON e.category_id = c.id 
    WHERE e.user_id = ? 
    GROUP BY c.id, e.type
  `).all(req.user.id);

  res.render('dashboard', { 
    expenses, 
    categories, 
    totalBalance, 
    totalIncome, 
    totalExpenses, 
    user: req.user, 
    chartData,
    page: 'dashboard'
  });
});

// GET History (Full Transaction List)
router.get('/history', (req, res) => {
  const expenses = db.prepare(`
    SELECT e.*, c.name as category_name 
    FROM expenses e 
    LEFT JOIN categories c ON e.category_id = c.id 
    WHERE e.user_id = ? 
    ORDER BY e.date DESC
  `).all(req.user.id);

  // Fetch daily trends (last 30 days)
  const dailyTrends = db.prepare(`
    SELECT strftime('%Y-%m-%d', date) as day, 
           SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
           SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
    FROM expenses 
    WHERE user_id = ? 
    GROUP BY day 
    ORDER BY day ASC 
    LIMIT 30
  `).all(req.user.id);

  // Fetch monthly trends
  const monthlyTrends = db.prepare(`
    SELECT strftime('%Y-%m', date) as month, 
           SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
           SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
    FROM expenses 
    WHERE user_id = ? 
    GROUP BY month 
    ORDER BY month ASC
  `).all(req.user.id);

  res.render('history', { 
    expenses, 
    user: req.user,
    page: 'history',
    dailyTrends,
    monthlyTrends
  });
});

// POST Add Expense/Income
router.post('/add', (req, res) => {
  const { amount, description, date, category_id, type } = req.body;
  db.prepare('INSERT INTO expenses (amount, description, date, category_id, user_id, type) VALUES (?, ?, ?, ?, ?, ?)')
    .run(amount, description, date, category_id, req.user.id, type || 'expense');
  res.redirect('/');
});

// POST Delete Expense
router.post('/delete/:id', (req, res) => {
  db.prepare('DELETE FROM expenses WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  res.redirect('/');
});

module.exports = router;
