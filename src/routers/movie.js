const express = require('express');

const router = express.Router();

const { validateToken } = require('../utils');

const {
    getAllMovies,
    getMovie,
    createMovie,
    updateMovie,
    createScreen,
} = require('../controllers/movie.js');

router.get('/', getAllMovies);

router.get('/:movie', getMovie);

router.post('/', validateToken, createMovie);

router.put('/:id', validateToken, updateMovie);

router.post('/screen', validateToken, createScreen);

module.exports = router;
