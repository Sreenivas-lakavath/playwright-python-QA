const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// lowdb v1 usage
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const dbPath = path.join(__dirname, 'db.json');
const adapter = new FileSync(dbPath);
const db = low(adapter);

db.defaults({ users: [], products: [], sessions: [] }).write();

// Simple auth endpoint
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  // This is a mock - accept any username/password for demo purposes
  if (!username) return res.status(400).json({ error: 'username required' });
  const token = `mock-token-${Date.now()}`;
  db.get('sessions').push({ token, username, createdAt: Date.now() }).write();
  res.json({ token, username });
});

// Users
app.get('/api/users', (req, res) => {
  const users = db.get('users').value();
  res.json(users);
});

app.post('/api/users', (req, res) => {
  const user = req.body;
  if (!user || !user.username) return res.status(400).json({ error: 'username required' });
  const id = Date.now();
  const newUser = Object.assign({ id }, user);
  db.get('users').push(newUser).write();
  res.status(201).json(newUser);
});

// Products
app.get('/api/products', (req, res) => {
  const products = db.get('products').value();
  res.json(products);
});

app.post('/api/products', (req, res) => {
  const product = req.body;
  if (!product || !product.title) return res.status(400).json({ error: 'title required' });
  const id = Date.now();
  const newProduct = Object.assign({ id }, product);
  db.get('products').push(newProduct).write();
  res.status(201).json(newProduct);
});

// Health
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Backend listening on http://localhost:${port}`));
