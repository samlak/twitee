const express = require('express');

const SeedController = require('../controllers/seedController');
const TwitController= require('../controllers/twitController');
const AuthController = require('../controllers/authController');

const {authenticate} = require('../middleware/authenticate')

const router = express.Router();

// Authentication Routes
router.get('/login',  authenticate, async (req, res) => {
    await AuthController.loginPage(req, res);
});

router.post('/login', async (req, res) => {
    await AuthController.login(req, res);
});

router.get('/register', authenticate, async (req, res) => {
    await AuthController.registerPage(req, res);
});

router.post('/register', async (req, res) => {
    await AuthController.register(req, res);
});

router.get('/logout', authenticate, async (req, res) => {
    await AuthController.logout(req, res);
});

// Twit control Routes
router.get('/', authenticate, async (req, res) => {
    await TwitController.loadTwits(req, res);
});

router.post('/twit', authenticate, async (req, res) => {
    await TwitController.createTwit(req, res);
});

router.post('/deletetwit', authenticate, async (req, res) => {
    await TwitController.deleteTwit(req, res);
});

router.post('/comment', authenticate, async (req, res) => {
    await TwitController.postComment(req, res);
});

router.post('/like', authenticate, async (req, res) => {
    await TwitController.likeTwit(req, res);
});

router.get('/seed', async (req, res) => {
    await SeedController.seedToDB(req, res);
});

module.exports = router;