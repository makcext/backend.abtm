import express from 'express';
import { json } from 'express';

const app = express();

app.use(json());

app.get('/api', (req, res) => {
  const result = 3 * 4;
  res.json({ result });
});

const port = process.env.PORT || 3002;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});