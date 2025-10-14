import express, { Request, Response } from 'express';
import path from 'path';

const app = express();
const PORT = 4002;

// Adds json parsing middleware
app.use(express.json());

// Setup static directory to serve
const root = path.join(__dirname, '/out/');
app.use(express.static(root));

app.get('*', (req: Request, res: Response) => {
  res.sendFile('index.html', { root });
});

// console.log that your server is up and running
app.listen(PORT);

console.log(`trang quản lý on port ${PORT}`);

