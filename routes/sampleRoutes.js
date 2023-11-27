// routes/sampleRoutes.js

const express = require('express');
const router = express.Router();

const {
  createSample,
  getAllSamples,
  getSampleById,
  updateSampleById,
  deleteSampleById,
} = require('../controllers/sampleController');

// Create a sample
router.post('/', createSample);

// Retrieve all samples
router.get('/', getAllSamples);

// Retrieve a sample by ID
router.get('/:id', getSampleById);

// Update a sample by ID
router.put('/:id', updateSampleById);

// Delete a sample by ID
router.delete('/:id', deleteSampleById);

module.exports = router;
