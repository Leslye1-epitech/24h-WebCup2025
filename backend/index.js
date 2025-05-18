if (typeof (PhusionPassenger) !== 'undefined') {
    PhusionPassenger.configure({ autoInstall: false });
}
var express = require('express');
var app = express();
var pagesRoutes = require('./src/routes/pagesRoutes.js');
var usersRoutes = require('./src/routes/usersRoutes.js');

const { init: ensureHeader } = require('./src/lib/csvUsers');
const { init: ensurePagesHeader } = require('./src/lib/csvPages');

async function initUsersFile() {
    await ensureHeader();
}
initUsersFile();

async function initPagesFile() {
    await ensurePagesHeader();
}
initPagesFile();

const cors = require('cors');
const { users } = require('./src/lib/csvUsers');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const upload = multer({ dest: 'uploads/' }); // store in /uploads

require('dotenv').config();
// enable CORS for your frontend (adjust origin to your React URL)

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());

// Register
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username)
        return res.status(400).json({ error: 'Un nom d\'utilisateur est requis' });
    if (!password)
        return res.status(400).json({ error: 'Un mot de passe est requis' });
    const allUsers = await users.readAllUsers();
    if (allUsers.find(u => u.username === username))
        return res.status(409).json({ error: 'L\'utilisateur exite déjà' });
    const hash = await bcrypt.hash(password, 10);
    const newUser = { id: uuidv4(), username, password: hash, createdAt: new Date().toISOString() };
    await users.userWriter.writeRecords([newUser]);
    res.status(201).json({ id: newUser.id, username });
});

// Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const allUsers = await users.readAllUsers();
    console.log(allUsers);
    const user = allUsers.find(u => u.username === username);
    if (!user)
        return res.status(401).json({ error: 'Utilisateur ou mot de passe incorrect' });
    const match = await bcrypt.compare(password, user.password);
    if (!match)
        return res.status(401).json({ error: 'Utilisateur ou mot de passe incorrect' });
    const token = jwt.sign({ id: user.id, username }, process.env.JWT_SECRET || 'default-jwt-secret', { expiresIn: '1h' });
    res.json({ token });
});

app.get('/api', function (req, res) {
    var body = 'Hello World';
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Length', body.length);
    res.end(body);
});

app.post('/api/upload', upload.single('file'), (req, res) => {
    console.log(req);
    console.log(req.file);
    const fileUrl = `${req.file.filename}`;
    res.json({ url: fileUrl });
});

app.use("/api/pages", pagesRoutes);
app.use("/api/users", usersRoutes);

if (typeof (PhusionPassenger) !== 'undefined') {
    app.listen('passenger');
} else {
    app.listen(8000);
}