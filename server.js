// server.js

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 3000;

//  Middleware Setup 
app.use(cors());                     // Enable CORS
app.use(express.json());             // Parse JSON 
app.use(express.static(path.join(__dirname, ''))); // Serve static files

const recipesFile = path.join(__dirname, 'saved-recipes.json'); // JSON file for recipes


// Read JSON from file safely
function readJSON(filePath) {
  if (!fs.existsSync(filePath)) return []; // Return empty array if file doesn't exist
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// Write JSON to file
function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// GET all recipes
app.get('/recipes', (req, res) => {
  try {
    const recipes = readJSON(recipesFile);
    res.json(recipes);
  } catch {
    res.status(500).json({ error: 'Failed to read recipes' });
  }
});

// POST new recipe
app.post('/recipes', (req, res) => {
  try {
    const { title, ingredients, steps } = req.body;
    if (!title || !ingredients || !steps) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const recipes = readJSON(recipesFile);
    const newRecipe = {
      id: Date.now().toString(), // Unique ID
      title,
      ingredients,
      steps
    };

    recipes.push(newRecipe);
    writeJSON(recipesFile, recipes);

    res.status(201).json(newRecipe);
  } catch {
    res.status(500).json({ error: 'Failed to save recipe' });
  }
});

// GET single recipe
app.get('/recipes/:id', (req, res) => {
  try {
    const recipes = readJSON(recipesFile);
    const recipe = recipes.find(r => r.id === req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.json(recipe);
  } catch {
    res.status(500).json({ error: 'Failed to read recipe' });
  }
});

// DELETE recipe
app.delete('/recipes/:id', (req, res) => {
  try {
    const recipes = readJSON(recipesFile);
    const index = recipes.findIndex(r => r.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Recipe not found' });

    const removed = recipes.splice(index, 1);
    writeJSON(recipesFile, recipes);

    res.json({ message: 'Recipe deleted successfully', removed: removed[0] });
  } catch {
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
});

// start server
app.listen(PORT, () => {
  console.log(`Recipe Planner running at http://localhost:${PORT}`);
});
