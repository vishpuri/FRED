const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const fredRoutes = require('./routes/fred');
const queryProcessor = require('./services/queryProcessor');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/fred', fredRoutes);

// Natural language query endpoint
app.post('/api/query', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    console.log(`Processing query: ${query}`);
    
    // Process the natural language query
    const result = await queryProcessor.processQuery(query);
    
    res.json(result);
  } catch (error) {
    console.error('Query processing error:', error);
    res.status(500).json({ 
      error: 'Failed to process query',
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    mcpServerConnected: process.env.FRED_API_KEY ? true : false
  });
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`FRED API Key configured: ${process.env.FRED_API_KEY ? 'Yes' : 'No'}`);
});
