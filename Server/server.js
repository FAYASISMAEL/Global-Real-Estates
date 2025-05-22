import express from 'express';

const app = express();
app.use(express.json());

const port = 3000;

app.get('/', (req, res) => {
  res.send("Server is online");
});

app.listen(port, () => console.log(`Server running on port http://localhost:${port}`));