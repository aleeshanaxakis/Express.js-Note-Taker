const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// HTML Routes
app.get('/notes', (req, res) => {
  console.log('Accessed /notes route');
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// API Routes
app.get('/api/notes', (req, res) => {
  const dbFilePath = 'db/db.json';
  const notes = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
  console.log(notes);
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const dbFilePath = 'db/db.json';
  const notes = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
  const newNote = req.body;
  newNote.id = notes.length + 1;
  notes.push(newNote);
  fs.writeFileSync(dbFilePath, JSON.stringify(notes));
  res.json(newNote);
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});