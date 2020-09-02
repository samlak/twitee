process.env.NODE_ENV = "test";
const request = require('supertest');

// const {app} = require('../app');
const agent = request.agent(app)

const {comments} = require('../data/comments');
const {users} = require('../data/users');
const {twits} = require('../data/twits');

const {Twit} = require('../models/Twit');
const {User} = require('../models/User');
const {Comment} = require('../models/Comment');

const  { seedToDB } = require('./seed/seed');

beforeEach(seedToDB);
