const express = require('express');
const router = express.Router();
const fredService = require('../services/fredService');

// Browse FRED catalog
router.get('/browse', async (req, res) => {
  try {
    const {
      browse_type = 'categories',
      category_id,
      release_id,
      limit = 50,
      offset = 0,
      order_by,
      sort_order = 'asc'
    } = req.query;

    const result = await fredService.browse({
      browse_type,
      category_id,
      release_id,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order_by,
      sort_order
    });

    res.json(result);
  } catch (error) {
    console.error('Browse error:', error);
    res.status(500).json({ error: 'Failed to browse FRED catalog', message: error.message });
  }
});

// Search FRED series
router.get('/search', async (req, res) => {
  try {
    const {
      search_text,
      search_type = 'full_text',
      limit = 25,
      offset = 0,
      order_by = 'popularity',
      sort_order = 'desc'
    } = req.query;

    const result = await fredService.search({
      search_text,
      search_type,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order_by,
      sort_order
    });

    res.json(result);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search FRED data', message: error.message });
  }
});

// Get series data
router.get('/series/:seriesId', async (req, res) => {
  try {
    const { seriesId } = req.params;
    const {
      observation_start,
      observation_end,
      limit,
      offset = 0,
      sort_order = 'asc',
      units = 'lin',
      frequency,
      aggregation_method = 'avg'
    } = req.query;

    const result = await fredService.getSeries({
      series_id: seriesId,
      observation_start,
      observation_end,
      limit: limit ? parseInt(limit) : undefined,
      offset: parseInt(offset),
      sort_order,
      units,
      frequency,
      aggregation_method
    });

    res.json(result);
  } catch (error) {
    console.error('Series data error:', error);
    res.status(500).json({ error: 'Failed to get series data', message: error.message });
  }
});

module.exports = router;