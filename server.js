const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
const {
    readFromFile,
    readAndAppend,
    writeToFile,
  } = require('./fsUtils');

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

// DELETE Route 
app.delete('/api/notes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    readFromFile('db/db.json')
      .then((data) => JSON.parse(data))
      .then((json) => {
        // Make a new array of all tips except the one with the ID provided in the URL
        const result = json.filter((note) => note.id !== id);
        console.log(result);
        // Save that array to the filesystem
        writeToFile('db/db.json', result);
  
        // Respond to the DELETE request
        res.json(result);
      });
  });

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});