const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../database/dbMethods')
const authenticate = require('./authenticate')