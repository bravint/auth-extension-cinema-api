const express = require('express');

const router = express.Router();

const { checkRole, validateToken } = require('../utils');

const {
    getAllMovies,
    getMovie,
    createMovie,
    updateMovie,
    createScreen,
} = require('../controllers/movie.js');

router.get('/', getAllMovies);

router.get('/:movie', getMovie);

router.post('/', validateToken, checkRole, createMovie);

router.put('/:id', validateToken, checkRole, updateMovie);

router.post('/screen', validateToken, checkRole, createScreen);

module.exports = router;
