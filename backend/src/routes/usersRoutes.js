const express = require('express');
const { readAll, writeAll, csvAppender } = require('../lib/csvPages');
const { users } = require('../lib/csvUsers');
const router = express.Router();

// Protected middleware
function auth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).end();
    const token = authHeader.split(' ')[1];
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        res.status(401).end();
    }
}

// CRUD for users (protected)
router.get('/users', auth, async (req, res) => {
    const all = await users.readAllUsers();
    res.json(all.map(u => ({ id: u.id, username: u.username, email: u.email, createdAt: u.createdAt })));
});
router.get('/users/:id', auth, async (req, res) => {
    const all = await users.readAllUsers();
    const one = all.find(u => u.id === req.params.id);
    one ? res.json({ id: one.id, username: one.username, email: one.email, createdAt: one.createdAt }) : res.status(404).end();
});
router.put('/users/:id', auth, async (req, res) => {
    const all = await users.readAllUsers();
    let updated;
    const updatedList = await Promise.all(all.map(async u => {
        if (u.id === req.params.id) {
            updated = { ...u, ...req.body };
            if (req.body.password) {
                updated.password = await bcrypt.hash(req.body.password, 10);
            }
            return updated;
        }
        return u;
    }));
    if (!updated) return res.status(404).end();
    await users.writeAllUsers(updatedList);
    res.json({ id: updated.id, username: updated.username, email: updated.email, createdAt: updated.createdAt });
});
router.delete('/users/:id', auth, async (req, res) => {
    const all = await users.readAllUsers();
    const filtered = all.filter(u => u.id !== req.params.id);
    if (filtered.length === all.length)
        return res.status(404).end();
    await users.writeAllUsers(filtered);
    res.status(204).end();
});

module.exports = router;