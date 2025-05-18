// routes/pages.js
const express = require('express');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { pages: { readAll, writeAll, appendPage, addLike, removeLike } } = require('../lib/csvPages');
const { users } = require('../lib/csvUsers');

const router = express.Router();

// Auth middleware to decode JWT and attach user
function auth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }
    const token = authHeader.split(' ')[1];
    try {
        let secret;
        if (!process.env.JWT_SECRET) {
            secret = 'default-jwt-secret';
        } else
            secret = process.env.JWT_SECRET;
        const payload = jwt.verify(token, secret);
        req.user = payload; // { id, username, ... }
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

// Create a new page
router.post('/', auth, async (req, res) => {
    const {
        creatorName,
        reasonOfLeaving,
        themeName,
        bgColor,
        textColor,
        accentColor,
        creatorMessage,
        images = [],
        gifs = [],
        videos = []
    } = req.body;

    if (!creatorName || !reasonOfLeaving || !themeName || !creatorMessage) {
        return res.status(400).json({ error: 'creatorName, reasonOfLeaving, themeName, and creatorMessage are required' });
    }
    const creatorId = req.user.id;
    const date = new Date().toLocaleString('fr-FR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
    const newPage = {
        id: uuidv4(),
        creatorName,
        creatorId,
        reasonOfLeaving,
        themeName,
        bgColor,
        textColor,
        accentColor,
        creatorMessage,
        images,
        gifs,
        videos,
        likedBy: [],
        createdAt: date
    };

    try {
        await appendPage(newPage);
        res.status(201).json(newPage);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save page' });
    }
});

// Read all pages
router.get('/', async (_req, res) => {
    try {
        const pages = await readAll();
        res.json(pages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to read pages' });
    }
});

// GET /api/pages/top-liked/:number
router.get('/top-liked/:number', async (req, res) => {
    try {
        const limit = parseInt(req.params.number, 10);
        if (isNaN(limit) || limit < 1) {
            return res.status(400).json({ error: 'Invalid number parameter' });
        }

        const pages = await readAll();
        // pages have a .likes property from readAll()
        const top = pages
            .slice()                        // clone
            .sort((a, b) => b.likes - a.likes)
            .slice(0, limit);

        res.json(top);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to read pages' });
    }
});

// Read one page
router.get('/:id', async (req, res) => {
    try {
        const pages = await readAll();
        const page = pages.find(p => p.id === req.params.id);
        if (!page) return res.status(404).json({ error: 'Not found' });
        res.json(page);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to read page' });
    }
});

// Update a page
router.put('/:id', auth, async (req, res) => {
    try {
        const pages = await readAll();
        const page = pages.find(p => p.id === req.params.id);
        if (!page) return res.status(404).json({ error: 'Not found' });
        // verify creator
        if (page.creatorName !== req.user.username) {
            return res.status(403).json({ error: 'Forbidden: you are not the creator' });
        }
        // apply update
        const updated = { ...page, ...req.body };
        const modified = pages.map(p => p.id === req.params.id ? updated : p);
        await writeAll(modified);
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update page' });
    }
});

// Delete a page
router.delete('/:id', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const pages = await readAll();
        const filtered = pages.filter(p => p.id !== req.params.id);
        if (filtered.length === pages.length) return res.status(404).json({ error: 'Not found' });
        await writeAll(filtered);
        res.status(204).end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete page' });
    }
});

// Add a like (authenticated)
router.post('/:id/like', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const updated = await addLike(req.params.id, userId);
        if (!updated) return res.status(404).json({ error: 'Page not found or already liked' });
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add like' });
    }
});

// Remove a like (authenticated)
router.post('/:id/unlike', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const updated = await removeLike(req.params.id, userId);
        if (!updated) return res.status(404).json({ error: 'Page not found or no like to remove' });
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to remove like' });
    }
});

module.exports = router;