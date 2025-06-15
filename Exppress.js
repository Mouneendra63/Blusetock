const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ------------------- CRUD IPO ROUTES -------------------

// 1. Get all IPOs
app.get('/api/ipos', async (req, res) => {
  try {
    const ipos = await prisma.ipo.findMany();
    res.json(ipos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch IPOs' });
  }
});

// 2. Create a new IPO
app.post('/api/ipos', async (req, res) => {
  const { companyName, priceBand, issueSize, openDate, closeDate } = req.body;
  try {
    const newIPO = await prisma.ipo.create({
      data: { companyName, priceBand, issueSize, openDate, closeDate },
    });
    res.status(201).json(newIPO);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create IPO' });
  }
});

// 3. Update an IPO by ID
app.put('/api/ipos/:id', async (req, res) => {
  const { id } = req.params;
  const { priceBand, issueSize, status } = req.body;
  try {
    const updatedIPO = await prisma.ipo.update({
      where: { id: Number(id) },
      data: { priceBand, issueSize, status },
    });
    res.json(updatedIPO);
  } catch (err) {
    res.status(404).json({ error: 'IPO not found or update failed' });
  }
});

// 4. Delete an IPO by ID
app.delete('/api/ipos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.ipo.delete({ where: { id: Number(id) } });
    res.json({ message: 'IPO deleted successfully' });
  } catch (err) {
    res.status(404).json({ error: 'Failed to delete IPO' });
  }
});

// ------------------- SERVER -------------------
app.listen(PORT, () => {
  console.log(`Bluestock IPO backend running at http://localhost:${PORT}`);
});
