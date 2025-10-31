const express = require('express');
const app = express();

app.use(express.json());

// Calculator functions
const calculator = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => {
    if (b === 0) throw new Error('Division by zero');
    return a / b;
  }
};

// User management
let users = [];
let nextId = 1;

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to CI/CD Demo API' });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Calculator endpoints
app.post('/api/calculate', (req, res) => {
  const { operation, a, b } = req.body;
  
  if (!operation || a === undefined || b === undefined) {
    return res.status(400).json({ error: 'Missing parameters' });
  }
  
  try {
    const result = calculator[operation](a, b);
    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// User endpoints
app.get('/api/users', (req, res) => {
  res.json(users);
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email required' });
  }
  
  const user = { id: nextId++, name, email };
  users.push(user);
  res.status(201).json(user);
});

app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

// Export for testing
module.exports = { app, calculator };