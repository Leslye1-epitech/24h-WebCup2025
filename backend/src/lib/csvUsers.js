// lib/csvUsers.js
const userFs = require('fs');
const userPath = require('path');
const USER_CSV = userPath.join(__dirname, '../data/users.csv');
const HEADER_LINE = 'id,username,password,createdAt\n';

// Ensure the file exists and has exactly one header line:
if (!userFs.existsSync(USER_CSV) || userFs.readFileSync(USER_CSV, 'utf8').trim() === '') {
    // This will overwrite any empty file or create a brand‐new one:
    userFs.writeFileSync(USER_CSV, HEADER_LINE, 'utf8');
}

const userCsv = require('csv-parser');
const { createObjectCsvWriter: createCsvWriter } = require('csv-writer');

const userWriter = createCsvWriter({
    path: USER_CSV,
    header: [
        { id: 'id', title: 'id' },
        { id: 'username', title: 'username' },
        { id: 'password', title: 'password' },
        { id: 'createdAt', title: 'createdAt' }
    ],
    append: true,
});

function readAllUsers() {
    return new Promise((resolve, reject) => {
        const users = [];
        userFs.createReadStream(USER_CSV)
            .pipe(userCsv())
            .on('data', row => users.push(row))
            .on('end', () => resolve(users))
            .on('error', reject);
    });
}

function writeAllUsers(records) {
    const csvWriter = createCsvWriter({
        path: USER_CSV,
        header: userWriter.header,
        append: false,
    });
    return csvWriter.writeRecords(records);
}

async function ensureHeader() {
    if (!userFs.existsSync(USER_CSV) || userFs.statSync(USER_CSV).size === 0) {
        const headerOnly = createCsvWriter({ path: USER_CSV, header: userWriter.header, append: false });
        await headerOnly.writeRecords([]);
    }
}

module.exports = {
    users: { readAllUsers, writeAllUsers, userWriter },
    init: ensureHeader
};