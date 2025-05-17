// lib/csvPages.js
const fs = require('fs');
const path = require('path');
const CSV_PATH = path.join(__dirname, '../data/pages.csv');
const HEADER_LINE = 'id,creatorName,creatorId,reasonOfLeaving,themeName,bgColor,textColor,accentColor,creatorMessage,images,gifs,videos,likedBy,createdAt\n';

// Ensure the file exists and has exactly one header line:
if (!fs.existsSync(CSV_PATH) || fs.readFileSync(CSV_PATH, 'utf8').trim() === '') {
  // This will overwrite any empty file or create a brand‐new one:
  fs.writeFileSync(CSV_PATH, HEADER_LINE, 'utf8');
}

const csv = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');

// define header once
const PAGE_HEADER = [
  { id: 'id', title: 'id' },
  { id: 'creatorName', title: 'creatorName' },
  { id: 'creatorId', title: 'creatorId' },
  { id: 'reasonOfLeaving', title: 'reasonOfLeaving' },
  { id: 'themeName', title: 'themeName' },
  { id: 'bgColor', title: 'bgColor' },
  { id: 'textColor', title: 'textColor' },
  { id: 'accentColor', title: 'accentColor' },
  { id: 'creatorMessage', title: 'creatorMessage' },
  { id: 'images', title: 'images' },       // semicolon-separated
  { id: 'gifs', title: 'gifs' },
  { id: 'videos', title: 'videos' },
  { id: 'likedBy', title: 'likedBy' },    // semicolon-separated user IDs
  { id: 'createdAt', title: 'createdAt' }
];

// append-only writer
const csvAppender = createObjectCsvWriter({
  path: CSV_PATH,
  header: PAGE_HEADER,
  append: true,
});

// reads all rows into an array of objects, parsing array fields
function readAll() {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(CSV_PATH)
      .pipe(csv())
      .on('data', row => {
        row.images = row.images ? row.images.split(';') : [];
        row.gifs = row.gifs ? row.gifs.split(';') : [];
        row.videos = row.videos ? row.videos.split(';') : [];
        row.likedBy = row.likedBy ? row.likedBy.split(';') : [];
        row.likes = row.likedBy.length;
        results.push(row);
      })
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

// overwrite entire CSV (used for update/delete)
function writeAll(records) {
  const csvWriter = createObjectCsvWriter({ path: CSV_PATH, header: PAGE_HEADER, append: false });
  const flat = records.map(r => ({
    ...r,
    images: Array.isArray(r.images) ? r.images.join(';') : r.images,
    gifs: Array.isArray(r.gifs) ? r.gifs.join(';') : r.gifs,
    videos: Array.isArray(r.videos) ? r.videos.join(';') : r.videos,
    likedBy: Array.isArray(r.likedBy) ? r.likedBy.join(';') : r.likedBy || '',
    createdAt: r.createdAt
  }));
  return csvWriter.writeRecords(flat);
}

function appendPage(record) {
  // flatten arrays into semicolon-separated strings
  const flat = {
    ...record,
    images: Array.isArray(record.images) ? record.images.join(';') : record.images,
    gifs: Array.isArray(record.gifs) ? record.gifs.join(';') : record.gifs,
    videos: Array.isArray(record.videos) ? record.videos.join(';') : record.videos,
    likedBy: record.likedBy ? record.likedBy.join(';') : '',
    createdAt: record.createdAt || new Date().toISOString(),
  };
  return csvAppender.writeRecords([flat]);
}

async function addLike(pageId, userId) {
  const pages = await readAll();
  let updated = null;
  const modified = pages.map(p => {
    if (p.id === pageId) {
      if (!p.likedBy.includes(userId)) {
        const newLikedBy = [...p.likedBy, userId];
        updated = { ...p, likedBy: newLikedBy, likes: newLikedBy.length };
        return updated;
      }
    }
    return p;
  });
  if (!updated) return null;
  await writeAll(modified);
  return updated;
}

async function removeLike(pageId, userId) {
  const pages = await readAll();
  let updated = null;
  const modified = pages.map(p => {
    if (p.id === pageId && p.likedBy.includes(userId)) {
      const newLikedBy = p.likedBy.filter(u => u !== userId);
      updated = { ...p, likedBy: newLikedBy, likes: newLikedBy.length };
      return updated;
    }
    return p;
  });
  if (!updated) return null;
  await writeAll(modified);
  return updated;
}

async function ensurePagesHeader() {
  if (!fs.existsSync(CSV_PATH) || fs.statSync(CSV_PATH).size === 0) {
    const headerOnly = createCsvWriter({ path: CSV_PATH, header: csvAppender.header, append: false });
    await headerOnly.writeRecords([]);
  }
}

module.exports = {
  pages: { readAll, writeAll, csvAppender, appendPage, addLike, removeLike },
  init: ensurePagesHeader
};