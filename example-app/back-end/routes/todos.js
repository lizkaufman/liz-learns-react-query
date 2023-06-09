const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'todos.json');

// Utility function to read the data file
async function readDataFile() {
  const data = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

// GET all todos
router.get('/', async (req, res) => {
  const data = await readDataFile();
  res.json(data);
});

// GET a single todo by ID
router.get('/:id', async (req, res) => {
  const data = await readDataFile();
  const todo = data.find(item => item.id === Number(req.params.id));
  res.json(todo);
});

// POST a new todo
router.post('/', async (req, res) => {
  const newTodo = req.body;
  const data = await readDataFile();
  data.push(newTodo);
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
  res.json(newTodo);
});

// PUT (update) a todo by ID
router.put('/:id', async (req, res) => {
  const updatedTodo = req.body;
  console.log('Updated todo from body: ', updatedTodo)
  let data = await readDataFile();
  data = data.map(todo =>
    String(todo.id) === req.params.id ? updatedTodo : todo
  );
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
  res.json(updatedTodo);
});

// DELETE a todo by ID
router.delete('/:id', async (req, res) => {
  let data = await readDataFile();
  data = data.filter(todo => String(todo.id) !== req.params.id);
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
  res.json({ id: req.params.id });
});

module.exports = router;
