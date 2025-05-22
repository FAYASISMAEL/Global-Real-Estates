import express from 'express';

const data_routes = express.Router();

data_routes.post('/login', login)