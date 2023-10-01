import express from 'express';
import { json } from 'express';

const app = express();

app.use(json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.get('/status', (req, res) => {
  const result = 'ok';
  res.json({ result });
});

const port = process.env.PORT || 3003;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});