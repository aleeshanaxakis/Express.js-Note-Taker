// Import required modules and initialise Express
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Import utility functions for the file operations
const {
    readFromFile,
    readAndAppend,
    writeToFile,
  } = require('./fsUtils');

// Middleware 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// HTML Routes

// Route to serve notes.html 
app.get('/notes', (req, res) => {
  console.log('Accessed /notes route');
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// API Routes

// Route to get notes from db.json
app.get('/api/notes', (req, res) => {
  const dbFilePath = 'db/db.json';
  const notes = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
  console.log(notes);
  res.json(notes);
});

// Route to add a new note to db.json
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

// Route to delete a note from db.json
app.delete('/api/notes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    readFromFile('db/db.json')
      .then((data) => JSON.parse(data))
      .then((json) => {
        // Make a new array of all notes except the one with the ID provided in the URL
        const result = json.filter((note) => note.id !== id);
        console.log(result);
        // Save that array to the filesystem
        writeToFile('db/db.json', result);
  
        // Respond to the DELETE request
        res.json(result);
      });
  });

// Catch-all route to serve index.html for any other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});